import Vue from "vue"
import Component from "vue-class-component"
import template from './element-tools.html'
import './element-tools.scss'
import project from "../../services/project"
import { Prop } from "vue-property-decorator"
import renderer from "../../services/renderer"
import FontPicker from "../font-picker/font-picker";
import app from "../../services/app";

@Component({
    template,
    components: {
        'font-picker': FontPicker
    },
    propsData: {
        element: null,
        pageId: null
    }
})

export default class ElementTools extends Vue {
    name = `element-tools`
    project = project
    renderer = renderer
    app = app

    moverDown = false
    resizerDown = false

    @Prop()
    element: node = this.element

    @Prop()
    pageId: string = this.pageId

    repositionTooltip = 1

    hasSelectedText() {
        try {
            return window.getSelection().type !== `none`
        } catch (error) {
            return false
        }
    }

    selectAllText() {

        const el = this.getTextElement(`.editable-text-element`)

        if (!el) {
            return
        }

        const selection = window.getSelection()
        const range = document.createRange()
        range.selectNodeContents(el)
        selection.removeAllRanges()
        selection.addRange(range)
    }

    activate() {
        this.renderer.activate(this.element)
    }

    resize() {        
        this.repositionTooltip = this.repositionTooltip + 1

        document.body.classList.add(`dragging-elements`)

        const el = this.$el.parentElement
        const page = document.getElementById(`page`) as HTMLElement

        if (!el) {
            return
        }

        const handleMove = (ev: Event) => {
            let pageX = ((ev as any).pageX || (ev as any).targetTouches[0].pageX) + 13            

            if (!page) {
                return
            }

            const box = page.getBoundingClientRect()
            const elBox = el.getBoundingClientRect()
            let width = ((pageX - elBox.left) / box.width) * 100

            if (width < 5) {
                width = 5
            }

            if (width > 100) {
                width = 100
            }

            let cols = Math.round(project.totalColumns * (width / 100))

            if(this.project.data){
                this.project.data.elements[this.element.id].colSpan = cols
            }
        }

        const handleRelease = () => {
            window.removeEventListener(`mousemove`, handleMove)
            window.removeEventListener(`mouseup`, handleRelease)
            window.removeEventListener(`mouseleave`, handleRelease)
            this.project.savePage(this.pageId)
            document.body.classList.remove(`dragging-elements`)
        }

        handleMove.bind(this)
        handleRelease.bind(this)

        window.addEventListener(`mousemove`, handleMove)
        window.addEventListener(`mouseup`, handleRelease)
        window.addEventListener(`mouseleave`, handleRelease)
    }

    execCommand(command: string, value: any) {
        if (!this.hasSelectedText()) {
            this.selectAllText()
        }

        document.execCommand("styleWithCSS", false, "true")
        document.execCommand(command, false, value || '')

        if (this.element.type === `text` && command === `foreColor`) {
            const el = this.getTextElement(`.editable-text-element`)
            let element = window.getSelection().getRangeAt(0).commonAncestorContainer as HTMLElement

            if (element) {
                if (element.querySelector) {
                    let isUL = element.nodeName.toLocaleLowerCase() === `ul` || !!element.querySelector(`ul`)
                    let isOL = element.nodeName.toLocaleLowerCase() === `ol` || !!element.querySelector(`ol`)
                    let isLI = element.nodeName.toLocaleLowerCase() === `li`

                    if (isUL || isOL || isLI) {
                        if (element === el) {
                            const div = document.createElement(`div`)
                            div.innerHTML = element.innerHTML
                            element.innerHTML = ``
                            element.appendChild(div)
                            element = div
                        }

                        element.style.color = value
                    }
                }

                if (!element.querySelector) {
                    let li
                    let current = element.parentNode
                    let currentEl = element.parentElement

                    while (!li && currentEl && current && current !== el) {
                        if (current.nodeName.toLocaleLowerCase() === `li`) {
                            li = currentEl
                            if (li) {
                                li.style.color = value
                            }
                        } else {
                            current = current.parentNode
                            currentEl = current ? current.parentElement : null
                        }
                    }

                }
            }
        }
    }

    getTextElement(subElement?: string) {
        return document.body.querySelector(`#element-${this.element.id}${subElement ? ` ${subElement}` : ``}`)
    }

    setElementText() {
        const el = this.getTextElement(`.editable-text-element`)

        if (!el || !this.project.isEditing || this.element.type !== `text`) {
            return
        }

        renderer.clearEmptyElements()
        this.element.content[0] = el.innerHTML
        this.project.savePage(this.pageId)
    }

    changeFont(font: string) {
        this.selectAllText()
        this.execCommand(`formatBlock`, font)
    }

    setBackgroundColor(color: string) {
        this.element.background = color
        this.project.savePage(this.pageId)
    }

    getColor(color: string) {
        return { background: color }
    }

    getCurrentColor() {
        let color: string | null = `#000`;

        if (document.activeElement && window.getSelection) {
            let sel = window.getSelection()

            if (sel && sel.rangeCount) {
                let range = sel.getRangeAt(0)

                if (range && range.commonAncestorContainer && range.commonAncestorContainer.nodeName !== `#text`) {
                    color = window.getComputedStyle(range.commonAncestorContainer as Element).color
                }
            }
        }

        return { background: color || `#000` }
    }

    togglePublish(){
        this.element.published = !this.element.published
        this.project.savePage(this.pageId)
    }

    toggleGlobal(){
        this.element.global = !this.element.global
        this.project.savePage(this.pageId)
    }
}
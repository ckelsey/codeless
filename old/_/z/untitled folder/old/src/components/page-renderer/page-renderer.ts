import Vue from "vue"
import Component from "vue-class-component"
import template from './page-renderer.html'
import './page-renderer.scss'
import project from "../../services/project"
import PrimitiveElement from "../primitive-element/primitive-element"
import renderer from "../../services/renderer"
import { Prop } from "vue-property-decorator";
import NavItem from "../nav-item/nav-item";
import TopBar from "../top-bar/top-bar";
import auth from "../../services/auth";
import app from "../../services/app";

@Component({
    template,
    components: {
        'primitive-element': PrimitiveElement,
        'nav-item': NavItem,
        'top-bar': TopBar
    },
    propsData: {
        pageId: null
    }
})

export default class PageRenderer extends Vue {
    name = `page-renderer`
    project = project
    renderer = renderer
    auth = auth
    app = app

    @Prop()
    pageId: string = this.pageId

    get editorClass() {
        const classes = []

        if (this.project.isEditing) {
            classes.push(`editor-mode`)
        }

        return classes.join(` `)
    }

    get content() {
        return this.project.data ? this.project.data.pages[this.pageId].data : null
    }

    dialogueScrimClick(e: Event, _class: string) {
        const target = e.target as HTMLElement
        const dialogue = this.$el.querySelector(`.${_class}`)

        if (!dialogue) {
            return
        }

        if (target !== dialogue && !dialogue.contains(target)) {
            (this as any)[_class] = false
        }
    }

    mounted() {
        window.document.body.addEventListener(`click`, (e) => {
            let target = e.target as HTMLElement
            let targetPrimitive = renderer.findParentPrimitive(target)
            let dialogues = window.document.body.querySelectorAll(`.dialogue-wrapper`)
            let fromDialogue = false

            if (dialogues) {
                for (let i = 0; i < dialogues.length; i++) {
                    if (target === dialogues[i] || dialogues[i].contains(target)) {
                        fromDialogue = true
                        break
                    }
                }
            }

            if (!targetPrimitive && !fromDialogue && !renderer.linkDialogueActive && !renderer.selectingLinkElement && !renderer.imageUploadDialogueActive && !renderer.navItemDialogue) {
                const activeElement = renderer.getActiveElement()

                if (activeElement && this.project.data) {
                    this.project.data.elements[activeElement.id].active = false
                }
            }
        })

        window.addEventListener(`keydown`, (e) => {
            let key = e.key

            if (key.toLowerCase() === `escape`) {
                e.preventDefault()
                e.stopPropagation()

                let activeElement = renderer.getActiveElement()

                if (activeElement && this.project.data) {
                    this.project.data.elements[activeElement.id].active = false
                }
            }
        })

        window.document.body.addEventListener(`click`, (e) => {
            const page = document.body.querySelector(`.page-container`)
            const target = e.target as HTMLElement

            if (!page || !page.contains(target)) {
                return
            }

            const link = renderer.findParentTag(target, `a`)

            if (link) {
                renderer.handleLinkClick(e, link)
            }
        })
    }
}
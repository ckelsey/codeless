import Vue from "vue"
import Component from "vue-class-component"
import template from './text-element.html'
import './text-element.scss'
import project from "../../services/project"
import { Prop } from "vue-property-decorator"
import renderer from "../../services/renderer"
import app from "../../services/app";

@Component({
    template,
    components: {},
    propsData: {
        element: null,
        pageId: null
    }
})

export default class TextElement extends Vue {
    name = `text-element`
    project = project
    renderer = renderer
    app = app

    @Prop()
    element: node = this.element

    @Prop()
    pageId?: string = this.pageId

    setElementText() {
        if (!this.project.isEditing) {
            return
        }

        this.element.content[0] = this.$el.innerHTML
        this.project.savePage(this.pageId || this.project.currentPage)
    }

    activate() {
        this.renderer.activate(this.element)
    }

    handlePaste(e: Event) {
        e.preventDefault()
        e.stopPropagation()

        if (!this.project.isEditing) {
            return
        }

        var text = (e as any).clipboardData.getData("text/plain")
        document.execCommand("insertHTML", false, text)
    }

    blur(){
        // this.app.clearSelection()
        this.element.content.unshift(this.$el.innerHTML)
        this.element.content.pop()
        this.project.savePage(this.pageId || this.project.currentPage)
    }
}
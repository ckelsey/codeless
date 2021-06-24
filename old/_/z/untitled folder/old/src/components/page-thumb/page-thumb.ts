import Vue from "vue"
import Component from "vue-class-component"
import template from './page-thumb.html'
import './page-thumb.scss'
import project from "../../services/project"
import PrimitiveElement from "../primitive-element/primitive-element"
import renderer from "../../services/renderer"
import { Prop } from "vue-property-decorator";

@Component({
    template,
    components: {
        'primitive-element': PrimitiveElement
    },
    propsData: {
        pageId: null,
        type: null
    }
})

export default class PageThumb extends Vue {
    name = `page-thumb`
    project = project
    renderer = renderer

    @Prop()
    pageId: string = this.pageId

    @Prop()
    type?: string = this.type

    get content() {
        if (!this.project.data) {
            return
        }

        if (!this.pageId) {
            return []
        }

        let type = `pages`

        if (this.type === `template`) {
            type = `templates`
        }

        return (this.project.data as any)[type][this.pageId].data
    }
}
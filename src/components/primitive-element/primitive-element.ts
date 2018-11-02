import Vue from "vue"
import Component from "vue-class-component"
import template from './primitive-element.html'
import './primitive-element.scss'
import project from "../../services/project"
import Tooltip from "../tool-tip/tool-tip";
import renderer from "../../services/renderer"
import DragDrop from "../drag-drop/drag-drop"
import { Prop } from "vue-property-decorator";
import TextElement from "../text-element/text-element";
import ImageElement from "../image-element/image-element";
import ElementTools from "../element-tools/element-tools";
import DividerElement from "../divider-element/divider-element";
import FormElement from "../form-element/form-element";

@Component({
    template,
    components: {
        'text-element': TextElement,
        'image-element': ImageElement,
        'element-tools': ElementTools,
        'divider-element': DividerElement,
        'form-element': FormElement
    },
    propsData: {
        index: 0,
        pageId: null
    }
})

export default class PrimitiveElement extends Vue {
    name = `primitive-element`
    project = project
    renderer = renderer

    directives = {
        "tooltip": Tooltip,
        "dragdrop": DragDrop
    }

    @Prop()
    index: number = this.index

    @Prop()
    pageId: string = this.pageId

    get dragDropIndex() {
        return this.index
    }

    get colspan(){
        if(!this.project.data || !this.element){
            return
        }

        return `colspan${this.element.colSpan}`
    }

    get element(): node | undefined {
        if(!this.project.data){
            return
        }

        let page = this.project.data.pages[this.pageId]

        if(!page){
            page = this.project.data.templates[this.pageId]
        }

        if(!page){
            return
        }

        return this.project.data.elements[page.data[this.index]]
    }

    get elementStyle() {  
        if(!this.project.data || !this.element){
            return
        }

        let styles = {
            'background-color': this.element.background,
            width: ``,
            'background-image': `url(${this.element.backgroundImage || ``})`
        }

        if (navigator.userAgent.indexOf('Trident/') > -1) {
            styles.width = `${(this.element.colSpan / this.project.totalColumns) * 100}%`
            return styles
        }

        if(this.element.css){
            try {
                const css = JSON.parse(this.element.css)

                for(let c in css){
                    if(css[c]){
                        (styles as any)[c] = css[c]
                    }
                }
            } catch (error) {}
        }

        return styles
    }

    get classes() {
        if(!this.project.data || !this.element){
            return
        }

        return {
            start: this.element.isRowStart,
            end: this.element.isRowEnd,
            editing: this.element.active,
            unpublished: this.project.isEditing && !this.element.published
        }
    }

    ondrop(data: { dragIndex: number, dropIndex: number }) {
        this.project.reorderElements(this.pageId, data.dragIndex, data.dropIndex)
    }

    activate() {
        if(!this.project.data || !this.element){
            return
        }
        
        this.renderer.activate(this.element)
    }
}
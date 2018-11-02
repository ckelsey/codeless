import Vue from "vue"
import Component from "vue-class-component"
import template from './primitive-thumb.html'
import './primitive-thumb.scss'
import project from "../../services/project"
import { Prop } from "vue-property-decorator";
import TextElement from "../text-element/text-element";
import ImageElement from "../image-element/image-element";

@Component({
    template,
    components: {
        'text-element': TextElement,
        'image-element': ImageElement
    },
    propsData: {
        elementId: ``
    }
})

export default class PrimitiveThumb extends Vue {
    name = `primitive-thumb`
    project = project

    @Prop()
    elementId: string = this.elementId

    get element(): node | undefined {   
        if(!this.project.data){
            return
        }

        return this.project.data.elements[this.elementId]
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

        return styles
    }
}
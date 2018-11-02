import Vue from "vue"
import Component from "vue-class-component"
import template from './font-picker.html'
import './font-picker.scss'
import project from "../../services/project"
import { Prop } from "vue-property-decorator";

@Component({
    template,
    components: {},
    propsData: {
        element: null,
        changeFont: ()=>{}
    }
})

export default class FontPicker extends Vue {
    name = `font-picker`
    project = project

    @Prop()
    element: node = this.element

    @Prop()
    changeFont: Function = this.changeFont

    getFont(font: string) {
        switch (font) {
            case `p`:
                return `<p>normal</p>`
            case `h4`:
                return `<h4>heading 4</h4>`
            case `h3`:
                return `<h3>heading 3</h3>`
            case `h2`:
                return `<h2>heading 2</h2>`
            case `h1`:
                return `<h1>heading 1</h1>`
        }
    }
}
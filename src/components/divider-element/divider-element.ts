import Vue from "vue"
import Component from "vue-class-component"
import { Prop } from "vue-property-decorator"
import './divider-element.scss'

@Component({
    template: `<div v-if="element.type === 'divider'" class="divider-element"></div>`,
    components: {},
    propsData: {
        element: null
    }
})

export default class DividerElement extends Vue {
    name = `divider-element`

    @Prop()
    element: node = this.element
}
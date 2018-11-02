import Vue from "vue"
import Component from "vue-class-component"
import template from './image-element.html'
import project from "../../services/project"
import { Prop } from "vue-property-decorator";
import renderer from "../../services/renderer";

@Component({
    template,
    components: {},
    propsData: {
        element: null
    }
})

export default class ImageElement extends Vue {
    name = `image-element`
    project = project
    renderer = renderer

    @Prop()
    element: node = this.element

    get src() {
        return this.element.content[0]
    }
}
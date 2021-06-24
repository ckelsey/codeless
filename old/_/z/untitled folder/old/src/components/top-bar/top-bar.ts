import Vue from "vue"
import Component from "vue-class-component"
import template from './top-bar.html'
import './top-bar.scss'
import project from "../../services/project"
import Tooltip from "../tool-tip/tool-tip";
import renderer from "../../services/renderer";

@Component({
    template,
    components: {},
    propsData: {}
})

export default class TopBar extends Vue {
    name = `top-bar`
    project = project
    renderer = renderer

    directives = {
        "tooltip": Tooltip
    }
}
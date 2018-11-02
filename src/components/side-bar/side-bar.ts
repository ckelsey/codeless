import Vue from "vue"
import Component from "vue-class-component"
import template from './side-bar.html'
import './side-bar.scss'
import project from "../../services/project";
import PageThumb from "../page-thumb/page-thumb";
import PrimitiveThumb from "../primitive-thumb/primitive-thumb";
import auth from "../../services/auth";

@Component({
    template,
    components: {
        'page-thumb': PageThumb,
        'primitive-thumb': PrimitiveThumb
    },
    propsData: {}
})

export default class SideBar extends Vue {
    name = `side-bar`
    tabState = `insert`
    project = project
    auth = auth
    tabIndicatorStyle = {}

    get hasGlobalElements() {
        if (!this.project.data) {
            return
        }

        for (var k in this.project.data.elements) {
            if (this.project.data.elements[k] && this.project.data.elements[k].global) {
                return true
            }
        }
    }

    setIndicator(){
        Vue.nextTick(() => {
            const tab = document.body.querySelector(`#side-bar-nav .tab.active`)
            const nav = document.getElementById(`side-bar-nav`)

            if (!tab || !nav) {
                return
            }

            const box = tab.getBoundingClientRect()
            const navBox = nav.getBoundingClientRect()

            this.tabIndicatorStyle = {
                width: `${box.width}px`,
                left: `${box.left - navBox.left}px`
            }
        })
    }

    activateTab(state: string) {
        this.tabState = state
        this.setIndicator()
    }

    isActive(state: string) {
        return this.tabState === state ? `active` : ``
    }

    toggleGlobalElement(id: string) {
        if (!this.project.data) {
            return
        }

        this.project.data.elements[id].global = !this.project.data.elements[id].global
        this.project.savePage(this.project.currentPage)
    }

    deleteGlobalElement(id: string) {
        if (!this.project.data) {
            return
        }

        this.project.data.elements[id].global = false
        this.project.deleteItem(id)
    }

    mounted(){
        this.setIndicator()
    }
}
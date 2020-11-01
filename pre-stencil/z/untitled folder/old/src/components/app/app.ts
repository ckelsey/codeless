import Vue from "vue"
import Component from "vue-class-component"
import template from './app.html'
import './app.scss'
import SideBar from "../side-bar/side-bar"
import PageRenderer from "../page-renderer/page-renderer"
import project from "../../services/project"

@Component({
    template,
    components: {
        'side-bar': SideBar,
        'page-renderer': PageRenderer
    },
    propsData: {}
})

export default class App extends Vue {
    name = `app-entry`
    project = project
    checkboxLabel = `test`
    checkboxDisabled = false
    checkboxValue = true
    whenUpdate(data:any){
        console.log(data, this)
        this.checkboxValue = data.detail.newValue.toString()
    }

    mounted() {
        // setTimeout(()=>{
        //     this.checkboxDisabled = true
        // }, 1000)
    }
}
import Vue from "vue"
import Component from "vue-class-component"
import template from './nav-item.html'
import './nav-item.scss'
import project from "../../services/project"
import { Prop } from "vue-property-decorator";
import App from "../../services/app";
import renderer from "../../services/renderer";

@Component({
    template,
    components: {},
    propsData: {}
})

export default class NavItem extends Vue {
    name = `nav-item`
    project = project
    expanded = false
    linkIsShowing = false
    linkIsAbove = false

    @Prop()
    path: string = this.path

    get navItem() {
        return App.getThis(this.project.data, `navigation.${this.path}`)
    }

    get text() {
        return this.navItem.text || App.getThis(this.project.data, `pages.${this.navItem.id}.name`)
    }

    get hasContent() {
        if (!this.navItem || !this.navItem.content) {
            return false
        }

        return this.navItem.content.length
    }

    get isFirstContent(){
        
        return this.path.split ? parseInt(this.path.split(`.`)[this.path.split(`.`).length - 1]) === 0 : parseInt(this.path) === 0
    }

    get dragDropIndex() {
        return this.path
    }

    edit() {
        renderer.navItemDialogue = this.path
        renderer.newNavItem = Object.assign({ text: this.text }, this.navItem)
    }

    deleteItem() {
        if(!this.project.data){
            return
        }

        delete this.project.data.navigationMap[this.navItem.id]
        App.deleteThis(this.project.data.navigation, this.path)
        this.project.savePage(this.project.currentPage)
    }

    ondragout() {
        const dropzones = this.$el.querySelector(`.dropzones`)

        if (dropzones) {
            dropzones.removeAttribute(`zone`)
        }
    }

    ondragover(data: dragDropData) {
        const dropzones = this.$el.querySelector(`.dropzones`)
        const target = data.event.target as HTMLElement
        let zone = target.getAttribute(`zone`)

        if (!zone) {
            zone = target.parentElement ? target.parentElement.getAttribute(`zone`) : null
        }

        if (dropzones && zone) {
            dropzones.setAttribute(`zone`, zone)
        }
    }

    ondrop(data: dragDropData) {
        if(!this.project.data){
            return
        }
        
        const dropzones = this.$el.querySelector(`.dropzones`)

        if (dropzones) {
            dropzones.removeAttribute(`zone`)
        }

        const target = data.event.target as HTMLElement
        const zone = target.getAttribute(`zone`)
        let path: any = []

        App.setPath(path, data.dropIndex)

        if (!path.length) {
            return
        }

        switch (zone) {
            case `above`:
                break
            case `in`:
                path.push(`content`)
                path.push(0)
                break
            case `below`:
                if (path[path.length - 1]) {
                    path[path.length - 1] = path[path.length - 1] + 1
                }
                break
        }

        if (path.length === 1) {
            path = path[0].toString()
        } else {
            path = path.join(`.`)
        }

        if (data.group) {
            App.moveThis(this.project.data.navigation, data.dragIndex, path)
        } else {
            const id = this.project.data.pages[this.project.currentPage].data[data.dragIndex]
            const item = {
                id,
                text: this.project.data.elements[id].content[0],
                link: `?p=${this.project.currentPage}&a=${id}`,
                content: []
            }

            App.addThis(this.project.data.navigation, path, item)
        }

        this.project.savePage(this.project.currentPage)
    }

    mounted() {
        const query = this.project.getPageQuery()
        const link = this.project.getPageQuery(this.navItem.link)
        let linkElement

        if (this.project.currentPage !== link.p) {
            return
        }

        if(link.p && !link.a){
            this.linkIsShowing = true
            return
        }

        if (link.a) {
            linkElement = document.getElementById(`element-${link.a}`)
        }

        const handleIntersect:IntersectionObserverCallback = (entries, observer) =>{
            this.linkIsAbove = entries[0].boundingClientRect.top < 0
            this.linkIsShowing = entries[0].isIntersecting
        }

        if (linkElement) {
            var options = {
                root: null,
                threshold: [0,1]
            };

            const observer = new IntersectionObserver(handleIntersect, options)
            observer.observe(linkElement)
        }
    }
}
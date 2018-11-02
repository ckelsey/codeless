import Vue from "vue"
import Component from "vue-class-component"
import { Prop } from "vue-property-decorator"
import template from './form-element.html'
import './form-element.scss'
import auth from "../../services/auth";
import renderer from "../../services/renderer";
import project from "../../services/project";


@Component({
    template,
    components: {},
    propsData: {
        element: null
    }
})

export default class FormElement extends Vue {
    name = `form-element`
    form = []
    values: string[] = []
    auth = auth

    @Prop()
    element: node = this.element

    formatForm() {
        this.element.content.forEach((el: string, index: number) => {
            this.values.push('')

            Vue.set(this.form, index, {
                key: el,
                value: this.values[index]
            })
        })
    }

    onInput(index: number) {
        Vue.set(this.form, index, {
            key: this.element.content[index],
            value: this.values[index]
        })
    }

    get isLoggedIn() {
        return this.auth.isSignedIn
    }

    sendForm() {
        console.log(this.form)

        if (!this.auth.isSignedIn || !project.data) {
            return
        }

        let message = `${this.element.name}\n\rPage: ${project.data.pages[project.currentPage].name}\n\r`

        this.form.forEach((element: any, index) => {
            message += `${element.key}: ${element.value}`
            if (index !== this.form.length - 1) {
                message += `\n\r`
            }
        });

        Vue.set(this, `form`, [])
        Vue.set(this, `values`, [])
        this.formatForm()

        return this.auth.sendEmail({
            message,
            title: this.element.name,
            emails: this.element.generic
        })
            .then((res: any) => {
                if (res.id) {
                    renderer.formSent = true
                }
            })
    }

    mounted() {
        this.form = []
        this.formatForm()
    }
}
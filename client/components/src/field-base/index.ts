import ID from '../../../utils/id'

const attributes = {
    autofocus: false,
    autowidth: false,
    disabled: false,
    error: null,
    help: null,
    inputid: null,
    label: null,
    labelup: false,
    name: null,
    margin: true,
    required: false,
    theme: null,
    value: null
}

const observedAttributesKeys = Object.keys(attributes)

class FieldBase extends HTMLElement {
    autofocus: boolean = attributes.autowidth
    autowidth: boolean = attributes.autowidth
    disabled: boolean = attributes.disabled
    error: string | null = attributes.error
    help: string | null = attributes.help
    inputid: string | null = attributes.inputid
    label: string | null = attributes.label
    labelup: boolean = attributes.labelup
    name: string | null = attributes.name
    margin: boolean = attributes.margin
    required: boolean = attributes.required
    theme: string | null = attributes.theme
    value: any = attributes.value
    inputElement: HTMLInputElement | null = null

    constructor() {
        super()
    }

    static get observedAttributes() { return observedAttributesKeys }

    attributeChangedCallback(name: string, oldValue: any, newValue: any) {
        console.log('ATTR CHANGE', name, oldValue, newValue)
    }

    connectedCallback() {
        if (!this.inputid) {
            this.inputid = ID()
        }

        this.innerHTML = `<input id="${this.inputid}">`
        this.inputElement = this.querySelector('input')
        // const shadowRoot = this.attachShadow({ mode: 'open' })
        // shadowRoot.innerHTML
        // console.log(this.autowidth, this.observedAttributes, 'observedAttributes')
    }

    disconnectedCallback() {

    }
}

export default FieldBase

window.customElements.define('field-base', FieldBase)
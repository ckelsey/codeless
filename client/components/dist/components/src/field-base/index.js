import ID from '../../../utils/id';
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
};
const observedAttributesKeys = Object.keys(attributes);
class FieldBase extends HTMLElement {
    constructor() {
        super();
        this.autofocus = attributes.autowidth;
        this.autowidth = attributes.autowidth;
        this.disabled = attributes.disabled;
        this.error = attributes.error;
        this.help = attributes.help;
        this.inputid = attributes.inputid;
        this.label = attributes.label;
        this.labelup = attributes.labelup;
        this.name = attributes.name;
        this.margin = attributes.margin;
        this.required = attributes.required;
        this.theme = attributes.theme;
        this.value = attributes.value;
        this.inputElement = null;
    }
    static get observedAttributes() { return observedAttributesKeys; }
    attributeChangedCallback(name, oldValue, newValue) {
        console.log('ATTR CHANGE', name, oldValue, newValue);
    }
    connectedCallback() {
        if (!this.inputid) {
            this.inputid = ID();
        }
        this.innerHTML = `<input id="${this.inputid}">`;
        this.inputElement = this.querySelector('input');
        // const shadowRoot = this.attachShadow({ mode: 'open' })
        // shadowRoot.innerHTML
        // console.log(this.autowidth, this.observedAttributes, 'observedAttributes')
    }
    disconnectedCallback() {
    }
}
export default FieldBase;
window.customElements.define('field-base', FieldBase);
//# sourceMappingURL=index.js.map
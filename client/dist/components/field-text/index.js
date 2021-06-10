import FieldBase from '../field-base';
class FieldText extends FieldBase {
    constructor() {
        super();
    }
    connectedCallback() {
        // super()
        super.connectedCallback();
        console.dir(this);
        // const shadowRoot = this.attachShadow({ mode: 'open' })
        // shadowRoot.innerHTML
    }
    disconnectedCallback() {
        super.connectedCallback();
    }
}
window.customElements.define('field-text', FieldText);
//# sourceMappingURL=index.js.map
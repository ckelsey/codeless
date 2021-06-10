declare class FieldBase extends HTMLElement {
    autofocus: boolean;
    autowidth: boolean;
    disabled: boolean;
    error: string | null;
    help: string | null;
    inputid: string | null;
    label: string | null;
    labelup: boolean;
    name: string | null;
    margin: boolean;
    required: boolean;
    theme: string | null;
    value: any;
    inputElement: HTMLInputElement | null;
    constructor();
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, oldValue: any, newValue: any): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
}
export default FieldBase;
//# sourceMappingURL=index.d.ts.map
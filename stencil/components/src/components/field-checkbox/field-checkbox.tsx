import { Component, Prop, h, Watch, Element, Method, State, Event } from '@stencil/core'
import { SantizedHTML } from '../../../../utils/validate/html'
import ID from '../../../../utils/id'
import AttributeSetRemove from '../../../../utils/dom/attribute-set-remove'
import DispatchEvent from '../../../../utils/dom/dispatch-event'
import RenderLightDom from '../../../../utils/dom/render-light-dom'
import InputName from '../../../../utils/dom/input-name'
import FormControl from '../../../../utils/dom/form-control'
import SetAttribute from '../../../../utils/dom/set-attribute'
import InputLabelId from '../../../../utils/dom/input-label-id'
import Debounce from '../../../../utils/timing/debounce'

@Component({
    tag: 'field-checkbox',
    styleUrl: 'style.scss',
    shadow: true
})

export class FieldCheckbox {
    @Element() host

    @Event() changed
    debounceChanged = Debounce(() => this.changed.emit({ element: this, value: this.value }))

    /** PROPS */
    @Prop() autofocus: boolean = false

    @Prop() autowidth: boolean = false

    @Prop() disabled: boolean = false
    @Watch('disabled') disabledWatcher(newVal) { SetAttribute(this.formInput, 'disabled', newVal) }

    @Prop({ mutable: true }) error: string = ''
    @Watch('error') validError(newVal) { this.sanitizedError = SantizedHTML(newVal) || '' }

    @Prop() helptext: string
    @Watch('helptext') validHelpText(newVal) { this.sanitizedHelp = SantizedHTML(newVal) }

    @Prop({ reflect: true }) inputid: string = ID()
    @Watch('inputid') validId(newVal) { InputLabelId(newVal, this.inputElement, this.labelElement) }

    @Prop() label: string = ''
    @Watch('label') validLabel(newVal) { this.sanitizedLabel = SantizedHTML(newVal) }

    @Prop() mixed: boolean = false
    @Watch('mixed') validMixed(newVal) { AttributeSetRemove(this.containerElement, 'mixed', newVal) }

    @Prop({ mutable: true, reflect: true }) name: string = ''
    @Watch('name') nameWatcher(newVal) {
        this.name = InputName(newVal, this.sanitizedLabel, this.inputid)
        SetAttribute(this.formInput, 'name', this.name)
    }

    @Prop() novalidate: boolean = false

    @Prop() required: boolean = false
    @Watch('required') requiredWatcher(newVal) { SetAttribute(this.formInput, 'required', newVal) }

    @Prop() nomargin: boolean = false

    @Prop({ reflect: true }) theme: 'inverse' | '' = ''
    @Watch('theme') themeWatcher(newVal) { this.updateTheme(newVal) }

    @Prop({ mutable: true, reflect: true }) value: boolean = false
    @Watch('value') validValue(newVal) {
        if (typeof newVal == 'undefined') {
            this.value = false
        }
        this.inputElement.checked = this.value
        this.handleInput()
    }


    /** STATE */
    @State() sanitizedHelp: string = ''
    @State() sanitizedError: string = ''
    @State() sanitizedLabel: string = ''
    @Watch('sanitizedLabel') validSanitizedLabel(newVal) {
        SetAttribute(this.containerElement, 'has-label', (!!newVal).toString())
        this.name = InputName(this.name, newVal, this.inputid)
    }

    /** METHODS */
    @Method() getValidity() { return Promise.resolve(this.formInput.validity) }
    @Method() getValidationMessage() { return Promise.resolve(this.formInput.validationMessage) }


    /** ELEMENTS */
    containerElement!: HTMLElement
    inputElement!: HTMLInputElement
    labelElement!: HTMLLabelElement
    formInput!: HTMLInputElement


    /** INTERNAL METHODS */
    externalForm() { return this.host.closest('form') }

    focused() { return this.inputid === (document.activeElement as any).inputid || this.host.shadowRoot.activeElement === this.inputElement }

    isvalid() { return this.formInput.validity.valid }

    checkError() { if (!this.novalidate) { this.error = this.formInput.validationMessage } }

    handleInput() {
        this.formInput.checked = this.value = !!this.inputElement.checked
        if (!!this.error && this.isvalid()) { this.error = SantizedHTML(this.formInput.validationMessage) }
        this.debounceChanged()
    }

    handleEnter(e) {
        if (!e || !this.externalForm() || !e.key || e.key.toLowerCase() !== 'enter') { return }
        DispatchEvent(this.externalForm(), 'submit')
    }

    updateTheme(theme) { this.containerElement.setAttribute('theme', theme) }



    /** LIFECYLE */
    componentWillLoad() {
        this.sanitizedLabel = SantizedHTML(this.label)
        this.sanitizedHelp = SantizedHTML(this.helptext)
        this.sanitizedError = SantizedHTML(this.error)
    }

    componentDidLoad() {
        InputLabelId(this.inputid, this.inputElement, this.labelElement)
        AttributeSetRemove(this.containerElement, 'mixed', this.mixed)
        SetAttribute(this.containerElement, 'has-label', (!!this.sanitizedLabel).toString())
        FormControl.apply(this, [this.inputid, this.formInput, this.externalForm()])
        this.updateTheme(this.theme)
    }

    render() {
        this.formInput = RenderLightDom(this.host, 'input.field-checkbox-hidden-input', {
            tagName: 'input',
            type: 'checkbox',
            checked: this.value,
            name: this.name,
            required: this.required,
            disabled: this.disabled,
            class: 'field-checkbox-hidden-input',
            slot: 'form-control'
        }) as HTMLInputElement

        return <div
            ref={(el) => this.containerElement = el as HTMLElement}
            class={`field-checkbox-container field-element-container${this.nomargin ? ' nomargin' : ''}${this.autowidth ? ' w-auto' : ''}`}
        >
            <span class="icon-container"><slot name="icon" /></span>
            <div class="field-input-label">
                <input
                    type="checkbox"
                    ref={(el) => this.inputElement = el as any}
                    placeholder=" "
                    checked={this.value}
                    disabled={this.disabled}
                    name={this.name}
                    required={this.required}
                    id={this.inputid}
                    form={(this.externalForm() || {}).id}
                    onInput={() => this.handleInput()}
                    onBlur={() => this.checkError()}
                    onKeyDown={(e) => this.handleEnter(e)}
                />

                <label ref={(el) => this.labelElement = el as any}>
                    <span>{this.sanitizedLabel}</span>
                    <span>{this.sanitizedError}</span>
                </label>
            </div>

            <span class="field-help-text">{this.sanitizedHelp}</span>
            <div class="form-control"><slot name="form-control"></slot></div>
        </div>
    }
}

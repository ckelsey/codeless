import { Component, Prop, h, Watch, Element, Method, State } from '@stencil/core'
import ValidateHtml from '../../../../utils/validate/html'
import ID from '../../../../utils/id'
import AttributeSetRemove from '../../../../utils/dom/attribute-set-remove'
import DispatchEvent from '../../../../utils/dom/dispatch-event'
import RenderLightDom from '../../../../utils/dom/render-light-dom'
import InputName from '../../../../utils/dom/input-name'
import FormControl from '../../../../utils/dom/form-control'
import SetAttribute from '../../../../utils/dom/set-attribute'

const sanitized = (val: string) => !val ? '' : ValidateHtml(val).sanitized as string
const attachId = (id: string, input: HTMLInputElement, label: any) => {
    input.id = id
    SetAttribute(label, 'for', id)
}


@Component({
    tag: 'field-number',
    styleUrl: 'style.scss',
    shadow: true
})

export class FieldNumber {
    @Element() host

    /** PROPS */
    @Prop() autocomplete: string = 'on'

    @Prop() autofocus: boolean = false

    @Prop() autowidth: boolean = false

    @Prop() disabled: boolean = false
    @Watch('disabled') disabledWatcher(newVal) { SetAttribute(this.formInput, 'disabled', newVal) }

    @Prop({ mutable: true }) error: string = ''
    @Watch('error') validError(newVal) { AttributeSetRemove(this.labelElement, 'error', sanitized(newVal)) }

    @Prop() helptext: string
    @Watch('helptext') validHelpText(newVal) { this.sanitizedHelp = sanitized(newVal) }

    @Prop({ reflect: true }) inputid: string = ID()
    @Watch('inputid') validId(newVal) { attachId(newVal, this.inputElement, this.labelElement) }

    @Prop() label: string = ''
    @Watch('label') validLabel(newVal) { this.sanitizedLabel = sanitized(newVal) }

    @Prop() labelup: boolean = false
    @Watch('labelup') validLabelUp() { this.setLabelPosition() }

    @Prop() name: string = ''
    @Watch('name') nameWatcher(newVal) {
        this.name = InputName(newVal, this.sanitizedLabel, this.inputid)
        SetAttribute(this.formInput, 'name', this.name)
    }

    @Prop() max: number

    @Prop() min: number

    @Prop() readonly: boolean = false
    @Watch('readonly') readonlyWatcher(newVal) { SetAttribute(this.formInput, 'readonly', newVal) }

    @Prop() required: boolean = false
    @Watch('required') requiredWatcher(newVal) { SetAttribute(this.formInput, 'required', newVal) }

    @Prop() slim: boolean = false

    @Prop() value: number | undefined
    @Watch('value') validValue(newVal) {
        this.value = isNaN(newVal) ? undefined : newVal
    }


    /** STATE */
    @State() sanitizedHelp: string = ''
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
    helpTextElement!: HTMLElement
    iconElement!: HTMLSpanElement
    inputElement!: HTMLInputElement
    labelElement!: HTMLLabelElement
    formInput!: HTMLInputElement


    /** INTERNAL METHODS */
    externalForm() { return this.host.closest('form') }

    focused() { return this.inputid === (document.activeElement as any).inputid }

    isempty() { return this.value == undefined }

    isvalid() { return this.formInput.validity.valid }

    checkError() { this.error = this.formInput.validationMessage }

    setLabelPosition() {
        const focused = this.focused()
        const empty = this.isempty()
        SetAttribute(SetAttribute(this.host, 'empty', empty), 'focused', focused)
        SetAttribute(SetAttribute(this.containerElement, 'focused', focused.toString()), 'label-up', focused || !empty || this.labelup ? 'true' : 'false')
    }

    handleInput() {
        this.value = parseFloat(this.inputElement.value)
        this.formInput.value = (this.value || '').toString()
        if (!!this.error && this.isvalid()) { this.error = this.formInput.validationMessage }
    }

    handleEnter(e) {
        if (!e || !this.externalForm() || !e.key || e.key.toLowerCase() !== 'enter') { return }
        DispatchEvent(this.externalForm(), 'submit')
    }

    /** LIFECYLE */
    componentWillLoad() {
        this.sanitizedLabel = sanitized(this.label)
        this.sanitizedHelp = sanitized(this.helptext)
    }

    componentDidLoad() {
        attachId(this.inputid, this.inputElement, this.labelElement)
        SetAttribute(this.containerElement, 'has-label', (!!this.sanitizedLabel).toString())
        this.setLabelPosition()
        FormControl.apply(this, [this.inputid, this.formInput, this.externalForm()])
    }

    render() {
        this.formInput = RenderLightDom(this.host, 'input.field-number-hidden-input', {
            tagName: 'input',
            type: 'number',
            value: this.value,
            name: this.name,
            required: this.required,
            disabled: this.disabled,
            readonly: this.readonly,
            max: this.max,
            min: this.min,
            class: 'field-number-hidden-input',
            slot: 'form-control'
        }) as HTMLInputElement

        return <div
            ref={(el) => this.containerElement = el as HTMLElement}
            class={`field-number-container field-element-container${this.slim ? ' slim' : ''}${this.autowidth ? ' w-auto' : ''}`}
        >
            <span class="icon-container"><slot name="icon" /></span>
            <div class="field-input-label">
                <input
                    ref={(el) => this.inputElement = el as any}
                    placeholder=" "
                    type="number"
                    autocomplete={this.autocomplete}
                    autofocus={this.autofocus}
                    disabled={this.disabled}
                    name={this.name}
                    readonly={this.readonly}
                    required={this.required}
                    id={this.inputid}
                    max={this.max}
                    min={this.min}
                    form={(this.externalForm() || {}).id}
                    onAnimationStart={() => this.setLabelPosition()}
                    onFocus={() => this.setLabelPosition()}
                    onBlur={() => {
                        this.checkError()
                        this.setLabelPosition()
                    }}
                    onInput={() => this.handleInput()}
                    onKeyDown={(e) => this.handleEnter(e)}
                    value={this.value}
                />

                <label ref={(el) => this.labelElement = el as HTMLLabelElement}>{this.sanitizedLabel}</label>
            </div>
            <span class="field-input-bottom">
                <span ref={(el) => this.helpTextElement = el as HTMLElement} class="field-help-text">{this.sanitizedHelp}</span>
            </span>
            <div class="form-control"><slot name="form-control"></slot></div>
        </div>
    }
}


import { Component, Prop, h, Watch, Element, Method, State } from '@stencil/core'
import ID from '../../../../utils/id'
import RenderLightDom from '../../../../utils/dom/render-light-dom'
import InputName from '../../../../utils/dom/input-name'
import FormControl from '../../../../utils/dom/form-control'
import TextareaHeight from '../../../../utils/dom/textarea-height'
import SetAttribute from '../../../../utils/dom/set-attribute'
import InputLabelId from '../../../../utils/dom/input-label-id'
import { SantizedHTML } from '../../../../utils/validate/html'

@Component({
    tag: 'field-textarea',
    styleUrl: 'style.scss',
    shadow: true
})

export class FieldTextarea {
    @Element() host

    /** PROPS */
    @Prop() autocomplete: string = 'on'

    @Prop() autofocus: boolean = false

    @Prop() autowidth: boolean = false

    @Prop() fullwidth: boolean = false

    @Prop() count: number = 0

    @Prop() disabled: boolean = false
    @Watch('disabled') disabledWatcher(newVal) { SetAttribute(this.formInput, 'disabled', newVal) }

    @Prop({ mutable: true }) error: string = ''
    @Watch('error') validError(newVal) { SetAttribute(this.labelElement, 'error', SantizedHTML(newVal)) }

    @Prop() helptext: string
    @Watch('helptext') validHelpText(newVal) { this.sanitizedHelp = SantizedHTML(newVal) }

    @Prop({ reflect: true }) inputid: string = ID()
    @Watch('inputid') validId(newVal) { InputLabelId(newVal, this.inputElement, this.labelElement) }

    @Prop() label: string = ''
    @Watch('label') validLabel(newVal) { this.sanitizedLabel = SantizedHTML(newVal) }

    @Prop() labelup: boolean = false
    @Watch('labelup') validLabelUp() { this.setLabelPosition() }

    @Prop() name: string = ''
    @Watch('name') nameWatcher(newVal) {
        this.name = InputName(newVal, this.sanitizedLabel, this.inputid)
        SetAttribute(this.formInput, 'name', this.name)
    }

    @Prop() max: number
    @Watch('max') maxWatcher(newVal) { SetAttribute(this.formInput, 'maxlength', newVal) }

    @Prop() min: number
    @Watch('min') minWatcher(newVal) { SetAttribute(this.formInput, 'min', newVal) }

    @Prop() required: boolean = false
    @Watch('required') requiredWatcher(newVal) { SetAttribute(this.formInput, 'required', newVal) }

    @Prop() showcount: boolean = false

    @Prop() slim: boolean = false

    @Prop({ reflect: true }) theme: 'inverse' | '' = ''
    @Watch('theme') themeWatcher(newVal) { this.updateTheme(newVal) }

    @Prop() value: string = ''
    @Watch('value') validValue(newVal) { if (typeof newVal == 'undefined') { return this.value = '' } }


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
    inputElement!: any
    labelElement!: HTMLLabelElement
    formInput!: HTMLTextAreaElement


    /** INTERNAL METHODS */
    externalForm() { return this.host.closest('form') }

    focused() { return this.inputid === (document.activeElement as any).inputid || this.host.shadowRoot.activeElement === this.inputElement }

    isempty() { return this.value == '' || this.value == undefined }

    isvalid() { return this.formInput.validity.valid }

    checkError() { this.error = this.formInput.validationMessage }

    handleInput() {
        TextareaHeight(this.inputElement)
        this.value = this.inputElement.value
        this.count = this.formInput.value.length
        if (!!this.error && this.isvalid()) { this.error = this.formInput.validationMessage }
    }

    setLabelPosition() {
        const focused = this.focused()
        const empty = this.isempty()
        const forcedUp = this.labelup
        SetAttribute(SetAttribute(this.host, 'empty', empty), 'focused', focused)
        SetAttribute(SetAttribute(this.containerElement, 'focused', focused.toString()), 'label-up', focused || !empty || forcedUp ? 'true' : 'false')
    }

    updateTheme(theme) { this.containerElement.setAttribute('theme', theme) }



    /** LIFECYLE */
    componentWillLoad() { this.sanitizedLabel = SantizedHTML(this.label) }

    componentDidLoad() {
        InputLabelId(this.inputid, this.inputElement, this.labelElement)
        SetAttribute(this.containerElement, 'has-label', (!!this.sanitizedLabel).toString())
        FormControl.apply(this, [this.inputid, this.formInput, this.externalForm()])
        this.updateTheme(this.theme)
    }

    render() {
        this.formInput = RenderLightDom(this.host, 'textarea.field-textarea-hidden-input', {
            tagName: 'textarea',
            value: this.value,
            name: this.name,
            required: this.required,
            disabled: this.disabled,
            class: 'field-textarea-hidden-input',
            maxlength: !!this.max ? this.max : undefined,
            minlength: !!this.min ? this.min : undefined,
            slot: 'form-control'
        }) as HTMLTextAreaElement

        return <div
            ref={(el) => this.containerElement = el as HTMLElement}
            class={`field-textarea-container field-element-container${this.slim ? ' slim' : ''}${this.autowidth ? ' w-auto' : ''}${this.fullwidth ? ' w-100' : ''}`}
        >
            <span class="icon-container"><slot name="icon" /></span>
            <div class="field-input-label">
                <label ref={(el) => this.labelElement = el as HTMLLabelElement} class={this.required ? 'label-required' : ''}>{this.sanitizedLabel}</label>
                <textarea
                    ref={(el) => this.inputElement = el as any}
                    placeholder=" "
                    value={this.value}
                    autofocus={this.autofocus}
                    disabled={this.disabled}
                    name={this.name}
                    required={this.required}
                    id={this.inputid}
                    maxLength={this.max}
                    minLength={this.min}
                    form={(this.externalForm() || {}).id}
                    onFocus={() => this.setLabelPosition()}
                    onAnimationStart={() => this.setLabelPosition()}
                    onBlur={() => {
                        this.checkError()
                        this.setLabelPosition()
                    }}
                    onInput={() => this.handleInput()}
                >{this.value}</textarea>
            </div>

            <span class="field-input-bottom">
                <span class="field-help-text">{this.sanitizedHelp}</span>
                <span class="field-count-text">{this.showcount ? this.max ? `${this.count}/${this.max}` : this.count : ''}</span>
            </span>
            <div class="form-control"><slot name="form-control"></slot></div>
        </div>
    }
}

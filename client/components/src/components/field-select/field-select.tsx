import { Component, Prop, h, Watch, Element, Method, State } from '@stencil/core'
import ValidateHtml from '../../../../utils/validate/html'
import ID from '../../../../utils/id'
import DispatchEvent from '../../../../utils/dom/dispatch-event'
import Pipe from '../../../../utils/function-helpers/pipe'
import ToArray from '../../../../utils/conversion/to-array'
import CommasToArray from '../../../../utils/conversion/commas-to-array'
import ToOptions, { OptionsObject } from '../../../../utils/conversion/to-options'
import IfInvalid from '../../../../utils/checks/if-invalid'
import Get from '../../../../utils/objects/get'
import GetInputValue from '../../../../utils/dom/get-input-value'
import RenderLightDom from '../../../../utils/dom/render-light-dom'
import InputName from '../../../../utils/dom/input-name'
import FormControl from '../../../../utils/dom/form-control'
import SetAttribute from '../../../../utils/dom/set-attribute'

const optionsToArray = Pipe(ToArray, CommasToArray, ToOptions, IfInvalid([]))
const sanitized = (val: string) => !val ? '' : ValidateHtml(val).sanitized as string
const processedValue = (value, options) => Get(
    (options || []).filter(o => o.value == value),
    '0.value',
    ''
)


@Component({
    tag: 'field-select',
    styleUrl: 'style.scss',
    shadow: true
})

export class FieldSelect {
    @Element() host

    /** PROPS */
    @Prop() autocomplete: string = 'on'

    @Prop() autowidth: boolean = false

    @Prop() disabled: boolean = false
    @Watch('disabled') disabledWatcher(newVal) { SetAttribute(this.formInput, 'disabled', newVal) }

    @Prop({ mutable: true }) error: string = ''
    @Watch('error') validError(newVal) { SetAttribute(this.labelElement, 'error', sanitized(newVal)) }

    @Prop() helptext: string
    @Watch('helptext') validHelpText(newVal) { this.sanitizedHelp = sanitized(newVal) }

    @Prop({ reflect: true }) inputid: string = ID()

    @Prop() label: string = ''
    @Watch('label') validLabel(newVal) { this.sanitizedLabel = sanitized(newVal) }

    @Prop() labelup: boolean = false
    @Watch('labelup') validLabelUp() { this.setLabelPosition() }

    @Prop() name: string = ''
    @Watch('name') nameWatcher(newVal) {
        this.name = InputName(newVal, this.sanitizedLabel, this.inputid)
        SetAttribute(this.formInput, 'name', this.name)
    }

    @Prop() options: string | any[] = []
    @Watch('options') validOptions(newVal) {
        this.optionsArray = optionsToArray(newVal)
        this.value = processedValue(this.value, this.optionsArray)
    }

    @Prop() readonly: boolean = false
    @Watch('readonly') readonlyWatcher(newVal) { SetAttribute(this.formInput, 'readonly', newVal) }

    @Prop() required: boolean = false
    @Watch('required') requiredWatcher(newVal) { SetAttribute(this.formInput, 'required', newVal) }

    @Prop() slim: boolean = false

    @Prop() value: string = ''
    @Watch('value') validValue(newVal) {
        const processed = processedValue(newVal, this.optionsArray)
        if (processed !== newVal) {
            this.value = processed
        }
    }


    /** STATE */
    @State() sanitizedLabel: string = ''
    @Watch('sanitizedLabel') validSanitizedLabel(newVal) {
        SetAttribute(this.containerElement, 'has-label', (!!newVal).toString())
        this.name = InputName(this.name, newVal, this.inputid)
    }
    @State() sanitizedHelp: string = ''
    @State() sanitizedError: string = ''
    @State() optionsArray: OptionsObject[] = []

    /** METHODS */
    @Method() getValidity() { return Promise.resolve(this.formInput.validity) }
    @Method() getValidationMessage() { return Promise.resolve(this.formInput.validationMessage) }


    /** ELEMENTS */
    containerElement!: HTMLElement
    helpTextElement!: HTMLElement
    inputElement!: HTMLInputElement
    labelElement!: HTMLLabelElement
    formInput!: HTMLInputElement


    /** INTERNAL METHODS */
    externalForm() { return this.host.closest('form') }

    focused() { return this.inputid === (document.activeElement as any).inputid }

    isempty() { return this.value === '' || this.value === undefined }

    isvalid() { return this.formInput.validity.valid }

    checkError() { this.error = this.formInput.validationMessage }

    handleInput() {
        this.formInput.value = this.value = GetInputValue(this.inputElement)
        if (!!this.error && this.isvalid()) { this.error = this.formInput.validationMessage }
        this.setLabelPosition()
    }

    handleEnter(e) {
        if (!e || !this.externalForm() || !e.key || e.key.toLowerCase() !== 'enter') { return }
        DispatchEvent(this.externalForm(), 'submit')
    }

    setLabelPosition() {
        const focused = this.focused()
        const empty = this.isempty()
        const forcedUp = this.labelup

        SetAttribute(SetAttribute(this.host, 'empty', empty), 'focused', focused)
        SetAttribute(
            SetAttribute(this.containerElement, 'focused', focused.toString()),
            'label-up', focused || !empty || forcedUp ? 'true' : 'false'
        )
    }

    /** LIFECYLE */
    componentWillLoad() {
        this.sanitizedLabel = sanitized(this.label)
        this.sanitizedHelp = sanitized(this.helptext)
        this.sanitizedError = sanitized(this.error)
        this.optionsArray = optionsToArray(this.options)
        this.value = processedValue(this.value, this.optionsArray)
    }

    componentDidLoad() {
        SetAttribute(this.containerElement, 'has-label', (!!this.sanitizedLabel).toString())
        this.setLabelPosition()
        FormControl.apply(this, [this.inputid, this.formInput, this.externalForm()])
    }

    render() {
        this.formInput = RenderLightDom(this.host, 'input.field-text-hidden-input', {
            tagName: 'input',
            type: 'text',
            value: this.value,
            name: this.name,
            required: this.required,
            disabled: this.disabled,
            class: 'field-text-hidden-input',
            slot: 'form-control'
        }) as HTMLInputElement

        return <div
            ref={(el) => this.containerElement = el as HTMLElement}
            class={`field-select-container field-element-container${this.slim ? ' slim' : ''}${this.autowidth ? ' w-auto' : ''}`}
        >
            <span class="icon-container"><slot name="icon" /></span>
            <div class="field-input-label">
                <select
                    ref={(el) => this.inputElement = el as any}
                    autocomplete={this.autocomplete}
                    disabled={this.disabled}
                    name={this.name}
                    required={this.required}
                    form={(this.externalForm() || {}).id}
                    onAnimationStart={() => this.setLabelPosition()}
                    onFocus={() => this.setLabelPosition()}
                    onBlur={() => {
                        this.checkError()
                        this.setLabelPosition()
                    }}
                    onInput={() => this.handleInput()}
                    onKeyDown={(e) => this.handleEnter(e)}
                >
                    {this.optionsArray.map(option =>
                        <option value={option.value} selected={this.value === option.value}>{option.textContent}</option>
                    )}
                </select>

                <label ref={(el) => this.labelElement = el as HTMLLabelElement}>{this.sanitizedLabel}</label>

            </div>

            <span class="field-input-bottom">
                <span
                    ref={(el) => this.helpTextElement = el as HTMLElement}
                    class="field-help-text">{this.sanitizedHelp}</span>
            </span>
            <div class="form-control"><slot name="form-control"></slot></div>
        </div>
    }
}

import { Component, Prop, h, Watch, Element, State, Method, Event } from '@stencil/core'
import Pipe from '../../../../utils/function-helpers/pipe'
import CommasToArray from '../../../../utils/conversion/commas-to-array'
import ToArray from '../../../../utils/conversion/to-array'
import IfInvalid from '../../../../utils/checks/if-invalid'
import ToOptions, { OptionsObject } from '../../../../utils/conversion/to-options'
import DispatchEvent from '../../../../utils/dom/dispatch-event'
import Get from '../../../../utils/objects/get'
import ID from '../../../../utils/id'
import RenderLightDom from '../../../../utils/dom/render-light-dom'
import InputName from '../../../../utils/dom/input-name'
import FormControl from '../../../../utils/dom/form-control'
import SetAttribute from '../../../../utils/dom/set-attribute'
import { SantizedHTML } from '../../../../utils/validate/html'
import ArrayFrom from '../../../../utils/conversion/array-from'
import Debounce from '../../../../utils/timing/debounce'

const optionsToArray = Pipe(ToArray, CommasToArray, ToOptions, IfInvalid([]))
const processedValue = (internalValue, value, options) => Get((options || []).filter(o => o.value == (internalValue || value)), '0.value')

@Component({
    tag: 'field-radio',
    styleUrl: 'style.scss',
    shadow: true
})

export class FieldRadio {
    @Element() host

    @Event() changed
    debounceChanged = Debounce(() => this.changed.emit({ element: this, value: this.value }))

    /** PROPS */
    @Prop() autowidth: boolean = false

    @Prop() disabled: boolean = false
    @Watch('disabled') disabledWatcher(newVal) { SetAttribute(this.formInput, 'disabled', newVal) }

    @Prop({ mutable: true }) error: string = ''
    @Watch('error') validError(newVal) { this.sanitizedError = SantizedHTML(newVal) || '' }

    @Prop() helptext: string
    @Watch('helptext') validHelpText(newVal) { this.sanitizedHelp = SantizedHTML(newVal) }

    @Prop({ reflect: true }) inputid: string = ID()

    @Prop() label: string = ''
    @Watch('label') validLabel(newVal) { this.sanitizedLabel = SantizedHTML(newVal) }

    @Prop({ mutable: true, reflect: true }) name: string = ''
    @Watch('name') nameWatcher(newVal) {
        this.name = InputName(newVal, this.sanitizedLabel, this.inputid)
        SetAttribute(this.formInput, 'name', this.name)
    }

    @Prop() options: string | any[] = []
    @Watch('options') validOptions(newVal) {
        this.optionsArray = optionsToArray(newVal)
        this.internalValue = processedValue(this.internalValue, this.value, this.optionsArray)
    }

    @Prop() required: boolean = false
    @Watch('required') requiredWatcher(newVal) { SetAttribute(this.formInput, 'required', newVal) }

    @Prop() nomargin: boolean = false

    @Prop({ reflect: true }) theme: 'inverse' | '' = ''
    @Watch('theme') themeWatcher(newVal) { this.updateTheme(newVal) }

    @Prop({ mutable: true, reflect: true }) value: string | undefined
    @Watch('value') validValue(newVal) { this.internalValue = processedValue(this.internalValue, newVal, this.optionsArray) }


    /** STATE */
    @State() sanitizedLabel: string = ''
    @Watch('sanitizedLabel') validSanitizedLabel(newVal) {
        SetAttribute(this.containerElement, 'has-label', (!!newVal).toString())
        this.name = InputName(this.name, newVal, this.inputid)
    }

    @State() sanitizedHelp: string = ''
    @State() sanitizedError: string = ''
    @State() optionsArray: OptionsObject[] = []
    @State() internalValue: string

    /** METHODS */
    @Method() getValidity() { return Promise.resolve(this.formInput.validity) }
    @Method() getValidationMessage() { return Promise.resolve(this.formInput.validationMessage) }


    /** ELEMENTS */
    containerElement!: HTMLElement
    formInput!: HTMLInputElement


    /** INTERNAL METHODS */
    externalForm() { return this.host.closest('form') }

    focused() { return this.inputid === (document.activeElement as any).inputid || ArrayFrom(this.host.querySelectorAll('.field-radio-option')).indexOf(this.host.shadowRoot.activeElement) > -1 }

    isempty() { return this.value === '' || this.value === undefined }

    isvalid() { return this.formInput.validity.valid }

    handleInput(value) {
        this.formInput.value = this.value = value
        if (!!this.error && this.isvalid()) { this.error = this.formInput.validationMessage }
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
        this.optionsArray = optionsToArray(this.options)
        this.internalValue = processedValue(this.internalValue, this.value, this.optionsArray)
        this.name = InputName(this.name, this.sanitizedLabel, this.inputid)
    }

    componentDidLoad() {
        SetAttribute(this.containerElement, 'has-label', (!!this.sanitizedLabel).toString())
        FormControl.apply(this, [this.inputid, this.formInput, this.externalForm()])
        this.updateTheme(this.theme)
    }

    render() {
        this.formInput = RenderLightDom(this.host, 'input.field-radio-hidden-input', {
            tagName: 'input',
            type: 'text',
            value: this.value,
            name: this.name,
            required: this.required,
            disabled: this.disabled,
            class: 'field-radio-hidden-input',
            slot: 'form-control'
        }) as HTMLInputElement

        return <div
            ref={(el) => this.containerElement = el as HTMLElement}
            class={`field-radio-container field-element-container${this.nomargin ? ' nomargin' : ''}${this.autowidth ? ' w-auto' : ''}${this.required ? ' required' : ''}`}
        >
            <div class="field-radio-main-label-container">
                <div class="field-radio-main-label-right">
                    <span class="icon-container"><slot name="icon" /></span>
                    <label>
                        <span>{this.sanitizedLabel}</span>
                        <span class="field-radio-error-text">{this.sanitizedError}</span>
                    </label>
                </div>
                <span class="field-help-text"></span>
            </div>
            <div class="field-radio-inputs">
                {this.optionsArray.map((option, index) =>
                    <div class="field-radio-option-container">
                        <input
                            type="radio"
                            class="field-radio-option"
                            name={this.name}
                            id={`field-radio-input-${index}-${this.inputid}`}
                            value={option.value}
                            onInput={() => this.handleInput(option.value)}
                            disabled={this.disabled}
                        />
                        <label class="field-radio-option-label" htmlFor={`field-radio-input-${index}-${this.inputid}`}>{option.textContent}</label>
                    </div>
                )}
            </div>
            <div class="form-control"><slot name="form-control"></slot></div>
        </div>
    }
}

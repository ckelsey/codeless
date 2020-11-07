import { Component, Prop, h, Watch, Element, State, Method } from '@stencil/core'
import ValidateHtml from '../../../../utils/validate/html'
// import ID from '../../../../utils/id'
// import EventObserver from '../../../../utils/observe/event-observer'
// import AttributeSetRemove from '../../../../utils/dom/attribute-set-remove'
import Pipe from '../../../../utils/function-helpers/pipe'
import CommasToArray from '../../../../utils/conversion/commas-to-array'
import ToArray from '../../../../utils/conversion/to-array'
import IfInvalid from '../../../../utils/checks/if-invalid'
import ToOptions, { OptionsObject } from '../../../../utils/conversion/to-options'
// import EventObserver from '../../../../utils/observe/event-observer'
import DispatchEvent from '../../../../utils/dom/dispatch-event'
import Get from '../../../../utils/objects/get'
import EventObserver from '../../../../utils/observe/event-observer'
import AttributeSetRemove from '../../../../utils/dom/attribute-set-remove'
import ID from '../../../../utils/id'

const optionsToArray = Pipe(ToArray, CommasToArray, ToOptions, IfInvalid([]))
const processedValue = (internalValue, value, options) => Get((options || []).filter(o => o.value == (internalValue || value)), '0.value')

@Component({
    tag: 'field-radio',
    styleUrl: 'style.scss',
    shadow: true
})

export class FieldRadio {
    @Element() host

    /** PROPS */
    @Prop() autowidth: boolean = false

    @Prop() disabled: boolean = false

    @Prop({ mutable: true }) error: string = ''
    @Watch('error') validError(newVal) { this.sanitizedError = this.sanitized(newVal) || '' }

    @Prop() helptext: string
    @Watch('helptext') validHelpText(newVal) { this.sanitizedHelp = this.sanitized(newVal) }

    @Prop({ reflect: true }) inputid: string = ID()

    @Prop() label: string = ''
    @Watch('label') validLabel(newVal) { this.sanitizedLabel = this.sanitized(newVal) }

    @Prop() options: string | any[] = []
    @Watch('options') validOptions(newVal) {
        this.optionsArray = optionsToArray(newVal)
        this.internalValue = processedValue(this.internalValue, this.value, this.optionsArray)
    }

    @Prop() name: string = ''

    @Prop() readonly: boolean = false

    @Prop() required: boolean = false

    @Prop() slim: boolean = false

    @Prop() value: string | undefined
    @Watch('value') validValue(newVal) { this.internalValue = processedValue(this.internalValue, newVal, this.optionsArray) }


    /** STATE */
    @State() sanitizedLabel: string = ''
    @State() sanitizedHelp: string = ''
    @State() sanitizedError: string = ''
    @State() optionsArray: OptionsObject[] = []
    @State() internalValue: string

    /** METHODS */
    @Method() getValidity() { return Promise.resolve(this.inputElement.validity) }

    @Method() getValidationMessage() { return Promise.resolve(this.inputElement.validationMessage) }


    /** ELEMENTS */
    containerElement!: HTMLElement
    labelElement!: HTMLLabelElement
    inputElement!: HTMLInputElement


    /** INTERNAL METHODS */
    externalForm() { return this.host.closest('form') }

    externalInput() { return this.host.querySelector('input') }

    isvalid() { return this.inputElement.validity.valid }

    removeEvents(container, input) {
        Object.keys(input.events || {}).forEach((key) => input.events[key]())
        Object.keys(container.events || {}).forEach((key) => container.events[key]())
    }

    sanitized(val) { return !val ? '' : ValidateHtml(val).sanitized as string }

    setError() { this.error = this.sanitized(this.inputElement.validationMessage) }

    handleInput(value) {
        (this.externalInput() || {}).value = this.value = this.inputElement.value = value
        if (!!this.error && this.isvalid()) { this.setError() }
    }

    handleEnter(e) {
        if (!e || !this.externalForm() || !e.key || e.key.toLowerCase() !== 'enter') { return }
        DispatchEvent(this.externalForm(), 'submit')
    }

    setEvents() {
        const container = this.containerElement as any
        const slot = this.host.shadowRoot.querySelector('slot')
        const input = this.inputElement as any

        this.removeEvents(container, input)

        input.events = {
            form: EventObserver(this.externalForm(), 'submit').subscribe((e) => {
                if (!this.isvalid()) {
                    e.preventDefault()
                    this.error = this.inputElement.validationMessage
                }
            })
        }

        container.events = {
            slot: EventObserver(slot, 'slotchange').subscribe(() => AttributeSetRemove(this.containerElement, 'hasicon', !!this.host.querySelector('[slot="icon"]')))
        }
    }

    /** LIFECYLE */
    componentWillLoad() {
        this.sanitizedLabel = this.sanitized(this.label)
        this.sanitizedHelp = this.sanitized(this.helptext)
        this.sanitizedError = this.sanitized(this.error)
        this.optionsArray = optionsToArray(this.options)
        this.internalValue = processedValue(this.internalValue, this.value, this.optionsArray)
        this.name = this.name || `field-radio-${this.inputid}`
    }

    componentDidLoad() { this.setEvents() }

    disconnectedCallback() { this.removeEvents(this.containerElement, this.inputElement) }

    render() {
        return <div
            ref={(el) => this.containerElement = el as HTMLElement}
            class={`field-radio-container field-element-container${this.slim ? ' slim' : ''}${this.autowidth ? ' w-auto' : ''}${this.required ? ' required' : ''}`}
        >
            <div class="field-radio-main-label-container">
                <div class="field-radio-main-label-right">
                    <span class="icon-container"><slot name="icon" /></span>
                    <label ref={(el) => this.labelElement = el as any}>
                        <span>{this.sanitizedLabel}</span>
                        <span class="field-radio-error-text">{this.sanitizedError}</span>
                    </label>
                    <input
                        class="field-radio-hidden-input"
                        type="text"
                        name={this.name}
                        value={this.internalValue}
                        ref={(el) => this.inputElement = el as HTMLInputElement}
                        required={this.required}
                    />
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
                            readOnly={this.readonly}
                        />
                        <label class="field-radio-option-label" htmlFor={`field-radio-input-${index}-${this.inputid}`}>{option.textContent}</label>
                    </div>
                )}
            </div>
        </div>
    }
}

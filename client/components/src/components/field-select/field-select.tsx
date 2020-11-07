import { Component, Prop, h, Watch, Element, Method, State } from '@stencil/core'
import ValidateHtml from '../../../../utils/validate/html'
import ID from '../../../../utils/id'
import EventObserver from '../../../../utils/observe/event-observer'
import AttributeSetRemove from '../../../../utils/dom/attribute-set-remove'
import DispatchEvent from '../../../../utils/dom/dispatch-event'
import Pipe from '../../../../utils/function-helpers/pipe'
import ToArray from '../../../../utils/conversion/to-array'
import CommasToArray from '../../../../utils/conversion/commas-to-array'
import ToOptions, { OptionsObject } from '../../../../utils/conversion/to-options'
import IfInvalid from '../../../../utils/checks/if-invalid'
import Get from '../../../../utils/objects/get'
import GetInputValue from '../../../../utils/dom/get-input-value'

const labelAlignments = ['inside', 'top']
const optionsToArray = Pipe(ToArray, CommasToArray, ToOptions, IfInvalid([]))
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

    @Prop({ mutable: true }) error: string = ''
    @Watch('error') validError(newVal) { AttributeSetRemove(this.labelElement, 'error', this.sanitized(newVal)) }

    @Prop() helptext: string
    @Watch('helptext') validHelpText(newVal) { this.sanitizedHelp = this.sanitized(newVal) }

    @Prop({ reflect: true }) inputid: string = ID()

    @Prop() label: string = ''
    @Watch('label') validLabel(newVal) { this.sanitizedLabel = this.sanitized(newVal) }

    @Prop() labelalign: string = 'inside'
    @Watch('labelalign') validLabelAlign(newVal) { this.containerElement.setAttribute('labelalign', labelAlignments.indexOf(newVal) > -1 ? newVal : labelAlignments[0]) }

    @Prop() name: string

    @Prop() options: string | any[] = []
    @Watch('options') validOptions(newVal) {
        this.optionsArray = optionsToArray(newVal)
        this.value = processedValue(this.value, this.optionsArray)
    }

    @Prop() required: boolean = false

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
    @State() sanitizedHelp: string = ''
    @State() sanitizedError: string = ''
    @State() optionsArray: OptionsObject[] = []

    /** METHODS */
    @Method() getValidity() { return Promise.resolve(this.inputElement.validity) }

    @Method() getValidationMessage() { return Promise.resolve(this.inputElement.validationMessage) }


    /** ELEMENTS */
    containerElement!: HTMLElement
    helpTextElement!: HTMLElement
    inputElement!: HTMLInputElement
    labelElement!: HTMLLabelElement


    /** INTERNAL METHODS */
    externalForm() { return this.host.closest('form') }

    externalInput() { return this.host.querySelector('input') }

    focused() { return this.inputid === (document.activeElement as any).inputid }

    isempty() { return this.value === '' || this.value === undefined }

    isvalid() { return this.inputElement.validity.valid }

    removeEvents(container, input) {
        Object.keys(input.events || {}).forEach((key) => input.events[key]())
        Object.keys(container.events || {}).forEach((key) => container.events[key]())
    }

    sanitized(val) { return !val ? '' : ValidateHtml(val).sanitized as string }

    updateLabelPosition() {
        AttributeSetRemove(this.inputElement, 'label-up', this.focused() || !this.isempty())
    }

    handleInput() {
        (this.externalInput() || {}).value = this.value = GetInputValue(this.inputElement)
        if (!!this.error && this.isvalid()) { this.error = this.inputElement.validationMessage }
        this.updateLabelPosition()
    }

    handleEnter(e) {
        if (!e || !this.externalForm() || !e.key || e.key.toLowerCase() !== 'enter') { return }
        DispatchEvent(this.externalForm(), 'submit')
    }

    setEvents() {
        const container = this.containerElement as any
        const input = this.inputElement as any
        const slot = this.host.shadowRoot.querySelector('slot')

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
            slot: EventObserver(slot, 'slotchange').subscribe(() => {
                AttributeSetRemove(this.containerElement, 'hasicon', !!this.host.querySelector('[slot="icon"]'))
            })
        }
    }

    /** LIFECYLE */
    componentWillLoad() {
        this.sanitizedLabel = this.sanitized(this.label)
        this.sanitizedHelp = this.sanitized(this.helptext)
        this.sanitizedError = this.sanitized(this.error)
        this.optionsArray = optionsToArray(this.options)
        this.value = processedValue(this.value, this.optionsArray)
    }

    componentDidLoad() { this.setEvents() }

    disconnectedCallback() { this.removeEvents(this.containerElement, this.inputElement) }

    render() {
        return <div
            ref={(el) => this.containerElement = el as HTMLElement}
            class={`field-select-container field-element-container${this.slim ? ' slim' : ''}${this.autowidth ? ' w-auto' : ''}`}
        >
            <select
                ref={(el) => this.inputElement = el as any}
                autocomplete={this.autocomplete}
                disabled={this.disabled}
                name={this.name}
                required={this.required}
                form={(this.externalForm() || {}).id}
                onAnimationStart={() => this.updateLabelPosition()}
                onFocus={() => this.updateLabelPosition()}
                onBlur={() => this.updateLabelPosition()}
                onInput={() => this.handleInput()}
                onKeyDown={(e) => this.handleEnter(e)}
            >
                {this.optionsArray.map(option =>
                    <option value={option.value} selected={this.value === option.value}>{option.textContent}</option>
                )}
            </select>

            <label ref={(el) => this.labelElement = el as HTMLLabelElement}>{this.sanitizedLabel}</label>

            <span class="icon-container"><slot name="icon" /></span>

            <span class="field-input-bottom">
                <span
                    ref={(el) => this.helpTextElement = el as HTMLElement}
                    class="field-help-text">{this.sanitizedHelp}</span>
            </span>
        </div>
    }
}

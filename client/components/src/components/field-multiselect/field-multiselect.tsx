import { Component, Prop, h, Watch, Element, State, Method } from '@stencil/core'
import ValidateHtml from '../../../../utils/validate/html'
import Pipe from '../../../../utils/function-helpers/pipe'
import CommasToArray from '../../../../utils/conversion/commas-to-array'
import ToArray from '../../../../utils/conversion/to-array'
import IfInvalid from '../../../../utils/checks/if-invalid'
import ToOptions, { OptionsObject } from '../../../../utils/conversion/to-options'
import EventObserver from '../../../../utils/observe/event-observer'
import DispatchEvent from '../../../../utils/dom/dispatch-event'

const valueToArray = Pipe(CommasToArray, ToArray, IfInvalid([]))
const optionsToArray = Pipe(CommasToArray, ToArray, ToOptions, IfInvalid([]))
const truth = true

@Component({
    tag: 'field-multiselect',
    styleUrl: 'style.scss',
    shadow: true
})

export class FieldMultiselect {
    @Element() host

    /** PROPS */
    @Prop() autofocus: boolean = false

    @Prop() autowidth: boolean = false

    @Prop() disabled: boolean = false
    @Watch('disabled') validDisabled(newVal) { this.dropdownElement.classList[newVal ? 'add' : 'remove']('disabled') }

    @Prop({ mutable: true }) error: string = ''
    @Watch('error') validError(newVal) { this.sanitizedError = this.sanitized(newVal) }

    @Prop() label: string = ''
    @Watch('label') validLabel(newVal) { this.sanitizedLabel = this.sanitized(newVal) }

    @Prop() helptext: string = ''
    @Watch('helptext') validHelpText(newVal) { this.sanitizedHelp = this.sanitized(newVal) }

    @Prop() name: string

    @Prop() options: string | any[] = []
    @Watch('options') validOptions(newVal) {
        this.optionsArray = optionsToArray(newVal)
        const optionValues = this.optionsArray.map(o => o.value)
        this.value = this.valueArray = this.valueArray.filter(v => optionValues.indexOf(v) > -1)
    }

    @Prop() readonly: boolean = false
    @Watch('readonly') validReadOnly(newVal) { this.dropdownElement.classList[newVal ? 'add' : 'remove']('readonly') }

    @Prop() required: boolean = false

    @Prop() slim: boolean = false

    @Prop() value: any[] = []
    @Watch('value') validValue(newVal) {
        this.valueArray = valueToArray(newVal)
        this.handleInput()
    }


    /** STATE */
    @State() sanitizedLabel: string = ''
    @State() sanitizedHelp: string = ''
    @State() optionsArray: OptionsObject[] = []
    @State() valueArray: any[] = []
    @State() sanitizedError: string = ''

    @State() count() { return this.valueArray.length }

    @State() has(value) { return typeof value !== 'undefined' && this.valueArray.indexOf(value) > -1 }

    @State() isEmpty() { return this.count() === 0 }

    @State() isMixed() { return !this.isEmpty() && this.valueArray.length !== this.optionsArray.length }


    /** METHODS */
    @Method() getValidity() { return Promise.resolve(this.labelElement.getValidity()) }

    @Method() getValidationMessage() { return Promise.resolve(this.labelElement.getValidationMessage()) }


    /** INTERNAL METHODS */
    externalForm() { return this.host.closest('form') }

    externalInput() { return this.host.querySelector('input') }

    isvalid() { return !(this.required && this.valueArray.length === 0) }

    removeEvents(input) { Object.keys(input.events || {}).forEach((key) => input.events[key]()) }

    sanitized(val) { return !val ? '' : ValidateHtml(val).sanitized as string }

    setValidationMsg() {
        this.labelElement.getValidationMessage().then(error => this.error = error || ' ')
    }

    handleInput() {
        (this.externalInput() || {}).value = this.valueArray
        if (this.isvalid() && this.sanitizedError) { this.setValidationMsg() }
    }

    updateValues(value) {
        this.value = value
        requestAnimationFrame(() => this.handleInput())
    }

    handleEnter(e) {
        if (!e || !this.externalForm() || !e.key || e.key.toLowerCase() !== 'enter') { return }
        DispatchEvent(this.externalForm(), 'submit')
    }

    setEvents() {
        const input = this.labelElement as any
        this.removeEvents(input)

        input.events = {
            form: EventObserver(this.externalForm(), 'submit').subscribe((e) => {
                if (!this.isvalid()) {
                    e.preventDefault()
                    this.setValidationMsg()
                }
            })
        }
    }

    labelClick() { return () => this.updateValues(this.valueArray.length == 0 ? [...this.optionsArray.map(o => o.value)] : []) }

    itemClick(itemValue) { return () => this.updateValues(!this.has(itemValue) ? [...this.valueArray, itemValue] : this.valueArray.filter(v => v !== itemValue)) }

    init() {
        this.sanitizedLabel = this.sanitized(this.label)
        this.sanitizedHelp = this.sanitized(this.helptext)
        this.sanitizedError = this.sanitized(this.error)
        this.optionsArray = optionsToArray(this.options)
        this.valueArray = valueToArray(this.value)
    }


    /** ELEMENTS */
    containerElement!: HTMLElement
    dropdownElement!: HTMLElement
    helpTextElement!: HTMLElement
    labelElement!: HTMLFieldCheckboxElement


    /** LIFECYLE */
    componentWillLoad() { this.init() }

    componentDidLoad() { this.setEvents() }

    disconnectedCallback() { this.removeEvents(this.labelElement) }

    render() {
        return <div class="field-multiselect-outer-container">
            <div
                ref={(el) => this.containerElement = el as HTMLElement}
                class={`field-multiselect-container field-element-container${this.slim ? ' slim' : ''}${this.autowidth ? ' w-auto' : ''}`}
            >
                <drop-down ref={(el) => this.dropdownElement = el as HTMLElement} class="field-multiselect-dropdown">
                    <field-checkbox
                        autofocus={this.autofocus}
                        autowidth={truth}
                        error={this.sanitizedError}
                        label={this.label}
                        ref={(el) => this.labelElement = el as HTMLFieldCheckboxElement}
                        required={this.required}
                        slim={truth}
                        slot="label"
                        mixed={this.isMixed()}
                        onInput={this.labelClick()}
                        value={!this.isEmpty()}
                    ></field-checkbox>

                    {this.optionsArray.map((option) =>
                        <field-checkbox
                            autowidth={truth}
                            label={option.textContent}
                            name={option.value}
                            slim={truth}
                            slot="item"
                            onInput={this.itemClick(option.value)}
                            value={this.valueArray.indexOf(option.value) > -1}
                        ></field-checkbox>
                    )}
                </drop-down>

                <span class="field-input-bottom">
                    <span ref={(el) => this.helpTextElement = el as HTMLElement} class="field-help-text">{this.sanitizedHelp}</span>
                </span>
            </div>
        </div>
    }
}

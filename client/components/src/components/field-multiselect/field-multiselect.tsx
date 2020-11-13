import { Component, Prop, h, Watch, Element, State, Method } from '@stencil/core'
import ValidateHtml from '../../../../utils/validate/html'
import Pipe from '../../../../utils/function-helpers/pipe'
import CommasToArray from '../../../../utils/conversion/commas-to-array'
import ToArray from '../../../../utils/conversion/to-array'
import IfInvalid from '../../../../utils/checks/if-invalid'
import ToOptions, { OptionsObject } from '../../../../utils/conversion/to-options'
import DispatchEvent from '../../../../utils/dom/dispatch-event'
import ToJSON from '../../../../utils/conversion/to-json'
import ID from '../../../../utils/id'
import RenderLightDom from '../../../../utils/dom/render-light-dom'
import InputName from '../../../../utils/dom/input-name'
import SetAttribute from '../../../../utils/dom/set-attribute'

const valueToArray = Pipe(CommasToArray, ToArray, IfInvalid([]))
const optionsToArray = Pipe(CommasToArray, ToArray, ToOptions, IfInvalid([]))
const sanitized = (val: string) => !val ? '' : ValidateHtml(val).sanitized as string

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
    @Watch('disabled') validDisabled(newVal) {
        SetAttribute(this.formInput, 'disabled', newVal)
        this.dropdownElement.classList[newVal ? 'add' : 'remove']('disabled')
    }

    @Prop({ mutable: true }) error: string = ''
    @Watch('error') validError(newVal) { this.sanitizedError = sanitized(newVal) }

    @Prop() label: string = ''
    @Watch('label') validLabel(newVal) { this.sanitizedLabel = sanitized(newVal) }

    @Prop({ reflect: true }) inputid: string = ID()

    @Prop() helptext: string = ''
    @Watch('helptext') validHelpText(newVal) { this.sanitizedHelp = sanitized(newVal) }

    @Prop({ mutable: true, reflect: true }) name: string = ''
    @Watch('name') nameWatcher(newVal) {
        this.name = InputName(newVal, this.sanitizedLabel, this.inputid)
        SetAttribute(this.formInput, 'name', this.name)
    }

    @Prop() options: string | any[] = []
    @Watch('options') validOptions(newVal) {
        this.optionsArray = optionsToArray(newVal)
        const optionValues = this.optionsArray.map(o => o.value)
        this.value = this.valueArray = this.valueArray.filter(v => optionValues.indexOf(v) > -1)
    }

    @Prop() readonly: boolean = false
    @Watch('readonly') readonlyWatcher(newVal) {
        SetAttribute(this.formInput, 'readonly', newVal)
        this.dropdownElement.classList[newVal ? 'add' : 'remove']('readonly')
    }

    @Prop() required: boolean = false
    @Watch('required') requiredWatcher(newVal) { SetAttribute(this.formInput, 'required', newVal) }

    @Prop() slim: boolean = false

    @Prop() value: any[] = []
    @Watch('value') validValue(newVal) {
        this.valueArray = valueToArray(newVal)
        this.handleInput()
    }


    /** STATE */
    @State() sanitizedHelp: string = ''
    @State() optionsArray: OptionsObject[] = []
    @State() valueArray: any[] = []
    @State() sanitizedError: string = ''
    @State() count() { return this.valueArray.length }
    @State() has(value) { return typeof value !== 'undefined' && this.valueArray.indexOf(value) > -1 }
    @State() isEmpty() { return this.count() === 0 }
    @State() isMixed() { return !this.isEmpty() && this.valueArray.length !== this.optionsArray.length }
    @State() sanitizedLabel: string = ''
    @Watch('sanitizedLabel') validSanitizedLabel(newVal) {
        SetAttribute(this.containerElement, 'has-label', (!!newVal).toString())
        this.name = InputName(this.name, newVal, this.inputid)
    }


    /** METHODS */
    @Method() getValidity() { return Promise.resolve(this.formInput.validity) }
    @Method() getValidationMessage() { return Promise.resolve(this.formInput.validationMessage) }


    /** INTERNAL METHODS */
    externalForm() { return this.host.closest('form') }

    focused() { return this.inputid === (document.activeElement as any).inputid }

    isvalid() { return this.formInput.validity.valid }

    setFocused() {
        const focused = this.focused()
        SetAttribute(this.host, 'focused', focused)
        SetAttribute(this.containerElement, 'focused', focused.toString())
    }

    handleInput() {
        this.formInput.value = ToJSON(this.valueArray)
        if (!!this.error && this.isvalid()) { this.error = sanitized(this.formInput.validationMessage) }
    }

    updateValues(value) {
        this.value = value
        requestAnimationFrame(() => this.handleInput())
    }

    handleEnter(e) {
        if (!e || !this.externalForm() || !e.key || e.key.toLowerCase() !== 'enter') { return }
        DispatchEvent(this.externalForm(), 'submit')
    }

    labelClick() { return () => this.updateValues(this.valueArray.length == 0 ? [...this.optionsArray.map(o => o.value)] : []) }

    itemClick(itemValue) { return () => this.updateValues(!this.has(itemValue) ? [...this.valueArray, itemValue] : this.valueArray.filter(v => v !== itemValue)) }


    /** ELEMENTS */
    containerElement!: HTMLElement
    dropdownElement!: HTMLElement
    helpTextElement!: HTMLElement
    labelElement!: HTMLFieldCheckboxElement
    formInput!: HTMLInputElement


    /** LIFECYLE */
    componentWillLoad() {
        this.sanitizedLabel = sanitized(this.label)
        this.sanitizedHelp = sanitized(this.helptext)
        this.sanitizedError = sanitized(this.error)
        this.optionsArray = optionsToArray(this.options)
        this.valueArray = valueToArray(this.value)
    }

    componentDidLoad() { SetAttribute(this.containerElement, 'has-label', (!!this.sanitizedLabel).toString()) }

    render() {
        this.formInput = RenderLightDom(this.host, 'input.field-multiselect-hidden-input', {
            tagName: 'input',
            type: 'text',
            value: ToJSON(this.valueArray),
            name: this.name,
            required: this.required,
            disabled: this.disabled,
            readonly: this.readonly,
            class: 'field-multiselect-hidden-input',
            slot: 'form-control'
        }) as HTMLInputElement

        return <div class="field-multiselect-outer-container">
            <div
                ref={(el) => this.containerElement = el as HTMLElement}
                class={`field-multiselect-container field-element-container${this.slim ? ' slim' : ''}${this.autowidth ? ' w-auto' : ''}`}
            >
                <drop-down ref={(el) => this.dropdownElement = el as HTMLElement} class="field-multiselect-dropdown">
                    <field-checkbox
                        autofocus={this.autofocus}
                        autowidth={true}
                        error={this.sanitizedError}
                        label={this.sanitizedLabel}
                        required={this.required}
                        novalidate={true}
                        ref={(el) => this.labelElement = el as HTMLFieldCheckboxElement}
                        slim={true}
                        slot="label"
                        mixed={this.isMixed()}
                        onInput={this.labelClick()}
                        onFocus={() => this.setFocused()}
                        onBlur={() => this.setFocused()}
                        value={!this.isEmpty()}
                    ></field-checkbox>

                    {this.optionsArray.map((option) =>
                        <field-checkbox
                            autowidth={true}
                            label={option.textContent}
                            name={option.value}
                            slim={true}
                            slot="item"
                            onInput={this.itemClick(option.value)}
                            onFocus={() => this.setFocused()}
                            onBlur={() => this.setFocused()}
                            value={this.valueArray.indexOf(option.value) > -1}
                        ></field-checkbox>
                    )}
                </drop-down>

                <span class="field-input-bottom">
                    <span ref={(el) => this.helpTextElement = el as HTMLElement} class="field-help-text">{this.sanitizedHelp}</span>
                </span>
            </div>
            <div class="form-control"><slot name="form-control"></slot></div>
        </div>
    }
}

import { Component, Prop, h, Watch, Element, Method, State, Event } from '@stencil/core'
import ID from '../../../../utils/id'
import DispatchEvent from '../../../../utils/dom/dispatch-event'
import Pipe from '../../../../utils/function-helpers/pipe'
import ToArray from '../../../../utils/conversion/to-array'
import CommasToArray from '../../../../utils/conversion/commas-to-array'
import ToOptions, { OptionsObject } from '../../../../utils/conversion/to-options'
import IfInvalid from '../../../../utils/checks/if-invalid'
import GetInputValue from '../../../../utils/dom/get-input-value'
import RenderLightDom from '../../../../utils/dom/render-light-dom'
import InputName from '../../../../utils/dom/input-name'
import FormControl from '../../../../utils/dom/form-control'
import SetAttribute from '../../../../utils/dom/set-attribute'
import { SantizedHTML } from '../../../../utils/validate/html'
import Debounce from '../../../../utils/timing/debounce'

const optionsToArray = Pipe(ToArray, CommasToArray, ToOptions, IfInvalid([]))

@Component({
    tag: 'field-filter',
    styleUrl: 'style.scss',
    shadow: true
})

export class FieldFilter {
    @Element() host

    @Event() changed
    debounceChanged = Debounce(() => this.changed.emit({ element: this, value: this.value }))

    /** PROPS */

    @Prop() arrow: boolean = false
    @Watch('arrow') arrowWatcher(newVal) { this.updateArrow(newVal) }

    @Prop() autocomplete: string = 'on'

    @Prop() autowidth: boolean = false

    @Prop() disabled: boolean = false
    @Watch('disabled') disabledWatcher(newVal) { SetAttribute(this.formInput, 'disabled', newVal) }

    @Prop({ mutable: true }) error: string = ''
    @Watch('error') validError(newVal) { SetAttribute(this.labelElement, 'error', SantizedHTML(newVal)) }

    @Prop() helptext: string
    @Watch('helptext') validHelpText(newVal) { this.sanitizedHelp = SantizedHTML(newVal) }

    @Prop({ reflect: true }) inputid: string = ID()

    @Prop() label: string = ''
    @Watch('label') validLabel(newVal) { this.sanitizedLabel = SantizedHTML(newVal) }

    @Prop() labelup: boolean = false
    @Watch('labelup') validLabelUp() { this.setLabelPosition() }

    @Prop({ mutable: true, reflect: true }) name: string = ''
    @Watch('name') nameWatcher(newVal) {
        this.name = InputName(newVal, this.sanitizedLabel, this.inputid)
        SetAttribute(this.formInput, 'name', this.name)
    }

    @Prop() options: string | any[] = []
    @Watch('options') validOptions(newVal) { this.optionsArray = optionsToArray(newVal) }

    @Prop() required: boolean = false
    @Watch('required') requiredWatcher(newVal) { SetAttribute(this.formInput, 'required', newVal) }

    @Prop() nomargin: boolean = false

    @Prop({ reflect: true }) theme: 'inverse' | '' = ''
    @Watch('theme') themeWatcher(newVal) { this.updateTheme(newVal) }

    @Prop({ mutable: true, reflect: true }) value: string = ''
    @Watch('value') valueWatcher() { this.setSize() }


    /** STATE */
    @State() sanitizedLabel: string = ''
    @Watch('sanitizedLabel') validSanitizedLabel(newVal) {
        SetAttribute(this.containerElement, 'has-label', (!!newVal).toString())
        this.name = InputName(this.name, newVal, this.inputid)
    }
    @State() sanitizedHelp: string = ''
    @State() sanitizedError: string = ''
    @State() optionsArray: OptionsObject[] = optionsToArray(this.options)

    /** METHODS */
    @Method() getValidity() { return Promise.resolve(this.formInput.validity) }
    @Method() getValidationMessage() { return Promise.resolve(this.formInput.validationMessage) }


    /** ELEMENTS */
    containerElement!: HTMLElement
    inputElement!: HTMLInputElement
    labelElement!: HTMLLabelElement
    formInput!: HTMLInputElement
    dropDown!: HTMLDropDownElement


    /** INTERNAL METHODS */
    externalForm() { return this.host.closest('form') }

    focused() { return this.inputid === (document.activeElement as any).inputid || this.host.shadowRoot.activeElement === this.inputElement }

    isempty() { return this.value === '' || this.value === undefined }

    isvalid() { return this.formInput.validity.valid }

    checkError() { this.error = this.formInput.validationMessage }

    setSize() {
        if (this.autowidth) {
            this.inputElement.setAttribute('size', (this.value || '').length.toString())
        } else {
            this.inputElement.removeAttribute('size')
        }
    }

    handleInput() {
        this.formInput.value = this.value = GetInputValue(this.inputElement)
        if (!!this.error && this.isvalid()) { this.error = this.formInput.validationMessage }
        this.setSize()
        this.setLabelPosition()
        this.debounceChanged()
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

        this.dropDown.open = focused
    }

    updateTheme(theme) { this.containerElement.setAttribute('theme', theme) }

    updateArrow(show) {
        this.containerElement.setAttribute('arrow', show ? 'true' : 'false')
    }

    /** LIFECYLE */
    componentWillLoad() {
        this.sanitizedLabel = SantizedHTML(this.label)
        this.sanitizedHelp = SantizedHTML(this.helptext)
        this.sanitizedError = SantizedHTML(this.error)
        this.optionsArray = optionsToArray(this.options)
    }

    componentDidLoad() {
        SetAttribute(this.containerElement, 'has-label', (!!this.sanitizedLabel).toString())
        this.setLabelPosition()
        FormControl.apply(this, [this.inputid, this.formInput, this.externalForm()])
        this.updateTheme(this.theme)
        this.updateArrow(this.arrow)
        this.setSize()
    }

    render() {
        this.formInput = RenderLightDom(this.host, 'input.field-filter-hidden-input', {
            tagName: 'input',
            type: 'text',
            value: this.value,
            name: this.name,
            required: this.required,
            disabled: this.disabled,
            class: 'field-filter-hidden-input',
            slot: 'form-control'
        }) as HTMLInputElement

        return <div
            onMouseEnter={() => this.dropDown.open = true}
            onMouseOut={() => this.dropDown.open = false}
            ref={(el) => this.containerElement = el as HTMLElement}
            class={`field-filter-container field-element-container${this.nomargin ? ' nomargin' : ''}${this.autowidth ? ' w-auto' : ''}`}
        >
            <span class="icon-container"><slot name="icon" /></span>
            <div class="field-input-label" >
                <drop-down
                    ref={(el) => this.dropDown = el}
                    onDropdownitemclicked={e => {
                        this.inputElement.value = e.detail.getAttribute('data-value')
                        this.handleInput()
                    }}
                >
                    <div slot="label">{this.value || ' '}</div>
                    {this.optionsArray.map(option =>
                        <div slot="item" data-value={option.value} data-selected={this.value === option.value}>{option.textContent}</div>
                    )}
                </drop-down>

                <input
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
                        this.handleInput()
                    }}
                    onInput={() => this.handleInput()}
                    onKeyDown={(e) => this.handleEnter(e)}
                    value={this.value}
                ></input>

                <label ref={(el) => this.labelElement = el as HTMLLabelElement}>{this.sanitizedLabel}</label>

                <icon-element kind="chevron-down" class="field-filter-arrow"></icon-element>

            </div>

            <span class="field-input-bottom">
                <span class="field-help-text">{this.sanitizedHelp}</span>
            </span>
            <div class="form-control"><slot name="form-control"></slot></div>
        </div>
    }
}

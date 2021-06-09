import { Component, Prop, h, Watch, Element, Method, State, Event } from '@stencil/core'
import ID from '../../../../utils/id'
import AttributeSetRemove from '../../../../utils/dom/attribute-set-remove'
import DispatchEvent from '../../../../utils/dom/dispatch-event'
import RenderLightDom from '../../../../utils/dom/render-light-dom'
import InputName from '../../../../utils/dom/input-name'
import FormControl from '../../../../utils/dom/form-control'
import SetAttribute from '../../../../utils/dom/set-attribute'
import InputLabelId from '../../../../utils/dom/input-label-id'
import { SantizedHTML } from '../../../../utils/validate/html'
import Debounce from '../../../../utils/timing/debounce'

@Component({
    tag: 'field-color',
    styleUrl: 'style.scss',
    shadow: true
})

export class FieldColor {
    @Element() host

    @Event() changed
    debounceChanged = Debounce(() => this.changed.emit({ element: this, value: this.value }))

    /** PROPS */
    @Prop() autocomplete: string = 'on'

    @Prop() autofocus: boolean = false

    @Prop() autowidth: boolean = false

    @Prop() disabled: boolean = false
    @Watch('disabled') disabledWatcher(newVal) { SetAttribute(this.formInput, 'disabled', newVal) }

    @Prop({ mutable: true }) error: string = ''
    @Watch('error') validError(newVal) { AttributeSetRemove(this.labelElement, 'error', SantizedHTML(newVal)) }

    @Prop() helptext: string
    @Watch('helptext') validHelpText(newVal) { this.sanitizedHelp = SantizedHTML(newVal) }

    @Prop({ reflect: true }) inputid: string = ID()
    @Watch('inputid') validId(newVal) { InputLabelId(newVal, this.inputElement, this.labelElement) }

    @Prop() label: string = ''
    @Watch('label') validLabel(newVal) { this.sanitizedLabel = SantizedHTML(newVal) }

    @Prop() labelup: boolean = false
    @Watch('labelup') validLabelUp() { this.setLabelPosition() }

    @Prop({ mutable: true, reflect: true }) name: string = ''
    @Watch('name') nameWatcher(newVal) {
        this.name = InputName(newVal, this.sanitizedLabel, this.inputid)
        SetAttribute(this.formInput, 'name', this.name)
    }

    @Prop() required: boolean = false
    @Watch('required') requiredWatcher(newVal) { SetAttribute(this.formInput, 'required', newVal) }

    @Prop() nomargin: boolean = false

    @Prop({ reflect: true }) theme: 'inverse' | '' = ''
    @Watch('theme') themeWatcher(newVal) { this.updateTheme(newVal) }

    @Prop({ mutable: true, reflect: true }) value: string = ''
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
    inputElement!: HTMLInputElement
    labelElement!: HTMLLabelElement
    formInput!: HTMLInputElement
    dropdownElement!: HTMLDropDownElement
    colorPickerElement!: HTMLColorPickerElement


    /** INTERNAL METHODS */
    externalForm() { return this.host.closest('form') }

    focused() { return this.inputid === (document.activeElement as any).inputid || this.host.shadowRoot.activeElement === this.inputElement }

    isempty() { return this.value == '' || this.value == undefined }

    isvalid() { return this.formInput.validity.valid }

    checkError() { this.error = this.formInput.validationMessage }

    handleInput() {
        this.formInput.value = this.value = this.inputElement.value
        if (!!this.error && this.isvalid()) { this.error = this.formInput.validationMessage }

        const empty = this.isempty()
        this.host.setAttribute('empty', empty)

        if (this.containerElement) {
            this.containerElement.setAttribute('empty', empty.toString())
        }

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
            SetAttribute(
                SetAttribute(this.containerElement, 'empty', empty.toString()),
                'focused', focused.toString()),
            'label-up', focused || !empty || forcedUp ? 'true' : 'false'
        )
    }

    updateTheme(theme) { this.containerElement.setAttribute('theme', theme) }


    /** LIFECYLE */
    componentWillLoad() {
        this.sanitizedLabel = SantizedHTML(this.label)
        this.sanitizedHelp = SantizedHTML(this.helptext)
    }

    componentDidLoad() {
        InputLabelId(this.inputid, this.inputElement, this.labelElement)
        this.containerElement.setAttribute('has-label', (!!this.sanitizedLabel).toString())
        this.setLabelPosition()
        FormControl.apply(this, [this.inputid, this.formInput, this.externalForm()])
        this.updateTheme(this.theme)
    }

    render() {
        this.formInput = RenderLightDom(this.host, 'input.field-color-hidden-input', {
            tagName: 'input',
            type: 'text',
            value: this.value,
            name: this.name,
            required: this.required,
            disabled: this.disabled,
            class: 'field-color-hidden-input',
            slot: 'form-control'
        }) as HTMLInputElement

        return <div
            ref={(el) => this.containerElement = el as HTMLElement}
            class={`field-color-container field-element-container${this.nomargin ? ' nomargin' : ''}${this.autowidth ? ' w-auto' : ''}`}
            onMouseEnter={() => this.dropdownElement.open = true}
            onMouseLeave={() => this.dropdownElement.open = false}
        >
            <span class="icon-container"><slot name="icon" /></span>
            <div class="field-input-label">
                <input
                    ref={(el) => this.inputElement = el as any}
                    placeholder=" "
                    type="text"
                    value={this.value}
                    autocomplete={this.autocomplete}
                    autofocus={this.autofocus}
                    disabled={this.disabled}
                    required={this.required}
                    id={this.inputid}
                    name={this.name}
                    form={(this.externalForm() || {}).id}
                    onAnimationStart={() => this.setLabelPosition()}
                    onFocus={() => this.setLabelPosition()}
                    onBlur={() => {
                        this.checkError()
                        this.setLabelPosition()
                    }}
                    onInput={() => this.handleInput()}
                    onKeyDown={(e) => this.handleEnter(e)}
                />
                <label ref={(el) => this.labelElement = el as HTMLLabelElement}>{this.sanitizedLabel}</label>
                <drop-down
                    ref={(el) => this.dropdownElement = el as HTMLDropDownElement}
                    class="field-color-drop-down"
                    closeonclick={false}
                    openonhover={false}
                    arrow={false}
                >
                    <color-picker slot="item" ref={(el) => this.colorPickerElement = el as HTMLColorPickerElement}></color-picker>
                </drop-down>
            </div>
            <span class="field-input-bottom">
                <span class="field-help-text">{this.sanitizedHelp}</span>
            </span>
            <div class="form-control"><slot name="form-control"></slot></div>
        </div>
    }
}

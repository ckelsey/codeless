import { Component, Prop, h, Watch, Element, Method, State, Listen, Event } from '@stencil/core'
import ID from '../../../../utils/id'
import AttributeSetRemove from '../../../../utils/dom/attribute-set-remove'
import DispatchEvent from '../../../../utils/dom/dispatch-event'
import RenderLightDom from '../../../../utils/dom/render-light-dom'
import InputName from '../../../../utils/dom/input-name'
import FormControl from '../../../../utils/dom/form-control'
import SetAttribute from '../../../../utils/dom/set-attribute'
import { SantizedHTML } from '../../../../utils/validate/html'
import Debounce from '../../../../utils/timing/debounce'

@Component({
    tag: 'field-date',
    styleUrl: 'style.scss',
    shadow: true
})

export class FieldDate {
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

    @Prop() label: string = ''
    @Watch('label') validLabel(newVal) { this.sanitizedLabel = SantizedHTML(newVal) }

    @Prop() labelup: boolean = false
    @Watch('labelup') validLabelUp() { this.setLabelPosition() }

    @Prop({ mutable: true, reflect: true }) name: string = ''
    @Watch('name') nameWatcher(newVal) {
        this.name = InputName(newVal, this.sanitizedLabel, this.inputid)
        SetAttribute(this.formInput, 'name', this.name)
    }

    @Prop() max: number

    @Prop() min: number

    @Prop({ mutable: true, reflect: true }) active: boolean = false

    @Prop() required: boolean = false
    @Watch('required') requiredWatcher(newVal) { SetAttribute(this.formInput, 'required', newVal) }

    @Prop() nomargin: boolean = false

    @Prop({ reflect: true }) theme: 'inverse' | '' = ''
    @Watch('theme') themeWatcher(newVal) { this.updateTheme(newVal) }

    @Prop({ mutable: true, reflect: true }) value: Date | string
    @Watch('value') valueWatcher(newVal) { this.updateDate(newVal) }

    /** STATE */
    @State() startDate: Date = new Date()
    @State() localeString: string = ''
    @State() monthString: string = ''
    @State() yearString: string = ''
    @State() sanitizedHelp: string = ''
    @State() sanitizedLabel: string = ''
    @Watch('sanitizedLabel') validSanitizedLabel(newVal) {
        SetAttribute(this.containerElement, 'has-label', (!!newVal).toString())
        this.name = InputName(this.name, newVal, this.inputid)
    }


    /** METHODS */
    @Method() getValidity() { return Promise.resolve(this.formInput.validity) }
    @Method() getValidationMessage() { return Promise.resolve(this.formInput.validationMessage) }


    /** LISTEN */
    @Listen('dayclick') onDayClick(e) {
        this.value = e.detail.date
    }

    @Listen('datechange') onDateChange(e) {
        this.value = e.detail.date
    }


    /** ELEMENTS */
    containerElement!: HTMLElement
    labelElement!: HTMLLabelElement
    formInput!: HTMLInputElement
    inputElement!: HTMLInputElement
    dropdownElement!: HTMLDropDownElement


    /** INTERNAL METHODS */
    externalForm() { return this.host.closest('form') }

    focused() { return this.inputid === (document.activeElement as any).inputid || this.host.shadowRoot.activeElement === this.inputElement }

    isempty() { return this.value == undefined }

    isvalid() { return this.formInput.validity.valid }

    checkError() { this.error = this.formInput.validationMessage }

    updateDate(newVal) {
        this.setLabelPosition()
        const date = new Date(newVal)

        if (invalidDate(date)) { return }

        this.startDate = date
        this.localeString = date.toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
        this.monthString = date.toLocaleString(undefined, { month: 'long' })
        this.yearString = date.toLocaleString(undefined, { year: 'numeric' })
    }

    setLabelPosition() {
        const focused = this.focused()
        const empty = this.isempty()
        SetAttribute(SetAttribute(this.host, 'empty', empty), 'focused', focused)
        SetAttribute(SetAttribute(this.containerElement, 'focused', focused.toString()), 'label-up', focused || !empty || this.labelup ? 'true' : 'false')
    }

    handleInput() {
        this.formInput.value = (this.value || '').toString()
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
        this.updateDate(this.value)
    }

    componentDidLoad() {
        SetAttribute(this.containerElement, 'has-label', (!!this.sanitizedLabel).toString())
        this.setLabelPosition()
        FormControl.apply(this, [this.inputid, this.formInput, this.externalForm()])
        this.updateTheme(this.theme)
    }

    render() {
        this.formInput = RenderLightDom(this.host, 'input.field-date-hidden-input', {
            tagName: 'input',
            type: 'text',
            value: this.value,
            name: this.name,
            required: this.required,
            disabled: this.disabled,
            class: 'field-date-hidden-input',
            slot: 'form-control'
        }) as HTMLInputElement

        return <div
            ref={(el) => this.containerElement = el as HTMLElement}
            class={`field-date-container field-element-container${this.nomargin ? ' nomargin' : ''}${this.autowidth ? ' w-auto' : ''}`}
            onMouseEnter={() => this.dropdownElement.open = true}
            onMouseLeave={() => this.dropdownElement.open = false}
        >
            <span class="icon-container"><slot name="icon" /></span>
            <div class="field-input-label">
                <drop-down
                    ref={(el) => this.dropdownElement = el as HTMLDropDownElement}
                    class="field-date-drop-down"
                    closeonclick={false}
                    openonhover={false}
                    arrow={false}
                >
                    <div class="field-date-input" slot="label">{this.localeString}</div>
                    <div class="field-date-overlay" slot="item">
                        <calendar-header date={this.value}></calendar-header>
                        <calendar-month slot="item" date={this.startDate}></calendar-month>
                    </div>
                </drop-down>

                <label ref={(el) => this.labelElement = el as HTMLLabelElement} class="field-date-label">{this.sanitizedLabel}</label>
            </div>
            <span class="field-input-bottom">
                <span class="field-help-text">{this.sanitizedHelp}</span>
            </span>
            <div class="form-control"><slot name="form-control"></slot></div>
        </div>
    }
}

const invalidDate = (val: any) => !val || (!!val && val.toString() === 'Invalid Date')
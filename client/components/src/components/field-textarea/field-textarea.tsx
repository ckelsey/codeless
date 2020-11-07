
import { Component, Prop, h, Watch, Element, Method, State } from '@stencil/core'
import ValidateHtml from '../../../../utils/validate/html'
import ID from '../../../../utils/id'
import EventObserver from '../../../../utils/observe/event-observer'
import AttributeSetRemove from '../../../../utils/dom/attribute-set-remove'

const resizeOptions = ['none', 'horizontal', 'vertical', 'both']
const labelAlignments = ['inside', 'top']
const attachId = (id: string, input: HTMLInputElement, label: any) => {
    input.id = id
    label.setAttribute('for', id)
}

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

    @Prop({ mutable: true }) error: string = ''
    @Watch('error') validError(newVal) { AttributeSetRemove(this.labelElement, 'error', this.sanitized(newVal)) }

    @Prop() helptext: string
    @Watch('helptext') validHelpText(newVal) { this.sanitizedHelp = this.sanitized(newVal) }

    @Prop({ reflect: true }) inputid: string = ID()
    @Watch('inputid') validId(newVal) { attachId(newVal, this.inputElement, this.labelElement) }

    @Prop() label: string = ''
    @Watch('label') validLabel(newVal) { this.sanitizedLabel = this.sanitized(newVal) }

    @Prop() labelalign: string = 'inside'
    @Watch('labelalign') validLabelAlign(newVal) { this.containerElement.setAttribute('labelalign', labelAlignments.indexOf(newVal) > -1 ? newVal : labelAlignments[0]) }

    @Prop() name: string

    @Prop() max: number

    @Prop() min: number

    @Prop() readonly: boolean = false

    @Prop() required: boolean = false

    @Prop() resize: string = resizeOptions[0]
    @Watch('resize') validResize(newVal) { this.containerElement.setAttribute('resize', resizeOptions.indexOf(newVal) > -1 ? newVal : resizeOptions[0]) }

    @Prop() showcount: boolean = false

    @Prop() slim: boolean = false

    @Prop() value: string = ''
    @Watch('value') validValue(newVal) { if (typeof newVal == 'undefined') { return this.value = '' } }


    /** STATE */
    @State() sanitizedHelp: string = ''
    @State() sanitizedLabel: string = ''

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

    isempty() { return this.value == '' || this.value == undefined }

    isvalid() { return this.inputElement.validity.valid }

    removeEvents(container, input) {
        Object.keys(input.events || {}).forEach((key) => input.events[key]())
        Object.keys(container.events || {}).forEach((key) => container.events[key]())
    }

    sanitized(val) { return !val ? '' : ValidateHtml(val).sanitized as string }

    updateLabelPosition() { AttributeSetRemove(this.inputElement, 'label-up', this.focused() || (this.value !== '' && this.value != 'undefined')) }

    handleInput() {
        (this.externalInput() || {}).value = this.value = this.inputElement.value
        this.count = this.inputElement.value.length
        if (!!this.error && this.isvalid()) { this.error = this.inputElement.validationMessage }
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
    componentWillLoad() { this.sanitizedLabel = this.sanitized(this.label) }

    componentDidLoad() {
        this.setEvents()
        attachId(this.inputid, this.inputElement, this.labelElement)
    }

    disconnectedCallback() {
        this.removeEvents(this.containerElement, this.inputElement)
    }

    render() {
        return <div
            ref={(el) => this.containerElement = el as HTMLElement}
            class={`field-textarea-container field-element-container${this.slim ? ' slim' : ''}${this.autowidth ? ' w-auto' : ''}${this.fullwidth ? ' w-100' : ''}`}
        >
            <textarea
                ref={(el) => this.inputElement = el as any}
                placeholder=" "
                value={this.value}
                autofocus={this.autofocus}
                disabled={this.disabled}
                name={this.name}
                readonly={this.readonly}
                required={this.required}
                id={this.inputid}
                maxLength={this.max}
                minLength={this.min}
                form={(this.externalForm() || {}).id}
                onAnimationStart={() => this.updateLabelPosition()}
                onFocus={() => this.updateLabelPosition()}
                onBlur={() => this.updateLabelPosition()}
                onInput={() => this.handleInput()}
            >{this.value}</textarea>

            <label ref={(el) => this.labelElement = el as HTMLLabelElement}>{this.sanitizedLabel}</label>

            <span class="icon-container"><slot name="icon" /></span>

            <span class="field-input-bottom">
                <span
                    ref={(el) => this.helpTextElement = el as HTMLElement}
                    class="field-help-text">{this.sanitizedHelp}</span>

                <span class="field-count-text">{this.showcount ? this.max ? `${this.count}/${this.max}` : this.count : ''}</span>
            </span>
        </div>
    }
}

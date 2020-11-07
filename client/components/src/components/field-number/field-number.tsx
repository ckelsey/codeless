import { Component, Prop, h, Watch, Element, Method, State } from '@stencil/core'
import ValidateHtml from '../../../../utils/validate/html'
import ID from '../../../../utils/id'
import EventObserver from '../../../../utils/observe/event-observer'
import AttributeSetRemove from '../../../../utils/dom/attribute-set-remove'
import DispatchEvent from '../../../../utils/dom/dispatch-event'

const iconAlignments = ['left', 'right']
const labelAlignments = ['inside', 'top']
const attachId = (id: string, input: HTMLInputElement, label: any) => {
    input.id = id
    label.setAttribute('for', id)
}

@Component({
    tag: 'field-number',
    styleUrl: 'style.scss',
    shadow: true
})

export class FieldNumber {
    @Element() host

    /** PROPS */
    @Prop() autocomplete: string = 'on'

    @Prop() autofocus: boolean = false

    @Prop() autowidth: boolean = false

    @Prop() disabled: boolean = false

    @Prop({ mutable: true }) error: string = ''
    @Watch('error') validError(newVal) { AttributeSetRemove(this.labelElement, 'error', this.sanitized(newVal)) }

    @Prop() helptext: string
    @Watch('helptext') validHelpText(newVal) { this.sanitizedHelp = this.sanitized(newVal) }

    @Prop() iconalign: string = 'left'
    @Watch('iconalign') validIconAlign(newVal) { this.containerElement.setAttribute('iconalign', iconAlignments.indexOf(newVal) > -1 ? newVal : iconAlignments[0]) }

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

    @Prop() slim: boolean = false

    @Prop() value: number | undefined
    @Watch('value') validValue(newVal) {
        this.value = isNaN(newVal) ? undefined : newVal
    }


    /** STATE */
    @State() sanitizedHelp: string = ''
    @State() sanitizedLabel: string = ''


    /** METHODS */
    @Method() getValidity() { return Promise.resolve(this.inputElement.validity) }
    @Method() getValidationMessage() { return Promise.resolve(this.inputElement.validationMessage) }


    /** ELEMENTS */
    containerElement!: HTMLElement
    helpTextElement!: HTMLElement
    iconElement!: HTMLSpanElement
    inputElement!: HTMLInputElement
    labelElement!: HTMLLabelElement


    /** INTERNAL METHODS */
    externalForm() { return this.host.closest('form') }

    externalInput() { return this.host.querySelector('input') }

    focused() { return this.inputid === (document.activeElement as any).inputid }

    isempty() { return this.value == undefined }

    isvalid() { return this.inputElement.validity.valid }

    removeEvents(container, input) {
        Object.keys(input.events || {}).forEach((key) => input.events[key]())
        Object.keys(container.events || {}).forEach((key) => container.events[key]())
    }

    sanitized(val) { return !val ? '' : ValidateHtml(val).sanitized as string }

    updateLabelPosition() { AttributeSetRemove(this.inputElement, 'label-up', this.focused() || this.value !== undefined) }

    handleInput() {
        (this.externalInput() || {}).value = this.value = parseFloat(this.inputElement.value)
        if (!!this.error && this.isvalid()) { this.error = this.inputElement.validationMessage }
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
    }

    componentDidLoad() {
        this.setEvents()
        attachId(this.inputid, this.inputElement, this.labelElement)
    }

    disconnectedCallback() { this.removeEvents(this.containerElement, this.inputElement) }

    render() {
        return <div
            ref={(el) => this.containerElement = el as HTMLElement}
            class={`field-number-container field-element-container${this.slim ? ' slim' : ''}${this.autowidth ? ' w-auto' : ''}`}
        >
            <input
                ref={(el) => this.inputElement = el as any}
                placeholder=" "
                type="number"
                autocomplete={this.autocomplete}
                autofocus={this.autofocus}
                disabled={this.disabled}
                name={this.name}
                readonly={this.readonly}
                required={this.required}
                id={this.inputid}
                max={this.max}
                min={this.min}
                form={(this.externalForm() || {}).id}
                onAnimationStart={() => this.updateLabelPosition()}
                onFocus={() => this.updateLabelPosition()}
                onBlur={() => this.updateLabelPosition()}
                onInput={() => this.handleInput()}
                onKeyDown={(e) => this.handleEnter(e)}
                value={this.value}
            />

            <label ref={(el) => this.labelElement = el as HTMLLabelElement}>{this.sanitizedLabel}</label>

            <span class="icon-container" ref={(el) => this.iconElement = el as any}><slot name="icon" /></span>

            <span class="field-input-bottom">
                <span ref={(el) => this.helpTextElement = el as HTMLElement} class="field-help-text">{this.sanitizedHelp}</span>
            </span>
        </div>
    }
}

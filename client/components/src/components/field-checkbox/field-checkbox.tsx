import { Component, Prop, h, Watch, Element, Method, State } from '@stencil/core'
import ValidateHtml from '../../../../utils/validate/html'
import ID from '../../../../utils/id'
import EventObserver from '../../../../utils/observe/event-observer'
import AttributeSetRemove from '../../../../utils/dom/attribute-set-remove'
import DispatchEvent from '../../../../utils/dom/dispatch-event'

const attachId = (id: string, input: HTMLInputElement, label: any) => {
    input.id = id
    label.setAttribute('for', id)
}

@Component({
    tag: 'field-checkbox',
    styleUrl: 'style.scss',
    shadow: true
})

export class FieldCheckbox {
    @Element() host

    /** PROPS */
    @Prop() autofocus: boolean = false

    @Prop() autowidth: boolean = false

    @Prop() disabled: boolean = false

    @Prop({ mutable: true }) error: string = ''
    @Watch('error') validError(newVal) { this.sanitizedError = this.sanitized(newVal) || '' }

    @Prop() helptext: string
    @Watch('helptext') validHelpText(newVal) { this.sanitizedHelp = this.sanitized(newVal) }

    @Prop({ reflect: true }) inputid: string = ID()
    @Watch('inputid') validId(newVal) { attachId(newVal, this.inputElement, this.labelElement) }

    @Prop() label: string = ''
    @Watch('label') validLabel(newVal) { this.sanitizedLabel = this.sanitized(newVal) }

    @Prop() mixed: boolean = false
    @Watch('mixed') validMixed(newVal) { AttributeSetRemove(this.containerElement, 'mixed', newVal) }

    @Prop() name: string

    @Prop() readonly: boolean = false

    @Prop() required: boolean = false

    @Prop() slim: boolean = false

    @Prop() value: boolean = false
    @Watch('value') validValue(newVal) { if (typeof newVal == 'undefined') { return this.value = false } }


    /** STATE */
    @State() sanitizedLabel: string = ''
    @State() sanitizedHelp: string = ''
    @State() sanitizedError: string = ''

    /** METHODS */
    @Method() getValidity() { return Promise.resolve(this.inputElement.validity) }

    @Method() getValidationMessage() { return Promise.resolve(this.inputElement.validationMessage) }


    /** ELEMENTS */
    containerElement!: HTMLElement
    inputElement!: HTMLInputElement
    labelElement!: HTMLLabelElement


    /** INTERNAL METHODS */
    externalForm() { return this.host.closest('form') }

    externalInput() { return this.host.querySelector('input') }

    focused() { return this.inputid === (document.activeElement as any).inputid }

    isvalid() { return this.inputElement.validity.valid }

    removeEvents(input) { Object.keys(input.events || {}).forEach((key) => input.events[key]()) }

    sanitized(val) { return !val ? '' : ValidateHtml(val).sanitized as string }

    setError() { this.error = this.sanitized(this.inputElement.validationMessage) }

    handleInput() {
        (this.externalInput() || {}).value = this.value = !!this.inputElement.checked
        if (!!this.error && this.isvalid()) { this.setError() }
    }

    handleEnter(e) {
        if (!e || !this.externalForm() || !e.key || e.key.toLowerCase() !== 'enter') { return }
        DispatchEvent(this.externalForm(), 'submit')
    }

    setEvents() {
        const input = this.inputElement as any

        this.removeEvents(input)

        input.events = {
            form: EventObserver(this.externalForm(), 'submit').subscribe((e) => {
                if (!this.isvalid()) {
                    e.preventDefault()
                    this.setError()
                }
            })
        }
    }

    /** LIFECYLE */
    componentWillLoad() {
        this.sanitizedLabel = this.sanitized(this.label)
        this.sanitizedHelp = this.sanitized(this.helptext)
        this.sanitizedError = this.sanitized(this.error)
    }

    componentDidLoad() {
        this.setEvents()
        attachId(this.inputid, this.inputElement, this.labelElement)
        AttributeSetRemove(this.containerElement, 'mixed', this.mixed)
    }

    disconnectedCallback() { this.removeEvents(this.inputElement) }

    render() {
        return <div
            ref={(el) => this.containerElement = el as HTMLElement}
            class={`field-checkbox-container field-element-container${this.slim ? ' slim' : ''}${this.autowidth ? ' w-auto' : ''}`}
        >
            <input
                type="checkbox"
                ref={(el) => this.inputElement = el as any}
                placeholder=" "
                checked={this.value}
                disabled={this.disabled}
                name={this.name}
                readonly={this.readonly}
                required={this.required}
                id={this.inputid}
                form={(this.externalForm() || {}).id}
                onInput={() => this.handleInput()}
                onKeyDown={(e) => this.handleEnter(e)}
            />

            <label ref={(el) => this.labelElement = el as any}>
                <span>{this.sanitizedLabel}</span>
                <span>{this.sanitizedError}</span>
            </label>

            <span class="field-help-text">{this.sanitizedHelp}</span>
        </div>
    }
}

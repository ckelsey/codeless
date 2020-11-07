import { Component, Prop, h, Watch, Element } from '@stencil/core'
import AttributeSetRemove from '../../../../utils/dom/attribute-set-remove'
import DispatchEvent from '../../../../utils/dom/dispatch-event'
import EventObserver from '../../../../utils/observe/event-observer'

@Component({
    tag: 'field-button',
    styleUrl: 'style.scss',
    shadow: true,
})
export class FieldButton {
    @Element() host

    /** PROPS */
    @Prop() type: string = ''
    @Watch('type')
    validateType(newValue: string) { if (!newValue || newValue == '' || typeof newValue != 'string' || newValue !== 'submit') { return this.type = '' } }

    @Prop() theme: string = ''
    @Watch('theme')
    validateTheme(newValue: string) { if (typeof newValue != 'string' || ['danger', 'warning', 'secondary'].indexOf(newValue) == -1) { this.theme = '' } }

    @Prop() size: string = ''
    @Watch('size')
    validateSize(newValue: string) { if (typeof newValue != 'string' || ['big', 'small'].indexOf(newValue) == -1) { this.size = '' } }

    @Prop() kind: string = ''
    @Watch('kind')
    validateKind(newValue: string) { if (typeof newValue != 'string' || ['link'].indexOf(newValue) == -1) { this.kind = '' } }

    @Prop() disabled: boolean = false
    @Prop() spinner: boolean = false


    /** INTERNAL METHODS */
    externalForm() { return this.host.closest('form') }

    triggerSubmit() {
        if (this.type !== 'submit') { return }
        const form = this.externalForm()
        if (!form) { return }
        DispatchEvent(form, 'submit')
    }

    removeEvents(container) { Object.keys(container.events || {}).forEach((key) => container.events[key]()) }

    setEvents() {
        const container = this.containerElement as any
        const slot = this.host.shadowRoot.querySelector('slot[name="icon"]')

        this.removeEvents(container)

        container.events = {
            slot: EventObserver(slot, 'slotchange').subscribe(() => {
                AttributeSetRemove(this.containerElement, 'hasicon', !!this.host.querySelector('[slot="icon"]'))
            })
        }
    }

    btn!: HTMLButtonElement
    containerElement!: HTMLElement

    componentDidLoad() { this.setEvents() }

    render() {
        return <div ref={(el) => this.containerElement = el as HTMLElement} class="field-button-container hide-until-ready">
            <button
                ref={(el) => this.btn = el as HTMLButtonElement}
                type={this.type}
                data-theme={this.theme}
                data-size={this.size}
                data-kind={this.kind}
                data-spinner={this.spinner}
                disabled={this.disabled}
                onClick={() => this.triggerSubmit()}
            >
                <span class="icon-container"><slot name="icon"></slot></span>
                <slot />
            </button>
        </div>;
    }
}

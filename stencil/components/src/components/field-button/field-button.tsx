import { Component, Prop, h, Watch, Element } from '@stencil/core'
import RenderLightDom from '../../../../utils/dom/render-light-dom'

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
    validateSize(newValue: string) { if (typeof newValue != 'string' || ['big', 'medium', 'small'].indexOf(newValue) == -1) { this.size = '' } }

    @Prop() kind: string = ''
    @Watch('kind')
    validateKind(newValue: string) { if (typeof newValue != 'string' || ['link'].indexOf(newValue) == -1) { this.kind = '' } }

    @Prop() disabled: boolean = false
    @Prop() spinner: boolean = false

    @Prop() nomargin: boolean = false
    @Watch('nomargin')


    /** INTERNAL METHODS */
    externalForm() { return this.host.closest('form') }



    triggerSubmit() {
        if (this.externalForm()) { this.formButton.click() }
    }

    btn!: HTMLButtonElement
    containerElement!: HTMLElement
    formButton!: HTMLButtonElement

    render() {
        this.formButton = RenderLightDom(
            this.host,
            'button.field-button-hidden',
            { tagName: 'button', type: this.type, disabled: this.disabled, class: 'field-button-hidden', slot: 'form-control' },
            { click: e => e.stopPropagation() }
        ) as HTMLInputElement

        return <div ref={(el) => this.containerElement = el as HTMLElement} class={`field-button-container hide-until-ready${this.nomargin ? ' nomargin' : ''}`}>
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
                <div class="form-control"><slot name="form-control"></slot></div>
            </button>
        </div>;
    }
}

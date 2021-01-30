/** TODO
 * - value tooltip
 * - forminput should be number
 * - show max label
 * - show min label
 * - steps
 * - disabled
 * - error
 * - helptext
 */

import { Component, Element, h, Prop, State, Watch } from '@stencil/core'
import FormControl from '../../../../utils/dom/form-control'
import InputName from '../../../../utils/dom/input-name'
import RenderLightDom from '../../../../utils/dom/render-light-dom'
import SetAttribute from '../../../../utils/dom/set-attribute'
import ID from '../../../../utils/id'
import Debounce from '../../../../utils/timing/debounce'
import { SantizedHTML } from '../../../../utils/validate/html'

const inputCharacterWidth = 0.62
const inputWidth = (input: HTMLInputElement) => `${!input ? inputCharacterWidth : inputCharacterWidth * input.value.length}em`

@Component({
    tag: 'field-slider',
    styleUrl: 'style.scss',
    shadow: true
})

export class FieldSlider {
    /** PROPS */
    @Prop() autowidth: boolean = false

    @Prop() disabled: boolean = false
    @Watch('disabled') disabledWatcher(newVal) { SetAttribute(this.formInput, 'disabled', newVal) }

    @Prop({ mutable: true }) error: string = ''
    @Watch('error') validError(newVal) { this.sanitizedError = SantizedHTML(newVal) || '' }

    @Prop() helptext: string
    @Watch('helptext') validHelpText(newVal) { this.sanitizedHelp = SantizedHTML(newVal) }

    @Prop({ reflect: true }) inputid: string = ID()

    @Prop() label: string = ''
    @Watch('label') validLabel(newVal) { this.sanitizedLabel = SantizedHTML(newVal) }

    @Prop() name: string = ''
    @Watch('name') nameWatcher(newVal) { this.updateName(newVal) }

    @Prop() maxvalue: number = 100
    @Watch('maxvalue') maxvalueWatcher() { this.updateValue(this.value) }

    @Prop() minvalue: number = 0
    @Watch('minvalue') minvalueWatcher() { this.updateValue(this.value) }

    @Prop() required: boolean = false
    @Watch('required') requiredWatcher(newVal) { SetAttribute(this.formInput, 'required', newVal) }

    @Prop() slim: boolean = false

    @Prop() step: number = 0.01
    @Watch('step') stepWatcher(newVal) { this.updateDecimalSpaces(newVal) }

    @Prop({ reflect: true }) theme: 'inverse' | '' = ''
    @Watch('theme') themeWatcher(newVal) { this.updateTheme(newVal) }

    @Prop() value: number = 0
    @Watch('value') valueWatcher(newVal) {
        const value = this.maxMin(this.toStep(newVal))
        if (value !== newVal) { this.value = value }
        this.updateValue(value)
    }

    @Prop() valueinlabel: boolean = true



    /** STATE */
    @State() sanitizedLabel: string = ''
    @State() sanitizedHelp: string = ''
    @State() sanitizedError: string = ''
    @State() decimalSpaces: number = 0



    /** ELEMENTS */
    @Element() host
    containerElement!: HTMLElement
    formInput!: HTMLInputElement
    slidebarOverlayElement!: HTMLElement
    handleElement!: HTMLElement
    slidebarContainerElement!: HTMLElement
    labelInput!: HTMLInputElement



    /** INTERNAL */
    externalForm() { return this.host.closest('form') }
    dragging: boolean = false
    updateTheme(theme) { this.containerElement.setAttribute('theme', theme) }
    updateName(name) { SetAttribute(this.formInput, 'name', InputName(name, this.sanitizedLabel, this.inputid)) }
    updateDecimalSpaces(step) { this.decimalSpaces = (step.toString().split('.')[1] || '').length }
    maxMin(value) { return Math.min(this.maxvalue, Math.max(this.minvalue, value)) }
    toStep(value) { return parseFloat((Math.round(value / this.step) * this.step).toFixed(this.decimalSpaces)) }
    valueDebouncer = Debounce((value) => this.value = value, 0) as any

    updateValue(value) {
        const percent = `${Math.min(100, Math.max(0, ((value - this.minvalue) / (this.maxvalue - this.minvalue)) * 100))}%`

        if (this.handleElement) { this.handleElement.style.left = percent }
        if (this.slidebarOverlayElement) { this.slidebarOverlayElement.style.width = percent }
        if (this.labelInput) {
            this.labelInput.value = value.toString()
        }
    }

    handleDrag(e) {
        const sliderBox = this.slidebarContainerElement.getBoundingClientRect()
        const position = parseInt(Math.max(0, Math.min(100, ((e.x - sliderBox.left) / sliderBox.width) * 100)) + '')
        const toValue = Math.min(this.maxvalue, Math.max(this.minvalue, ((position / 100) * (this.maxvalue - this.minvalue)) + this.minvalue))
        this.value = this.toStep(Math.round(toValue / this.step) * this.step)
    }

    startDrag() {
        this.dragging = true
        window.addEventListener('mousemove', this.handleDrag)
        window.addEventListener('mouseup', this.stopDrag)
        document.body.style.userSelect = 'none'
        this.containerElement.setAttribute('dragging', 'true')
    }

    stopDrag() {
        this.dragging = false
        window.removeEventListener('mousemove', this.handleDrag)
        window.removeEventListener('mouseup', this.stopDrag)
        document.body.style.removeProperty('user-select')
        this.containerElement.setAttribute('dragging', 'false')
    }




    /** LIFECYCLE */
    componentWillLoad() {
        this.sanitizedLabel = SantizedHTML(this.label)
        this.sanitizedHelp = SantizedHTML(this.helptext)
        this.sanitizedError = SantizedHTML(this.error)
        this.value = this.maxMin(this.toStep(this.value))
        this.updateDecimalSpaces(this.step)
    }

    componentDidLoad() {
        SetAttribute(this.containerElement, 'has-label', (!!this.sanitizedLabel).toString())
        FormControl.apply(this, [this.inputid, this.formInput, this.externalForm()])
        this.updateName(this.name)
        this.updateTheme(this.theme)
        this.handleDrag = this.handleDrag.bind(this)
        this.stopDrag = this.stopDrag.bind(this)
        this.updateValue(this.value)

        if (this.labelInput) {
            this.labelInput.style.width = inputWidth(this.labelInput)
        }
    }


    render() {
        this.formInput = RenderLightDom(this.host, 'input.field-slider-hidden-input', {
            tagName: 'input',
            type: 'text',
            value: this.value,
            name: this.name,
            required: this.required,
            disabled: this.disabled,
            class: 'field-slider-hidden-input',
            slot: 'form-control'
        }) as HTMLInputElement

        return <div
            ref={(el) => this.containerElement = el as HTMLElement}
            class={`field-slider-container field-element-container${this.slim ? ' slim' : ''}${this.autowidth ? ' w-auto' : ''}${this.required ? ' required' : ''}${this.dragging ? ' dragging' : ''}`}
        >
            <div class="field-slider-main-label-container">
                <div class="field-slider-main-label-right">
                    <span class="icon-container"><slot name="icon" /></span>
                    <label>
                        <span>{this.sanitizedLabel}</span>
                        {this.valueinlabel ?
                            <span class="field-slider-label-value-container">
                                <input
                                    type="number"
                                    step={this.step}
                                    min={this.minvalue}
                                    max={this.maxvalue}
                                    class="field-slider-label-value"
                                    onInput={e => this.valueDebouncer(parseFloat((e.target as HTMLInputElement).value))}
                                    ref={el => this.labelInput = el}
                                    style={{ width: inputWidth(this.labelInput) }}
                                />
                            </span> : ''
                        }
                        <span class="field-slider-error-text">{this.sanitizedError}</span>
                    </label>
                </div>
                <span class="field-help-text">{this.sanitizedHelp}</span>
            </div>

            <div class="field-slider-labels-slider">
                <div class="min-label">{this.minvalue}</div>
                <div
                    class="field-slider-slider-outer-container"
                    onMouseDown={() => this.startDrag()}
                    ref={el => this.slidebarContainerElement = el}
                >
                    <div class="field-slider-slider-container">
                        <div class="field-slider-slider"></div>
                        <div
                            class="field-slider-slider-overlay"
                            ref={el => this.slidebarOverlayElement = el}
                        ></div>
                        <div
                            class="field-slider-slider-handle"
                            ref={el => this.handleElement = el}
                            data-value={this.value}
                        >
                            <div class="field-slider-slider-handle-inner"></div>
                        </div>
                    </div>
                </div>
                <div class="max-label">{this.maxvalue}</div>
            </div>
            <div class="form-control"><slot name="form-control"></slot></div>
        </div>
    }
}
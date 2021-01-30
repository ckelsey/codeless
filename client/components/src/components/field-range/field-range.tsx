import { Component, Element, h, Method, Prop, State, Watch } from '@stencil/core'
import IfInvalid from '../../../../utils/checks/if-invalid'
import CommasToArray from '../../../../utils/conversion/commas-to-array'
import FormControl from '../../../../utils/dom/form-control'
import InputName from '../../../../utils/dom/input-name'
import RenderLightDom from '../../../../utils/dom/render-light-dom'
import SetAttribute from '../../../../utils/dom/set-attribute'
import Pipe from '../../../../utils/function-helpers/pipe'
import ID from '../../../../utils/id'
import ToNumber from '../../../../utils/conversion/to-number'
import Debounce from '../../../../utils/timing/debounce'
import { SantizedHTML } from '../../../../utils/validate/html'
import ToArray from '../../../../utils/conversion/to-array'
import Equals from '../../../../utils/checks/equals'


const inputCharacterWidth = 0.62

const inputWidth = (input: HTMLInputElement) => `${!input ? inputCharacterWidth : inputCharacterWidth * input.value.length}em`

const ifInvalid = (max: number, min: number) => IfInvalid([max, min])

const arrayLength = (values: any[]) => (!values || values.length == 0 ? [0, 0] : values.length == 1 ? values.concat(values) : values).slice(0, 2)

const toStep = (step: number, decimalSpaces: number) => value => parseFloat((Math.round(value / step) * step).toFixed(decimalSpaces))

const numberMaxMin = (max: number, min: number, step: number, decimalSpaces: number) => (value) =>
    Math.min(max,
        Math.max(min,
            Pipe(ToNumber, IfInvalid(min), toStep(step, decimalSpaces))(value)
        )
    )

const mapNumberMaxMin = (max: number, min: number, step: number, decimalSpaces: number) => (values: any[]) => {
    const val0 = numberMaxMin(max - step, min, step, decimalSpaces)(values[0])
    const val1 = numberMaxMin(max, min + step, step, decimalSpaces)(values[1])
    const result = []

    result.push(Math.min(Math.max(val0, min), val1 - step))
    result.push(Math.min(Math.max(val1, result[0] + step), max))

    return result
}

const conversionFlow = (max: number, min: number, step: number, decimalSpaces: number) => [ifInvalid(max, min), arrayLength, mapNumberMaxMin(max, min, step, decimalSpaces)]

const stringToArray = (value: string, max: number, min: number, step: number, decimalSpaces: number) => Pipe(CommasToArray, ...conversionFlow(max, min, step, decimalSpaces))(value)

const arrayToString = (value: string, max: number, min: number, step: number, decimalSpaces: number) => Pipe(ToArray, ...conversionFlow(max, min, step, decimalSpaces), (values) => values.join(','))(value)

const percentToValue = (percent: number, max: number, min: number) => Math.min(max, Math.max(min, ((percent / 100) * (max - min)) + min))

const percent = (sliderBox: ClientRect, x: number) => parseFloat(Math.max(0, Math.min(100, ((x - sliderBox.left) / sliderBox.width) * 100)) + '')

const getPercent = (el: HTMLElement, x: number) => percent(el.getBoundingClientRect(), x)

@Component({
    tag: 'field-range',
    styleUrl: 'style.scss',
    shadow: true
})

export class FieldRange {
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
    @Watch('maxvalue') maxvalueWatcher() { this.externalToInternal(this.value) }

    @Prop() minvalue: number = 0
    @Watch('minvalue') minvalueWatcher() { this.externalToInternal(this.value) }

    @Prop() required: boolean = false
    @Watch('required') requiredWatcher(newVal) { SetAttribute(this.formInput, 'required', newVal) }

    @Prop() slim: boolean = false

    @Prop() step: number = 0.01
    @Watch('step') stepWatcher(newVal) { this.updateDecimalSpaces(newVal) }

    @Prop({ reflect: true }) theme: 'inverse' | '' = ''
    @Watch('theme') themeWatcher(newVal) { this.updateTheme(newVal) }

    @Prop() value: string
    @Watch('value') valueWatcher(newVal) { this.externalToInternal(newVal) }

    @Prop() valueinlabel: boolean = true



    /** STATE */
    @State() sanitizedLabel: string = ''
    @State() sanitizedHelp: string = ''
    @State() sanitizedError: string = ''
    @State() decimalSpaces: number = 0
    @State() internalValue: [number, number]
    @Watch('internalValue') internalValueWatcher(newVal) { this.internalToExternal(newVal) }



    /** ELEMENTS */
    @Element() host
    containerElement!: HTMLElement
    formInput!: HTMLInputElement
    slidebarOverlayElement!: HTMLElement
    handleLeftElement!: HTMLElement
    handleRightElement!: HTMLElement
    slidebarContainerElement!: HTMLElement
    labelInputLeft!: HTMLInputElement
    labelInputRight!: HTMLInputElement


    @Method() getInternal() {
        return Promise.resolve(this.internalValue)
    }



    /** INTERNAL */
    dragging: boolean = false

    externalForm() { return this.host.closest('form') }
    updateTheme(theme) { this.containerElement.setAttribute('theme', theme) }
    updateName(name) { SetAttribute(this.formInput, 'name', InputName(name, this.sanitizedLabel, this.inputid)) }

    updateDecimalSpaces(step) {
        this.decimalSpaces = (step.toString().split('.')[1] || '').length
        this.externalToInternal(this.value)
    }

    externalToInternal(value) {
        const newInternal = stringToArray(value, this.maxvalue, this.minvalue, this.step, this.decimalSpaces)

        this.updateDom(newInternal)

        if (Equals(newInternal, this.internalValue)) { return }

        this.internalValue = newInternal
    }

    internalToExternal(value) {
        const newValue = arrayToString(value, this.maxvalue, this.minvalue, this.step, this.decimalSpaces)

        if (Equals(newValue, this.value)) { return }

        this.value = newValue
    }

    valueDebouncer = Debounce((value, index) => this.internalValue = index === 0 ?
        [value, this.internalValue[1]] :
        [this.internalValue[0], value],
        0
    ) as any

    updateDom(internalValue) {
        const percents = internalValue.map((val: number) => Math.min(100, Math.max(0, ((val - this.minvalue) / (this.maxvalue - this.minvalue)) * 100)))

        if (this.handleLeftElement) { this.handleLeftElement.style.left = `${percents[0]}%` }
        if (this.handleRightElement) { this.handleRightElement.style.left = `${percents[1]}%` }
        if (this.labelInputLeft) { this.labelInputLeft.value = internalValue[0] }
        if (this.labelInputRight) { this.labelInputRight.value = internalValue[1] }

        if (this.slidebarOverlayElement) {
            this.slidebarOverlayElement.style.width = `${Math.abs(percents[1] - percents[0])}%`
            this.slidebarOverlayElement.style.left = `${Math.min(percents[1], percents[0])}%`
        }
    }

    leftDrag(e) {
        this.internalValue = [
            numberMaxMin(
                this.internalValue[1] - this.step,
                this.minvalue,
                this.step,
                this.decimalSpaces)(
                    percentToValue(
                        getPercent(this.slidebarContainerElement, e.x),
                        this.maxvalue,
                        this.minvalue
                    )
                ),
            this.internalValue[1]
        ]
    }

    rightDrag(e) {
        this.internalValue = [
            this.internalValue[0],
            numberMaxMin(
                this.maxvalue,
                this.internalValue[0] + this.step,
                this.step,
                this.decimalSpaces)(
                    percentToValue(
                        getPercent(this.slidebarContainerElement, e.x),
                        this.maxvalue,
                        this.minvalue
                    )
                )
        ]
    }

    commonDragEvents() {
        this.dragging = true
        window.addEventListener('mouseup', this.stopDrag)
        document.body.style.userSelect = 'none'
        this.containerElement.setAttribute('dragging', 'true')
    }

    startLeftDrag() {
        window.addEventListener('mousemove', this.leftDrag)
        this.commonDragEvents()
    }

    startRightDrag() {
        window.addEventListener('mousemove', this.rightDrag)
        this.commonDragEvents()
    }

    stopDrag() {
        this.dragging = false
        window.removeEventListener('mousemove', this.leftDrag)
        window.removeEventListener('mousemove', this.rightDrag)
        window.removeEventListener('mouseup', this.stopDrag)
        document.body.style.removeProperty('user-select')
        this.containerElement.setAttribute('dragging', 'false')
    }




    /** LIFECYCLE */
    componentWillLoad() {
        this.sanitizedLabel = SantizedHTML(this.label)
        this.sanitizedHelp = SantizedHTML(this.helptext)
        this.sanitizedError = SantizedHTML(this.error)
        this.updateDecimalSpaces(this.step)
    }

    componentDidLoad() {
        SetAttribute(this.containerElement, 'has-label', (!!this.sanitizedLabel).toString())
        FormControl.apply(this, [this.inputid, this.formInput, this.externalForm()])
        this.updateName(this.name)
        this.updateTheme(this.theme)
        this.leftDrag = this.leftDrag.bind(this)
        this.rightDrag = this.rightDrag.bind(this)
        this.stopDrag = this.stopDrag.bind(this)
        this.externalToInternal(this.value)

        if (this.labelInputLeft) { this.labelInputLeft.style.width = inputWidth(this.labelInputLeft) }

        if (this.labelInputRight) { this.labelInputRight.style.width = inputWidth(this.labelInputRight) }
    }


    render() {
        this.formInput = RenderLightDom(this.host, 'input.field-range-hidden-input', {
            tagName: 'input',
            type: 'text',
            value: this.value,
            name: this.name,
            required: this.required,
            disabled: this.disabled,
            class: 'field-range-hidden-input',
            slot: 'form-control'
        }) as HTMLInputElement

        return <div
            ref={(el) => this.containerElement = el as HTMLElement}
            class={`field-range-container field-element-container${this.slim ? ' slim' : ''}${this.autowidth ? ' w-auto' : ''}${this.required ? ' required' : ''}${this.dragging ? ' dragging' : ''}`}
        >
            <div class="field-range-main-label-container">
                <div class="field-range-main-label-right">
                    <span class="icon-container"><slot name="icon" /></span>
                    <label>
                        <span>{this.sanitizedLabel}</span>
                        {this.valueinlabel ?
                            <span class="field-range-label-value-container">
                                <input
                                    type="number"
                                    step={this.step}
                                    min={this.minvalue}
                                    max={this.maxvalue}
                                    value={this.internalValue[0]}
                                    class="field-range-label-value"
                                    onInput={e => this.valueDebouncer(parseFloat((e.target as HTMLInputElement).value), 0)}
                                    ref={el => this.labelInputLeft = el}
                                    style={{ width: inputWidth(this.labelInputLeft) }}
                                />
                                <icon-element kind="arrow-left-right" class="field-range-label-value-icon"></icon-element>
                                <input
                                    type="number"
                                    step={this.step}
                                    min={this.minvalue}
                                    max={this.maxvalue}
                                    value={this.internalValue[1]}
                                    class="field-range-label-value"
                                    onInput={e => this.valueDebouncer(parseFloat((e.target as HTMLInputElement).value), 1)}
                                    ref={el => this.labelInputRight = el}
                                    style={{ width: inputWidth(this.labelInputRight) }}
                                />
                            </span> : ''
                        }
                        <span class="field-range-error-text">{this.sanitizedError}</span>
                    </label>
                </div>
                <span class="field-help-text">{this.sanitizedHelp}</span>
            </div>

            <div class="field-range-labels-slider">
                <div class="min-label">{this.minvalue}</div>
                <div
                    class="field-range-slider-outer-container"
                    ref={el => this.slidebarContainerElement = el}
                >
                    <div class="field-range-slider-container">
                        <div class="field-range-slider"></div>
                        <div
                            class="field-range-slider-handle"
                            ref={el => this.handleLeftElement = el}
                            data-value={this.internalValue[0]}
                            onMouseDown={() => this.startLeftDrag()}
                        >
                            <div class="field-range-slider-handle-inner"></div>
                        </div>
                        <div
                            class="field-range-slider-overlay"
                            ref={el => this.slidebarOverlayElement = el}
                        ></div>
                        <div
                            class="field-range-slider-handle"
                            ref={el => this.handleRightElement = el}
                            data-value={this.internalValue[1]}
                            onMouseDown={() => this.startRightDrag()}
                        >
                            <div class="field-range-slider-handle-inner"></div>
                        </div>
                    </div>
                </div>
                <div class="max-label">{this.maxvalue}</div>
            </div>
            <div class="form-control"><slot name="form-control"></slot></div>
        </div>
    }
}
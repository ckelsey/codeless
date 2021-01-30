/** TODO 
 * show warning if invalid value, i.e. via max/min
 * If there's any better way at all to handle the input cycle (internal->external->inputs->internal->external->inputs)
 */
import { Component, Prop, h, Watch, Element, Method, State, Event } from '@stencil/core'
import { SantizedHTML } from '../../../../utils/validate/html'
import ID from '../../../../utils/id'
import AttributeSetRemove from '../../../../utils/dom/attribute-set-remove'
import DispatchEvent from '../../../../utils/dom/dispatch-event'
import GetEventTarget from '../../../../utils/dom/get-event-target'
import Get from '../../../../utils/objects/get'
import Debounce from '../../../../utils/timing/debounce'
import RenderLightDom from '../../../../utils/dom/render-light-dom'
import InputName from '../../../../utils/dom/input-name'
import FormControl from '../../../../utils/dom/form-control'
import SetAttribute from '../../../../utils/dom/set-attribute'

/** TYPINGS */
export type InternalValue = [string, string, string, string]

interface EvaluatedTime {
    evaluatedSeconds: number
    over: boolean
    under: boolean
    string: string
    array: InternalValue
    maxString: string
    maxArray: InternalValue
    minString: string
    minArray: InternalValue
}


/** DEFINITIONS */
const inputKeys = ['hour', 'minute', 'second']
const defaultArray: InternalValue = ['', '', '', 'am']
const defaultString = '::'
const defaultMax = '23:59:59'
const defaultMin = '0:00:00'



@Component({
    tag: 'field-time',
    styleUrl: 'style.scss',
    shadow: true
})

export class FieldTime {
    @Element() host


    /** PROPS */
    @Prop() autowidth: boolean = false

    @Prop() disabled: boolean = false
    @Watch('disabled') disabledWatcher(newVal) { if (this.formInput) { this.formInput.disabled = newVal } }

    @Prop({ mutable: true }) error: string = ''
    @Watch('error') validError(newVal) { AttributeSetRemove(this.labelElement, 'error', SantizedHTML(newVal)) }

    @Prop() helptext: string
    @Watch('helptext') validHelpText(newVal) { this.sanitizedHelp = SantizedHTML(newVal) }

    @Prop({ reflect: true }) inputid: string = ID()

    @Prop() label: string = ''
    @Watch('label') validLabel(newVal) { this.sanitizedLabel = SantizedHTML(newVal) }

    @Prop() labelup: boolean = false
    @Watch('labelup') validLabelUp() { this.setLabelPosition() }

    @Prop() max: string
    @Watch('max') validMax() { this.valueDebouncer() }

    @Prop() min: string
    @Watch('max') validMin() { this.valueDebouncer() }

    @Prop() name: string
    @Watch('name') nameWatcher(newVal) {
        this.name = InputName(newVal, this.sanitizedLabel, this.inputid)
        SetAttribute(this.formInput, 'name', this.name)
    }

    @Prop() required: boolean = false
    @Watch('required') requiredWatcher(newVal) { SetAttribute(this.formInput, 'required', newVal) }

    @Prop() showseconds: boolean = false
    @Watch('showseconds') validSHowSeconds() { this.handleValueUpdate(2, '00') }

    @Prop() slim: boolean = false

    @Prop({ reflect: true }) theme: 'inverse' | '' = ''
    @Watch('theme') themeWatcher(newVal) { this.updateTheme(newVal) }

    @Prop() value: string = ''
    @Watch('value') validValue() { this.valueDebouncer() }



    /** STATE */
    @State() sanitizedHelp: string = ''
    @State() sanitizedLabel: string = ''
    @Watch('sanitizedLabel') validSanitizedLabel(newVal) {
        SetAttribute(this.containerElement, 'has-label', (!!newVal).toString())
        this.name = InputName(this.name, newVal, this.inputid)
    }

    @State() internalValue: InternalValue = defaultArray.slice() as InternalValue
    @Watch('internalValue') validInternalValue() { this.internalValueDebouncer() }



    /** METHODS */
    @Method() getValidity() { return Promise.resolve(this.formInput.validity) }

    @Method() getValidationMessage() { return Promise.resolve(this.formInput.validationMessage) }

    @Method() getInternal() { return Promise.resolve(this.internalValue) }


    /** EVENTS */
    @Event() valuechange
    @Event() timechange


    /** ELEMENTS */
    containerElement!: HTMLElement
    labelElement!: HTMLLabelElement
    hourInputElement!: HTMLInputElement
    minuteInputElement!: HTMLInputElement
    secondInputElement!: HTMLInputElement
    meridienElement!: HTMLFieldSelectElement
    formInput!: HTMLInputElement



    /** INTERNAL METHODS */
    changeEventDebouncer = Debounce(() => {
        this.valuechange.emit(this.value)
        this.timechange.emit(this.value)
    })

    valueDebouncer = Debounce(() => this.externalToInternal(), 0)

    internalValueDebouncer = Debounce(() => this.internalToExternal(), 0)

    externalForm() { return this.host.closest('form') }

    focused() { return this.inputid === (document.activeElement as any).inputid || this.getInputs().indexOf(this.host.shadowRoot.activeElement) > -1 }

    isempty() { return isEmpty(this.value) }

    isvalid() { return this.formInput.validity.valid }

    getInputs() { return [this.hourInputElement, this.minuteInputElement, this.secondInputElement, this.meridienElement] }

    setInputValues(vals = []) {
        if (!this.meridienElement) { return }

        const inputs = this.getInputs()

        if (!inputs[0]) { return }

        vals.forEach((v, i) => inputs[i] && inputs[i].value !== v ? inputs[i].value = v : undefined)
    }

    externalToInternal() {
        const newVal = externalToInternalValue(this.value, this.max, this.min)
        this.internalValue = newVal.array
        this.value = newVal.string
        this.setInputValues(newVal.array)
        this.setLabelPosition()
    }

    internalToExternal() {
        const newVal = internalToExternal(this.internalValue, this.max, this.min)
        this.value = newVal.string
        this.internalValue = newVal.array
        this.setInputValues(newVal.array)
        this.setLabelPosition()

        if (!!this.value && !!this.error) {
            this.error = this.formInput.validationMessage
        }

        this.changeEventDebouncer()
    }

    handleValueUpdate(index, value) {
        if (value === undefined) { return }

        const proxy: any = this.getInputs().map(v => v.value)
        proxy[index] = index < 3 ? value.replace(/[^0-9.]/g, '') : value

        this.internalValue = proxy
        this.setInputValues(proxy)
    }

    handleKeyDown(event) {
        const key = keyboardEventKey(event)
        const target = GetEventTarget(event) as HTMLInputElement
        const isUpArrow = key == 'arrowup'

        if (tag(target) == 'input' && (isUpArrow || key == 'arrowdown')) {
            event.preventDefault()

            const isHour = target.getAttribute('data-key') === 'hour'
            const val = parseInt(target.value, 10)

            let newVal = (isNaN(val) ? 0 : val) + (isUpArrow ? 1 : -1)

            if (isHour) {
                if (newVal < 1) { newVal = 12 }
                if (newVal > 12) { newVal = 1 }
            }

            if (!isHour) {
                if (newVal < 0) { newVal = 59 }
                if (newVal > 59) { newVal = 0 }
            }

            target.value = isHour ? newVal.toString() : addLeadingZeros(newVal)
        }

        if (isSubmitting(key, this.externalForm())) {
            DispatchEvent(this.externalForm(), 'submit')
        }
    }

    stripNonNumeric(event) {
        const target = GetEventTarget(event) as HTMLInputElement
        if (tag(target) == 'input' && target.value) { target.value = target.value.replace(/[^0-9.]/g, '') }
    }

    setLabelPosition() {
        const focused = this.focused()
        const empty = this.isempty()
        const forcedUp = this.labelup
        SetAttribute(
            SetAttribute(this.host, 'empty', empty),
            'focused', focused
        )

        SetAttribute(
            SetAttribute(this.containerElement, 'focused', focused.toString()),
            'label-up', focused || !empty || forcedUp ? 'true' : 'false'
        )

    }

    updateTheme(theme) { this.containerElement.setAttribute('theme', theme) }



    /** LIFECYLE */
    componentWillLoad() {
        this.sanitizedLabel = SantizedHTML(this.label)
        this.sanitizedHelp = SantizedHTML(this.helptext)
        this.externalToInternal()
    }

    componentDidLoad() {
        this.setLabelPosition()
        SetAttribute(this.containerElement, 'has-label', (!!this.sanitizedLabel).toString())
        FormControl.apply(this, [this.inputid, this.formInput, this.externalForm()])
        this.updateTheme(this.theme)
    }

    render() {
        this.formInput = RenderLightDom(this.host, 'input.field-time-hidden-input', {
            tagName: 'input',
            type: 'text',
            value: this.value,
            name: this.name,
            required: this.required,
            disabled: this.disabled,
            class: 'field-time-hidden-input',
            slot: 'form-control'
        }) as HTMLInputElement

        return <div
            ref={(el) => this.containerElement = el as HTMLElement}
            class={`field-time-container field-element-container${this.slim ? ' slim' : ''}${this.autowidth ? ' w-auto' : ''}`}
            onClick={() => this.focused() ? undefined : this.hourInputElement.focus()}
        >
            <div class={`field-time-contents${this.showseconds ? '' : ' hide-seconds'}${isEmpty(this.internalValue[0]) ? ' hide-meridien' : ''}`}>
                <span class="icon-container"><slot name="icon" /></span>
                <div class="field-input-label">
                    <div class="field-time-inputs">
                        {inputKeys.map((key, index) =>
                            <div class={`field-time-${key}-container field-time-input-container`}>
                                <input
                                    type="text"
                                    placeholder={`${key[0]}${key[0]}`}
                                    class={`field-time-${key}-input`}
                                    ref={(el) => this[`${key}InputElement`] = el as HTMLInputElement}
                                    onFocus={() => this.setLabelPosition()}
                                    onBlur={() => this.handleValueUpdate(index, this[`${key}InputElement`].value)}
                                    onInput={(e) => this.stripNonNumeric(e)}
                                    onKeyDown={(e) => this.handleKeyDown(e)}
                                    data-key={key}
                                    maxlength="2"
                                    pattern="\d*"
                                />
                            </div>
                        )}
                        <div class="field-time-meridien-container field-time-input-container">
                            <field-select
                                ref={(el) => this.meridienElement = el as HTMLFieldSelectElement}
                                options={[{ value: "am", textContent: "AM" }, { value: "pm", textContent: "PM" }]}
                                slim={true}
                                autowidth={true}
                                label=" "
                                labelup={true}
                                data-key={'meridien'}
                                onFocus={() => this.setLabelPosition()}
                                onInput={() => this.handleValueUpdate(3, this.meridienElement.value)}
                                onKeyDown={(e) => this.handleKeyDown(e)}
                                theme={this.theme}
                            ></field-select>
                        </div>
                    </div>
                    <label class={`field-time-label${this.required ? ' label-required' : ''}`} ref={(el) => this.labelElement = el as HTMLLabelElement}>{this.sanitizedLabel} </label>
                </div>
            </div>
            <div class="field-input-bottom">
                <span class="field-help-text">{this.sanitizedHelp}</span>
            </div>
            <div class="form-control"><slot name="form-control"></slot></div>
        </div>
    }
}



/** HELPERS */
const isEmpty = value => value === '' || value === undefined

const isSubmitting = (key, form) => !!form && key == 'enter'

const keyboardEventKey = event => Get(event, 'key.toLowerCase()')

const tag = (target) => Get(target, 'tagName.toLowerCase()')

const getLeadingZeros = (num: number) => isNaN(num) ? '' : `00${num}`.slice(-2)

const addLeadingZeros = (val: number | string) => getLeadingZeros(Number(val as string))

const internalToExternal = (
    value: InternalValue = defaultArray.slice() as InternalValue,
    max: string = defaultMax,
    min: string = defaultMin
): EvaluatedTime => evaluateSeconds(value, max, min)

const externalToInternalValue = (
    value: string = defaultString,
    max: string = defaultMax,
    min: string = defaultMin
): EvaluatedTime => evaluateSeconds(value, max, min)

const stringToNumber = (v: string | number) => typeof v === 'string' ? parseInt(v) : v

const isPM = (v: string | number) => stringToNumber(v) > 11

const hour12MaxMin = (v: string | number) => Math.min(12, Math.max(0, stringToNumber(v)))

const validMinuteSecond = (v: string | number) => isEmpty(v) ? '' : addLeadingZeros(Math.min(59, Math.max(0, stringToNumber(v))))

const numberOrZero = (number: any): number => isNaN(number) ? 0 : number

const timeStringToSeconds = (timeString: string) => isEmpty(timeString) ? 0 : timeArrayToSeconds(timeStringToArray(timeString))

const hour24To12 = (v: string | number) => {
    const number = stringToNumber(v)
    const adjusted = hour12MaxMin(isPM(number) && number !== 12 ? number - 12 : number)
    return adjusted === 0 || adjusted === 24 ? 12 : adjusted
}

const hour12To24 = (v: string | number, ampm = 'am') => {
    let val = numberOrZero(stringToNumber(v))
    if (ampm === 'am' && (val === 12 || val === 24)) { val = 0 }
    if (ampm === 'pm' && val !== 12) { val = val + 12 }
    return val < 0 || val > 23 ?
        0 :
        val

}

const timeStringToArray = (value: string = '') => {
    const array = value
        .split(':')
        .concat(defaultArray.slice())
        .slice(0, 4)

    array[3] = isPM(array[0]) ? 'pm' : 'am'
    array[0] = isEmpty(array[0]) ? '' : hour24To12(array[0]).toString()
    array[1] = validMinuteSecond(array[1])
    array[2] = validMinuteSecond(array[2])

    return array as InternalValue
}

const timeArrayToSeconds = (timeArray: InternalValue) => timeArray
    .concat(defaultArray.slice())
    .slice(0, 4) // still need ampm for hour
    .reduce((target, current, index, array) => {
        if (isEmpty(current) || index > 2) { return target }
        if (index === 0) { return target + (hour12To24(current, array[3]) * 3600) }
        if (index === 1) { return target + (numberOrZero(parseInt(current)) * 60) }
        if (index === 2) { return target + numberOrZero(parseInt(current)) }
    }, 0)

const timeArrayToString = array => (array || [])
    .reduce((target, current, index, arr) => {
        if (index === 0) {
            const isAM = isEmpty(arr[3]) || arr[3] === 'am'

            if (isEmpty(current)) { return target }

            let val = stringToNumber(current)

            if (val === 12) {
                if (isAM) { return '0' }
                return current
            }

            if (isAM) {
                return current
            }

            if (!isAM) {
                return (val + 12).toString()
            }

            return current
        }
        return index === 3 ? target : `${target}:${validMinuteSecond(current)}`
    }, '')

const removeExtraColons = (value: string) => {
    while (value[value.length - 1] === ':') { value = value.slice(0, -1) }
    return value
}

function evaluateSeconds(
    value: string | InternalValue,
    max: string = defaultMax,
    min: string = defaultMin
): EvaluatedTime {
    const isArray = Array.isArray(value)

    // Intervine for a minute and adjust if value is string and hour is or above 24
    if (!isArray) {
        const temp: any[] = (value as string || '').split(':')
        const tempHour = parseInt(temp[0])

        if (!isNaN(tempHour) && tempHour > 23) {
            temp[0] = tempHour % 24
            value = temp.join(':')
        }
    }

    const valueSeconds = isArray ? timeArrayToSeconds(value as InternalValue) : timeStringToSeconds(value as string)
    const maxSeconds = timeStringToSeconds(max)
    const minSeconds = timeStringToSeconds(min)
    const maxArray = timeStringToArray(max)
    const minArray = timeStringToArray(min)

    const results = {
        evaluatedSeconds: Math.min(maxSeconds, Math.max(minSeconds, valueSeconds)),
        maxArray,
        maxString: removeExtraColons(timeArrayToString(maxArray)),
        minArray,
        minString: removeExtraColons(timeArrayToString(minArray))
    }

    if (valueSeconds === results.evaluatedSeconds) {
        return {
            over: false,
            under: false,
            string: isArray ? removeExtraColons(timeArrayToString(value)) : value as string,
            array: isArray ? value as InternalValue : timeStringToArray(value as string),
            ...results
        }
    }

    if (maxSeconds === results.evaluatedSeconds) {
        return {
            over: true,
            under: false,
            string: results.maxString,
            array: maxArray,
            ...results
        }
    }

    if (minSeconds === results.evaluatedSeconds) {
        return {
            over: false,
            under: true,
            string: results.minString,
            array: minArray,
            ...results
        }
    }
}
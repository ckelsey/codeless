import { Component, Prop, h, Watch, Element, Method, State } from '@stencil/core'
import ValidateHtml from '../../../../utils/validate/html'
import ID from '../../../../utils/id'
import EventObserver from '../../../../utils/observe/event-observer'
import AttributeSetRemove from '../../../../utils/dom/attribute-set-remove'
import DispatchEvent from '../../../../utils/dom/dispatch-event'
import GetEventTarget from '../../../../utils/dom/get-event-target'
import Get from '../../../../utils/objects/get'
import Equals from '../../../../utils/checks/equals'

const labelAlignments = ['inside', 'top']

const inputKeys = ['hour', 'minute', 'second']

const isEmpty = value => value === '' || value === undefined

const isSubmitting = (key, form) => !!form && key == 'enter'

const keyboardEventKey = event => Get(event, 'key.toLowerCase()')

const getLeadingZeros = (num: number) => isNaN(num) ? '' : `00${num}`.slice(-2)

const addLeadingZeros = (val: number | string) => getLeadingZeros(Number(val as string))

const tag = (target) => Get(target, 'tagName.toLowerCase()')

const shouldAddZeros = (value, index) => !isEmpty(value) && index !== 0 && index !== 3

function internalToExternalValue(value: [string, string, string, string] = ['', '', '', '']) {
    console.log('internalToExternalValue', value)
    const proxy = value.slice().map((v) => isEmpty(v) ? '' : v)
    const meridien = proxy[3]
    const hour = parseInt(proxy[0])

    if (meridien === 'pm' && !isNaN(hour)) {
        proxy[0] = (hour + 12).toString()
    }

    proxy[1] = isEmpty(proxy[1]) ? '' : addLeadingZeros(proxy[1])
    proxy[2] = isEmpty(proxy[2]) ? '' : addLeadingZeros(proxy[2])


    let newExternal = `${proxy[0]}:${proxy[1]}:${proxy[2]}`

    while (newExternal[newExternal.length - 1] === ':') {
        newExternal = newExternal.slice(0, newExternal.length - 1)
    }

    return newExternal
}

function externalToInternalValue(value = '::') {
    console.log('externalToInternalValue', value)
    const parts: any[] = value.split(':').map(v => isEmpty(v) ? '' : Number(v))
    let len = parts.length

    while (len < 3) {
        parts.push('')
        len = parts.length
    }

    if (!isEmpty(parts[0])) {
        const isPm = parts[0] > 11
        parts[3] = isPm ? 'pm' : 'am'
        parts[0] = isPm ? parts[0] - 12 : parts[0]
    }

    return parts.map((v, i) => shouldAddZeros(v, i) ? addLeadingZeros(v) : v.toString())
}

function removeEvents(elements) { elements.forEach(el => Object.keys(el.events || {}).forEach((key) => el.events[key]())) }

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

    @Prop({ mutable: true }) error: string = ''
    @Watch('error') validError(newVal) { AttributeSetRemove(this.labelElement, 'error', this.sanitized(newVal)) }

    @Prop() helptext: string
    @Watch('helptext') validHelpText(newVal) { this.sanitizedHelp = this.sanitized(newVal) }

    @Prop({ reflect: true }) inputid: string = ID()

    @Prop() label: string = ''
    @Watch('label') validLabel(newVal) { this.sanitizedLabel = this.sanitized(newVal) }

    @Prop() labelalign: string = 'inside'
    @Watch('labelalign') validLabelAlign(newVal) { this.setLabelAlign(newVal) }

    @Prop() max: string
    // @Watch('max') validMax() { this.setValues(this.value) }

    @Prop() min: string
    // @Watch('max') validMin() { this.setValues(this.value) }

    @Prop() name: string

    @Prop() readonly: boolean = false

    @Prop() required: boolean = false

    @Prop() showseconds: boolean = false
    @Watch('showseconds') validSHowSeconds() { this.second('00') }

    @Prop() slim: boolean = false

    @Prop() value: string = ''
    @Watch('value') validValue(newVal) { this.externalToInternal(newVal) }


    /** STATE */
    @State() sanitizedHelp: string = ''

    @State() sanitizedLabel: string = ''

    @State() internalValue: string[] = ['', '', '', '']
    @Watch('internalValue') validInternalValue(newVal) {
        console.log('internalValue', newVal)
        if (this.isSettingValue) { return this.queuedValue = newVal }

        this.isSettingValue = true

        const newExternal = internalToExternalValue(newVal)

        Promise.resolve(newExternal !== this.value ? this.value = newExternal : undefined)

        if (this.queuedValue) {
            const queuedValue = this.queuedValue
            this.isSettingValue = this.queuedValue = undefined
            return this.validInternalValue(queuedValue)
        }

        this.isSettingValue = false
    }


    /** METHODS */
    @Method() getValidity() { return Promise.resolve(this.inputElement.validity) }

    @Method() getValidationMessage() { return Promise.resolve(this.inputElement.validationMessage) }

    @Method() hour(value?) { return this.setGetValue(0, value) }

    @Method() minute(value?) { return this.setGetValue(1, value) }

    @Method() second(value?) { return this.setGetValue(2, value) }

    @Method() meridien(value?) { return this.setGetValue(undefined, value) }


    /** ELEMENTS */
    containerElement!: HTMLElement
    helpTextElement!: HTMLElement
    inputElement!: HTMLInputElement
    labelElement!: HTMLLabelElement
    hourInputElement!: HTMLInputElement
    minuteInputElement!: HTMLInputElement
    secondInputElement!: HTMLInputElement
    meridienElement!: HTMLFieldSelectElement


    /** INTERNAL METHODS */
    isSettingValue: boolean = false
    queuedValue: any

    externalForm() { return this.host.closest('form') }

    externalInput() { return this.host.querySelector('input') }

    focused() { return this.inputid === (document.activeElement as any).inputid }

    isempty() { return isEmpty(this.value) }

    isvalid() { return this.inputElement.validity.valid }

    externalToInternal(newVal) {
        console.log('value', newVal)
        const newInternal = externalToInternalValue(newVal)

        if (!Equals(newInternal, this.internalValue)) {
            this.internalValue = newInternal
        }
    }

    handleValueUpdate(index, value) {
        if (typeof value === 'undefined') { return }

        const proxy = this.internalValue.slice()

        const setMeridienValue = () => {
            proxy[3] = value
            this.internalValue = proxy
        }

        const setDigitValue = () => {
            const parsed = isEmpty(value) ? '' : Number(value)
            const isZeroSeconds = index === 2 && !this.showseconds
            let val = ''

            if (!isNaN(parsed as number) && !isZeroSeconds) {
                if (index === 0) {
                    if (parsed <= 0 || parsed > 12) {
                        val = (12).toString()
                    } else {
                        val = parsed.toString()
                    }
                } else {
                    val = Math.min(59, Math.max(parsed as number, 0)).toString()
                }
            }

            proxy[index] = index > 0 && !isEmpty(val) ? addLeadingZeros(val) : val
            this.internalValue = proxy
        }

        if (index === undefined) {
            setMeridienValue()
        } else {
            setDigitValue()
        }

        if (!Equals(this.internalValue, proxy)) {
            this.internalValue = proxy
        }
    }

    setGetValue(index, value) {
        return new Promise(resolve => {
            this.handleValueUpdate(index, value)
            return resolve(this.internalValue[index])
        })
    }

    handleBlur(event) {
        console.log('j')
        const target = GetEventTarget(event) as HTMLInputElement

        let key = target.getAttribute('data-key')

        if (key === null && tag(target) === 'select') { key = 'meridien' }

        console.log(key, target)

        if (typeof this[key] === 'function') { this[key](target.value) }

        if (this.containerElement) { this.setLabelPosition() }
    }

    handleKeyDown(event) {
        const key = keyboardEventKey(event)
        const target = GetEventTarget(event) as HTMLInputElement
        const isUpArrow = key == 'arrowup'

        if (tag(target) == 'input' && (isUpArrow || key == 'arrowdown')) {
            // const isHourInput = target.classList.contains('field-time-hour-input')
            // const ceil = isHourInput ? 12 : 60
            // const floor = 0
            // const evaluatedValue = Math.min(ceil, Math.max(floor, Number(target.value)))
            target.value = (Number(target.value) + (isUpArrow ? 1 : -1)).toString()
            DispatchEvent(target, 'input')
        }

        if (isSubmitting(key, this.externalForm())) {
            DispatchEvent(this.externalForm(), 'submit')
        }
    }

    setLabelAlign(val) {
        this.containerElement.setAttribute('labelalign', labelAlignments.indexOf(val) > -1 ? val : labelAlignments[0])
    }

    setLabelPosition() {
        this.containerElement.setAttribute('label-up', this.focused() || !this.isempty() ? 'true' : 'false')
    }

    sanitized(val) { return !val ? '' : ValidateHtml(val).sanitized as string }

    setEvents() {
        const container = this.containerElement as any
        const input = this.inputElement as any
        const slot = this.host.shadowRoot.querySelector('slot')

        removeEvents([container, input])

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
        this.externalToInternal(this.value)
    }

    componentDidLoad() {
        this.setLabelAlign(this.labelalign)
        this.setLabelPosition()
        this.setEvents()
    }

    disconnectedCallback() { removeEvents([this.containerElement, this.inputElement]) }

    render() {
        return <div
            ref={(el) => this.containerElement = el as HTMLElement}
            class="field-time-container field-element-container"
            onClick={() => this.focused() ? undefined : this.hourInputElement.focus()}
        >
            <input
                class="field-time-hidden-input"
                placeholder=" "
                value={this.value}
                name={this.name}
                id={this.inputid}
                form={(this.externalForm() || {}).id}
                required={this.required}
                ref={(el) => this.inputElement = el as any}
            />
            <div class="field-time-inputs">
                <span class="icon-container"><slot name="icon" /></span>

                {inputKeys.map((key, index) =>
                    <div class={`field-time-${key}-container field-time-input-container`}>
                        <input
                            type="text"
                            placeholder={`${key[0]}${key[0]}`}
                            class={`field-time-${key}-input`}
                            value={this.internalValue[index]}
                            ref={(el) => this[`${key}InputElement`] = el as HTMLInputElement}
                            onFocus={() => this.setLabelPosition()}
                            onInput={(e) => this.handleBlur(e)}
                            onKeyDown={(e) => this.handleKeyDown(e)}
                            data-key={key}
                            maxlength="2"
                            pattern="\d*"
                        />
                    </div>
                )}

                <div
                    // class={`field-time-meridien-container field-time-input-container${this.shouldShowMeridien() ? '' : ' hide-input'}`}
                    class={`field-time-meridien-container field-time-input-container`}
                >
                    <field-select
                        ref={(el) => this.meridienElement = el as HTMLFieldSelectElement}
                        value={Number(this.internalValue[0]) > 11 ? 'pm' : 'am'}
                        options='[{"value":"am", "textContent":"AM"},{"value":"pm", "textContent":"PM"}]'
                        slim={true}
                        autowidth={true}
                        data-key={'meridien'}
                        onFocus={() => this.setLabelPosition()}
                        onInput={(e) => this.handleBlur(e)}
                        onKeyDown={(e) => this.handleKeyDown(e)}
                    ></field-select>
                </div>

                <label class="field-time-label" ref={(el) => this.labelElement = el as HTMLLabelElement}>{this.sanitizedLabel} </label>
            </div>

            <span
                class="field-help-text"
                ref={(el) => this.helpTextElement = el as HTMLElement}
            >{this.sanitizedHelp}</span>
        </div>
    }
}




// const numberOrEmpty = value => isNaN(value) ? '' : value


// const removeTrailingColon = value => {
//     if (!value || !value.length) { return '' }

//     while (value[value.length - 1] === ':') { value = value.slice(0, value.length - 1) }

//     return value
// }

// const parsedToString = parsed => removeTrailingColon(parsed.map(addLeadingZeros).join(':'))

// const getValidValue = (val: string, showSeconds: boolean) => parsedToString(timeStringToArray(val, showSeconds))

// const getValidValueFormat = (val: string, showSeconds: boolean) => getValidValue(val, showSeconds)

// const timeStringToArray = (time: string, showSeconds: boolean) => (time || '') .toString() .split(':') .map((v, i) => (i == 2 && !showSeconds) || isEmpty(v) ? '' : parseInt(v) )

// const arrayToSeconds = (array = []) => array.reduce((target, current, i) => {
//     const currentNumber = !!current ? current : 0
//     const seconds = i === 0 ?
//         currentNumber * 60 * 60 :
//         i === 1 ?
//             currentNumber * 60 :
//             currentNumber

//     target = target + seconds
//     return target
// }, 0)

// const secondsToArray = (secondsArg = 0) => {
//     const hours = Math.floor(secondsArg / (60 * 60))
//     const minutes = Math.floor((secondsArg - (hours * (60 * 60))) / 60)
//     const seconds = (secondsArg - ((hours * (60 * 60)) + (minutes * 60)))

//     return [hours, minutes, seconds]
// }








/*
formatHour() {
    if (isEmpty(this.hour)) { return '' }
    if (this.hour === 0) { return addLeadingZeros(12) }
    return addLeadingZeros(this.hour as number % 12 || 12)
}

formatMinute() {
    return addLeadingZeros(this.minute)
}

formatSecond() {
    return this.showseconds ? addLeadingZeros(this.second) : undefined
}

formatMeridien() {
    return isEmpty(this.hour) || this.hour > 11 ? 'pm' : 'am'
}

shouldShowMeridien() { return !isEmpty(this.hour) }

setValues(value) {
    // try and not go crazy on updates
    if (this.isSettingValue) { return this.queuedValue = value }

    this.isSettingValue = true

    const newVal = getValidValueFormat(value, this.showseconds)
    const parsed = timeStringToArray(newVal, this.showseconds)
    const newTimeArray = secondsToArray(
        Math.max(
            arrayToSeconds(timeStringToArray(this.min || '0:0:0', this.showseconds)),
            Math.min(
                arrayToSeconds(parsed),
                arrayToSeconds(timeStringToArray(this.max || '23:59:59', this.showseconds))
            )
        )
    ).map(
        (v, i) => isEmpty(parsed[i]) ? '' : v
    )

    const valueToSet = parsedToString(newTimeArray)
    const valueArrayToSet = timeStringToArray(valueToSet, this.showseconds)

    if (valueToSet !== this.value) {
        this.value = valueToSet
    }

    if (this.hour !== valueArrayToSet[0]) {
        this.hour = valueArrayToSet[0] as number
    }

    if (this.minute !== valueArrayToSet[1]) {
        this.minute = valueArrayToSet[1] as number
    }

    if (this.second !== valueArrayToSet[2]) {
        this.second = valueArrayToSet[2] as number
    }

    if (this.meridienElement && !isEmpty(valueArrayToSet[0])) {
        const meridienValue = this.meridienElement.value

        if (valueArrayToSet[0] > 11 && meridienValue !== 'pm') {
            this.meridienElement.value = 'pm'
        }

        if (valueArrayToSet[0] < 12 && meridienValue !== 'am') {
            this.meridienElement.value = 'am'
        }
    }

    if (!!this.error && this.isvalid()) { this.error = this.inputElement.validationMessage }

    if (this.containerElement) { this.setLabelPosition() }

    this.isSettingValue = false

    if (this.queuedValue) {
        const queued = this.queuedValue
        this.queuedValue = undefined
        return queued !== this.value ? this.setValues(queued) : undefined
    }
}

getHour(value) {
    const newVal = numberOrEmpty(parseInt(value))

    if (isNaN(parseInt(newVal))) { return newVal }

    const meridienValue = (this.meridienElement || {}).value

    if (!meridienValue) { return newVal }

    const minMaxed = Math.max(Math.min(24, newVal), 0)

    if (meridienValue === 'pm' && minMaxed < 12) { return minMaxed + 12 }

    return minMaxed
}

updateTimePart(value, index) {
    if (index === undefined || index > 2) { return }

    const parsed = timeStringToArray(this.value, this.showseconds)
    parsed[index] = index === 0 ? this.getHour(value) : numberOrEmpty(parseInt(value))

    this.setValues(
        parsed.filter(v => !isEmpty(v)).length === 0 ?
            '' : parsed.join(':')
    )
}

updateMeridien(value) {
    const parsedHour = parseInt(this.hour as string)

    if (isNaN(parsedHour)) { return }

    if (value === 'am') {
        if (this.hour > 11) {
            this.updateTimePart(parsedHour - 12, 0)
        }
    } else {
        if (this.hour < 12) {
            this.updateTimePart(parsedHour + 12, 0)
        }
    }
}

focusMaybe() {
    if (this.focused()) { return }
    this.hourInputElement.focus()
}
*/
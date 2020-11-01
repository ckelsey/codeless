import { ComponentArguments, ComponentElements } from '../../utils/component-builder/component'
import CreateComponent from '../../utils/component-builder/create'
import { AllInputProperties, label } from '../../utils/component-builder/input-properties'
import InputMethods from '../../utils/component-builder/input-methods'
import InputIconEvent from '../../utils/component-builder/input-icon-event'
import { helpTextElement } from '../../utils/component-builder/input-elements'
import EventObserver from '../../utils/observe/event-observer'
import Pipe from '../../utils/function-helpers/pipe'
import IfInvalid from '../../utils/checks/if-invalid'
import Get from '../../utils/objects/get'
import GetEventTarget from '../../utils/dom/get-event-target'
import SetCaret from '../../utils/dom/set-caret'
import ToBool from '../../utils/conversion/to-bool'
import '../field-select'
import './style.scss'

const addLeadingZeros = (val: number | string) => ('00' + val).slice(-2)
const getNowAsValue = () => `${addLeadingZeros(new Date().getHours())}:${addLeadingZeros(new Date().getMinutes())}:${addLeadingZeros(new Date().getSeconds())}`
const parseTime = (time: string) => (time || '').toString().split(':').map(v => parseInt(v)).filter(v => !isNaN(v))

const parseTimeValue = (val: any, host: any, stateKey: string, dateMethod: string) => {
    if (stateKey == 'seconds' && !host.showseconds) { return '00' }

    const int = parseInt(val)
    const prev = parseInt(Get(host, `state.${stateKey}.previous`))
    const now: any = new Date()

    return isNaN(int) ?
        isNaN(prev) ?
            now[dateMethod]() :
            prev :
        int
}

const elements: ComponentElements = {
    helptext: helpTextElement,
    hourInput: { selector: '.field-time-hour-input' },
    minuteInput: { selector: '.field-time-minutes-input' },
    secondInput: { selector: '.field-time-seconds-input' },
    meridienInput: { selector: '.field-time-meridien-input' },
    label: {
        selector: '.field-time-label',
        onChange(el, host) {
            el.events = {
                label: host.state.label.subscribe((label: string) => el.innerHTML = label),
                error: host.state.error.subscribe((error: string) => el.setAttribute('error', error)),
                required: host.state.required.subscribe((required: boolean) => el.classList[required ? 'add' : 'remove']('label-required'))
            }
        }
    }
}

const isValidValue = (val: any, defaultValue: any) => {
    const parsed = parseTime(val)
    return parsed.length > 1 ? parsed.map(addLeadingZeros).join(':') : defaultValue
}

const isValidValueFormat = (defaultValFn = () => { }) => ({
    format: (val: any) => isValidValue(val, defaultValFn())
})

const properties = Object.assign(
    {},
    AllInputProperties(),
    {
        max: isValidValueFormat(() => '24:60:60'),
        min: isValidValueFormat(() => '1:00:00'),
        hour: { format: (val: any, host: any) => parseTimeValue(val, host, 'hour', 'getHours') },
        minute: { format: (val: any, host: any) => parseTimeValue(val, host, 'minute', 'getMinutes') },
        second: { format: (val: any, host: any) => parseTimeValue(val, host, 'second', 'getSeconds') },
        showseconds: { format: Pipe(ToBool, IfInvalid(false)) },
        value: isValidValueFormat(getNowAsValue),
        label
    }
)

const FieldTime: ComponentArguments = {
    tag: 'field-time',
    template: require('./index.html'),
    elements,
    properties,
    methods: InputMethods(),
    slots: { icon: { target: '.icon-container' }, },
    onConnected(host) {
        host.events = host.events || {}
        host.events.slotChanged = InputIconEvent(host)

        const maxMinError = () => `Must be between ${host.min} and ${host.max}`

        const getSeconds = (parsed: number[]) => ((parsed[0] || 0) * (60 * 60)) + ((parsed[1] || 0) * 60) + (parsed[2] || 0)

        const fromSeconds = (secondsArg: number) => {
            const hours = Math.floor(secondsArg / (60 * 60))
            const minutes = Math.floor((secondsArg - (hours * (60 * 60))) / 60)
            const seconds = (secondsArg - ((hours * (60 * 60)) + (minutes * 60)))

            return [hours, minutes, seconds]
        }

        const determineValue = (maxSeconds: number, minSeconds: number, newValSeconds: number) => fromSeconds(
            maxSeconds < newValSeconds ?
                maxSeconds :
                minSeconds > newValSeconds ?
                    minSeconds :
                    newValSeconds
        ).map(addLeadingZeros).join(':')

        const processValue = (val: any, index: number) => {
            const value = parseInt(val)
            const parsed = parseTime(host.value)

            return determineValue(
                getSeconds(parseTime(host.max)),
                getSeconds(parseTime(host.min)),
                getSeconds(parsed.map((v: number, i: number) =>
                    index === i ?
                        index == 0 && parsed[0] > 12 ?
                            value < 12 ?
                                value + 12 :
                                value :
                            value :
                        v
                ))
            )
        }

        const updatedValue = () => {
            return determineValue(
                getSeconds(parseTime(host.max)),
                getSeconds(parseTime(host.min)),
                getSeconds(parseTime(host.value))
            )
        }

        const handleInput = (input: any, index: number) => {
            const thisVal = parseInt(input.textContent)
            const evaluatedValue = processValue(thisVal, index)
            const evaluatedParsed = parseTime(evaluatedValue)
            let invalid = false

            if (evaluatedParsed[index] !== thisVal) {
                input.textContent = addLeadingZeros(evaluatedParsed[index])
                invalid = true
            }

            host.value = evaluatedValue

            if (invalid) { host.error = maxMinError() }
        }

        requestAnimationFrame(() => {
            const hourInput = host.elements.hourInput
            const minuteInput = host.elements.minuteInput
            const secondInput = host.elements.secondInput
            const meridienInput = host.elements.meridienInput

            host.events.hourInput = host.events.hourInput || EventObserver(hourInput, 'blur').subscribe(() => handleInput(hourInput, 0))

            host.events.minuteInput = host.events.minuteInput || EventObserver(minuteInput, 'blur').subscribe(() => handleInput(minuteInput, 1))

            host.events.secondInput = host.events.secondInput || EventObserver(secondInput, 'blur').subscribe(() => handleInput(secondInput, 2))

            host.events.meridienInput = host.events.meridienInput || EventObserver(meridienInput, 'valuechange').subscribe(() => {
                const parsed = parseTime(host.value)
                const wasPm = parsed[0] > 12
                const thisVal = meridienInput.value
                const hour24Addition = wasPm && thisVal == 'AM' ? -12 : !wasPm && thisVal == 'PM' ? 12 : 0
                const newHour = parsed[0] + hour24Addition
                const processed = processValue(newHour, 0)
                const parsedProcessed = parseTime(processed)[0]
                let invalid = false

                if (parsedProcessed !== newHour) {
                    meridienInput.value = parsedProcessed > 12 ? 'PM' : 'AM'
                    invalid = true
                }

                host.value = processed

                if (invalid) { host.error = maxMinError() }
            })

            host.events.hour = host.state.hour.subscribe((val: number) =>
                host.value = processValue(val, 0)
            )

            host.events.minute = host.state.minute.subscribe((val: number) =>
                host.value = processValue(val, 1)
            )

            host.events.second = host.state.second.subscribe((val: number) =>
                host.value = processValue(val, 2)
            )

            host.events.max = host.state.max.subscribe(updatedValue)

            host.events.min = host.state.max.subscribe(updatedValue)

            host.events.showseconds = host.state.showseconds.subscribe((showseconds: number) => {
                secondInput.classList[showseconds ? 'remove' : 'add']('hide')
                host.querySelector('.field-time-seconds-divider').classList[showseconds ? 'remove' : 'add']('hide')
            })

            host.events.keyup = EventObserver(host, 'keyup').subscribe((e: KeyboardEvent) => {
                const key = e.key.toLowerCase()

                if (key !== 'arrowup' && key !== 'arrowdown') { return }

                const target = GetEventTarget(e)

                if (!target || !target.getAttribute('contenteditable')) { return }

                target.textContent = addLeadingZeros(parseInt(target.textContent || '') + (key == 'arrowdown' ? -1 : 1))
                SetCaret(target, 1)
            })

            host.events.value = host.state.value.subscribe((value: string) => {
                const parsed = parseTime(value)
                hourInput.textContent = addLeadingZeros(parsed[0] > 12 ? parsed[0] - 12 : parsed[0])
                minuteInput.textContent = addLeadingZeros(parsed[1])
                secondInput.textContent = addLeadingZeros(parsed[2])
                meridienInput.value = parsed[0] > 12 ? 'PM' : 'AM'
                host.hour = parsed[0]
                host.minute = parsed[1]
                host.second = parsed[2]

                host.error = ''
            })
        })
    }
}

CreateComponent(FieldTime)

export default FieldTime
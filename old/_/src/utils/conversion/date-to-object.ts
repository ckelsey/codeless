import ToDate from './to-date'
import { IsValid } from './set-valid'

export interface DateObject {
    year: number
    yearShort: string
    monthIndex: number
    month: number
    monthDouble: string
    monthName: string
    monthNameShort: string
    day: number
    dayDouble: string
    dayOfWeek: string
    dayOfWeekShort: string
    dayIndex: number
    hour24: number
    hour: number
    hourDouble: string
    hourDouble24: string
    minutes: number
    minutesDouble: string
    seconds: number
    secondsDouble: string
    milliseconds: number
    ampm: string
    date: Date
}

export default function DateToObject(value: any) {
    let result = ToDate(value)

    if (!IsValid(result)) { return result }

    const hour = parseInt(result.toLocaleTimeString(navigator.language, { hour: 'numeric', hour12: true }))

    const returnedResult: DateObject = {
        year: result.getFullYear(),
        yearShort: result.toLocaleDateString(navigator.language, { year: '2-digit' }),
        monthIndex: result.getMonth(),
        month: result.getMonth() + 1,
        monthDouble: result.toLocaleDateString(navigator.language, { month: '2-digit' }),
        monthName: result.toLocaleString(navigator.language, { month: 'long' }),
        monthNameShort: result.toLocaleString(navigator.language, { month: 'short' }),
        day: result.getDate(),
        dayDouble: result.toLocaleDateString(navigator.language, { day: '2-digit' }),
        dayOfWeek: result.toLocaleString(navigator.language, { weekday: 'long' }),
        dayOfWeekShort: result.toLocaleString(navigator.language, { weekday: 'short' }),
        dayIndex: result.getDay(),
        hour24: parseInt(result.toLocaleTimeString(navigator.language, { hour: 'numeric', hour12: false })),
        hour: hour,
        hourDouble: result.toLocaleTimeString(navigator.language, { hour: '2-digit', hour12: true }).replace(/[^0-9.]+/g, ''),
        hourDouble24: result.toLocaleTimeString(navigator.language, { hour: '2-digit', hour12: false }).replace(/[^0-9.]+/g, ''),
        minutes: parseInt(result.toLocaleTimeString(navigator.language, { minute: 'numeric' })),
        minutesDouble: `0${result.getMinutes()}`.slice(-2),
        seconds: parseInt(result.toLocaleTimeString(navigator.language, { second: 'numeric' })),
        secondsDouble: `0${result.getSeconds()}`.slice(-2),
        milliseconds: result.getMilliseconds(),
        ampm: result.toLocaleTimeString(navigator.language, { hour12: true, hour: 'numeric' }).replace(/[:\d]/g, '').trim(),
        date: result
    }

    return returnedResult
}
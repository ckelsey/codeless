import { ComponentArguments } from '../../utils/component-builder/component'
import CreateComponent from '../../utils/component-builder/create'
import Pipe from '../../utils/function-helpers/pipe'
import ToDate from '../../utils/conversion/to-date'
import ToBool from '../../utils/conversion/to-bool'
import IfInvalid from '../../utils/checks/if-invalid'
import Get from '../../utils/objects/get'
import './style.scss'

const parseDateValue = (stateKey: string, dateMethod: string) => (val: any, host: any) => {
    const int = parseInt(val)
    const prev = parseInt(Get(host, `state.${stateKey}.previous`))
    const now: any = new Date()

    return isNaN(int) ?
        isNaN(prev) ?
            now[dateMethod]() :
            prev :
        int
}

const getDate = (date: Date) => new Date(`${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`)

const CalendarDay: ComponentArguments = {
    tag: 'calendar-day',
    template: require('./index.html'),
    properties: {
        active: { format: Pipe(ToBool, IfInvalid(false)) },
        disabled: { format: Pipe(ToBool, IfInvalid(false)) },
        clickable: { format: Pipe(ToBool, IfInvalid(true)) },
        date: { format: Pipe(ToDate, IfInvalid(getDate(new Date()))) },
        day: { format: parseDateValue('day', 'getDate') },
        month: { format: parseDateValue('month', 'getMonth') },
        year: { format: parseDateValue('monyearth', 'getFullYear') },
    },
    elements: {
        root: { selector: '.calendar-day-root' },
        number: { selector: '.calendar-day-number' }
    },
    onConnected(host) {
        const numberEl = host.elements.number

        host.events = {}

        host.events.date = host.state.date.subscribe((date: Date) => {
            host.day = numberEl.textContent = date.getDate()
            host.month = date.getMonth()
            host.year = date.getFullYear()
        })

        host.events.day = host.state.day.subscribe((day: number) => host.date = `${host.month + 1}/${day}/${host.year}`)
        host.events.month = host.state.month.subscribe((month: number) => host.date = `${month + 1}/${host.day}/${host.year}`)
        host.events.year = host.state.year.subscribe((year: number) => host.date = `${host.month + 1}/${host.day}/${year}`)
        host.events.active = host.state.active.subscribe((active: boolean) => host.elements.root.classList[active ? 'add' : 'remove']('calendar-day-active'))
        host.events.disabled = host.state.disabled.subscribe((disabled: boolean) => host.elements.root.classList[disabled ? 'add' : 'remove']('calendar-day-disabled'))
        host.events.clickable = host.state.clickable.subscribe((clickable: boolean) => host.elements.root.classList[clickable ? 'add' : 'remove']('calendar-day-clickable'))
    }
}

CreateComponent(CalendarDay)
export default CalendarDay


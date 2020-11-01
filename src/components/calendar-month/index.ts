import { ComponentArguments } from '../../utils/component-builder/component'
import CreateComponent from '../../utils/component-builder/create'
import Pipe from '../../utils/function-helpers/pipe'
import ToDate from '../../utils/conversion/to-date'
import IfInvalid from '../../utils/checks/if-invalid'
import Get from '../../utils/objects/get'
import ToBool from '../../utils/conversion/to-bool'
import RemoveChildren from '../../utils/dom/remove-children'
import Create from '../../utils/dom/create'
import Debounce from '../../utils/timing/debounce'
import '../calendar-day'
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

const CalendarMonth: ComponentArguments = {
    tag: 'calendar-month',
    template: require('./index.html'),
    properties: {
        clickable: { format: Pipe(ToBool, IfInvalid(true)) },
        date: { format: Pipe(ToDate, IfInvalid(new Date())) },
        day: { format: parseDateValue('day', 'getDate') },
        month: { format: parseDateValue('month', 'getMonth') },
        year: { format: parseDateValue('monyearth', 'getFullYear') }
    },
    elements: {
        root: { selector: '.calendar-month-root' },
        daysContainer: { selector: '.calendar-month-days' }
    },

    onConnected(host) {
        const updateDateFromProp = Debounce(() => {
            const endOfMonth = new Date(host.year, host.month + 1, 0)
            const daysInMonth = endOfMonth.getDate()
            const day = daysInMonth < host.day ? daysInMonth : host.day
            host.date = new Date(host.year, host.month, day)
        }, 111)

        const populateDays = () => {
            const daysContainer = host.elements.daysContainer

            daysContainer.classList.add('calendar-month-days-updating')

            RemoveChildren(daysContainer)

            const year = host.date.getFullYear()
            const month = host.date.getMonth()

            const endOfMonth = new Date(year, month + 1, 0)
            const daysInMonth = endOfMonth.getDate()

            const startOfMonth = new Date(year, month, 1)
            let firstDay = startOfMonth.getDay()

            startOfMonth.setDate(0)

            let lastMonthDay = startOfMonth.getDate()

            while (firstDay--) {
                daysContainer.appendChild(Create({
                    tag: 'calendar-day',
                    properties: {
                        date: new Date(year, month, lastMonthDay - firstDay),
                        disabled: true
                    }
                }))
            }

            let len = daysInMonth

            while (len--) {
                daysContainer.appendChild(Create({
                    tag: 'calendar-day',
                    properties: {
                        date: new Date(year, month, daysInMonth - len),
                        clickable: host.clickable
                    }
                }))
            }

            let lastDay = endOfMonth.getDay()
            let nextDay = 1

            while (lastDay < 6) {
                daysContainer.appendChild(Create({
                    tag: 'calendar-day',
                    properties: {
                        date: new Date(year, month, nextDay),
                        disabled: true
                    }
                }))
                lastDay = lastDay + 1
                nextDay = nextDay + 1
            }

            daysContainer.classList.remove('calendar-month-days-updating')
        }

        host.events = {
            date: host.state.date.subscribe((date: Date) => {
                host.day = date.getDate()
                host.month = date.getMonth()
                host.year = date.getFullYear()
                populateDays()
            }),

            day: host.state.day.subscribe((val: number) => host.date.getDate() === val ? undefined : updateDateFromProp()),

            month: host.state.month.subscribe((val: number) => host.date.getMonth() === val ? undefined : updateDateFromProp()),

            year: host.state.year.subscribe((val: number) => host.date.getFullYear() === val ? undefined : updateDateFromProp()),

            clickable: host.state.clickable.subscribe(populateDays),
        }
    }
}

CreateComponent(CalendarMonth)
export default CalendarMonth


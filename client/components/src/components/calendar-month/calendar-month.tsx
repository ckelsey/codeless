import { Component, h, Element, Prop, State, Watch, Method } from '@stencil/core'
import ArrayFrom from '../../../../utils/conversion/array-from'
import Create from '../../../../utils/dom/create'

const getDate = (date: Date) => new Date(`${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`)

@Component({
    tag: 'calendar-month',
    styleUrl: 'style.scss',
    shadow: true
})

export class CalendarMonth {
    @Element() host

    /** PROPERTIES */
    @Prop() active: boolean = false
    @Prop() disabled: boolean = false
    @Prop() clickable: boolean = true
    @Prop() date: string | Date = getDate(new Date())
    @Watch('date') dateWatcher(newVal) { this.updateDate(newVal) }


    /** STATE */
    @State() _day: number
    @State() _month: number
    @State() _year: number


    /** METHODS */
    @Method() day(val) {
        return new Promise(resolve => {
            const day = parseInt(val)

            if (isNaN(day)) { return resolve(this._day) }

            const proxy = new Date(this.date)
            proxy.setDate(day)

            this.date = proxy

            return resolve(this._day)
        })
    }

    @Method() month(val) {
        return new Promise(resolve => {
            const month = parseInt(val)

            if (isNaN(month)) { return resolve(this._month) }

            const proxy = new Date(this.date)
            proxy.setMonth(month)

            this.date = proxy

            return resolve(this._month)
        })
    }

    @Method() year(val) {
        return new Promise(resolve => {
            const year = parseInt(val)

            if (isNaN(year)) { return resolve(this._year) }

            const proxy = new Date(this.date)
            proxy.setFullYear(year)

            this.date = proxy

            return resolve(this._year)
        })
    }


    /** ELEMENTS */
    daysElement!: HTMLElement


    /** INTERNAL */
    updateDate(date) {
        if (typeof date === 'string') {
            date = new Date(date)
            return this.date = date
        }

        this._day = date.getDate()
        this._month = date.getMonth()
        this._year = date.getFullYear()
        this.updateDom()
    }

    updateDom() {
        const date = typeof this.date === 'string' ? new Date(this.date) : this.date

        const daysContainer = this.daysElement

        if (!daysContainer) { return }

        daysContainer.classList.add('calendar-month-days-updating')

        ArrayFrom(daysContainer.children).forEach(el => daysContainer.removeChild(el))

        const year = date.getFullYear()
        const month = date.getMonth()

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
                    clickable: this.clickable,
                    // active: date.getDate() === (daysInMonth - len)
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


    /** LIFECYLE */
    componentWillLoad() { this.updateDate(this.date) }

    componentDidLoad() { this.updateDom() }

    render() {
        return <div class="calendar-month-root">
            <div
                class="calendar-month-days"
                ref={(el) => this.daysElement = el as HTMLElement}
            ></div>
        </div>
    }
}

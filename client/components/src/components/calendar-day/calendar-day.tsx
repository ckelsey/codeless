import { Component, h, Element, Prop, State, Watch, Method } from '@stencil/core'

@Component({
    tag: 'calendar-day',
    styleUrl: 'style.scss',
    shadow: true
})

export class CalendarDay {
    @Element() host

    /** PROPERTIES */
    @Prop() active: boolean = false
    @Prop() disabled: boolean = false
    @Prop() clickable: boolean = true
    @Prop() date: Date = new Date()
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


    /** INTERNAL */
    updateDate(date) {
        this._day = date.getDate()
        this._month = date.getMonth()
        this._year = date.getFullYear()
    }


    /** LIFECYLE */
    componentWillLoad() { this.updateDate(this.date) }

    render() {
        return <div
            class={`calendar-day-root${this.active ?
                ' calendar-day-active' :
                ''
                }${this.disabled ?
                    ' calendar-day-disabled' :
                    ''
                }${this.clickable ?
                    ' calendar-day-clickable' :
                    ''
                }`}
        >
            <div class="calendar-day-number-container">
                <div class="calendar-day-number">{this._day}</div>
            </div>
            <div class="calendar-day-content"></div>
        </div>
    }
}

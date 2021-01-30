/** TODO
 * Make month name a dropdown
 * Make year a number field
 */

import { Component, Prop, h, Watch, Element, State, Event } from '@stencil/core'

@Component({
    tag: 'calendar-header',
    styleUrl: 'style.scss',
    shadow: true
})

export class CalendarHeader {
    @Element() host

    /** PROPS */
    @Prop() date: Date | string = new Date()
    @Watch('date') dateWatcher(newVal) { this.updateDate(newVal) }

    /** STATE */
    @State() monthString: string = ''
    @State() yearString: string = ''

    @Event() datechange


    /** ELEMENTS */
    containerElement!: HTMLElement
    previousElement!: HTMLIconElementElement
    nextElement!: HTMLIconElementElement


    /** INTERNAL METHODS */
    updateDate(newVal) {
        const date = new Date(newVal)

        if (date.toString() !== 'Invalid Date') {
            this.monthString = date.toLocaleString(undefined, { month: 'long' })
            this.yearString = date.toLocaleString(undefined, { year: 'numeric' })
        }
    }

    updateEvent(date) {
        this.date = date
        this.datechange.emit({ date: this.date })
    }

    previousMonth() {
        const date = new Date(this.date)
        date.setMonth(date.getMonth() - 1)
        this.updateEvent(date)
    }

    nextMonth() {
        const date = new Date(this.date)
        date.setMonth(date.getMonth() + 1)
        this.updateEvent(date)
    }


    /** LIFECYLE */
    componentWillLoad() { this.updateDate(this.date) }

    render() {
        return <div
            class="calendar-header-container"
            ref={(el) => this.containerElement = el as HTMLElement}
        >
            <icon-element
                kind="chevron-left"
                ref={(el) => this.previousElement = el as HTMLIconElementElement}
                onClick={() => this.previousMonth()}
            ></icon-element>

            <div class="calendar-header-center">
                <div class="calendar-header-month">{this.monthString}</div>
                <div class="calendar-header-year">{this.yearString}</div>
            </div>

            <icon-element
                kind="chevron-right"
                ref={(el) => this.nextElement = el as HTMLIconElementElement}
                onClick={() => this.nextMonth()}
            ></icon-element>
        </div>
    }
}

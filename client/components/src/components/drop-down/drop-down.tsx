import { Component, h, Element, Prop, Host } from '@stencil/core'
import EventObserver from '../../../../utils/observe/event-observer'
import AppendStyleElement from '../../../../utils/dom/append-style-element'
import WasClickedOn from '../../../../utils/dom/was-clicked-on'
import ArrayFrom from '../../../../utils/conversion/array-from'
import DispatchEvent from '../../../../utils/dom/dispatch-event'

const alignments = ['left', 'right']
const itemStyle = 'drop-down [slot="item"]{color:inherit; white-space: nowrap; min-width: 100%; cursor: pointer; position: relative; padding: 0.5em 1em; box-sizing: border-box;} drop-down [slot="item"]::before{content: ""; position: absolute; width: 100%; height: 100%; left:0; top:0; background-color: currentColor; opacity:0; transition: opacity 0.2s;} drop-down [slot="item"]:hover::before{opacity:0.1;}'

@Component({
    tag: 'drop-down',
    styleUrl: 'style.scss',
    shadow: true
})

export class DropDown {
    @Element() host

    @Prop() align: string = alignments[0]

    containerElement!: HTMLElement

    removeEvents(containerElement) { Object.keys(containerElement.events || {}).forEach((key) => containerElement.events[key]()) }

    /** LIFECYLE */
    componentDidLoad() {
        const containerElement = this.containerElement as any

        containerElement.events = {
            click: EventObserver(this.host, 'click').subscribe(e => {
                const item = WasClickedOn(ArrayFrom(this.host.querySelectorAll('[slot="item"]')), e)[0]
                if (item) { DispatchEvent(this.host, 'itemclicked', item) }
            })
        }

        if (!document.head.querySelector('style[name="drop-down-item-style"]')) {
            AppendStyleElement(itemStyle, document.head, 'drop-down-item-style')
        }
    }

    disconnectedCallback() {
        this.removeEvents(this.containerElement)
    }

    render() {
        return <Host>
            <div ref={(el) => this.containerElement = el as HTMLElement} class="drop-down-container">
                <div class="drop-down-label-container">
                    <div class="drop-down-label"><slot name="label" /></div>
                    <div class="drop-down-arrow"></div>
                </div>
                <div class="drop-down-items"><slot name="item" /></div>
            </div>
        </Host>
    }
}

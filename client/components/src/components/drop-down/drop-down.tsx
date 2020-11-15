import { Component, h, Element, Prop } from '@stencil/core'
import AppendStyleElement from '../../../../utils/dom/append-style-element'
import WasClickedOn from '../../../../utils/dom/was-clicked-on'
import ArrayFrom from '../../../../utils/conversion/array-from'
import DispatchEvent from '../../../../utils/dom/dispatch-event'

const itemStyle = 'drop-down [slot="item"]{color:inherit; white-space: nowrap; min-width: 100%; cursor: pointer; position: relative; padding: 0.5em 1em; box-sizing: border-box;} drop-down [slot="item"]::before{content: ""; position: absolute; width: 100%; height: 100%; left:0; top:0; background-color: currentColor; opacity:0; transition: opacity 0.2s;} drop-down [slot="item"]:hover::before{opacity:0.1;}'

@Component({
    tag: 'drop-down',
    styleUrl: 'style.scss',
    shadow: true
})

export class DropDown {
    @Element() host

    @Prop() closeonclick: boolean = true
    @Prop() openonhover: boolean = true
    @Prop({ mutable: true, reflect: true }) open: boolean = false

    clicked(e: Event) {
        const item = WasClickedOn(ArrayFrom(this.host.querySelectorAll('[slot="item"]')), e)

        if (item) { DispatchEvent(this.host, 'itemclicked', item) }

        if (this.closeonclick && this.open) { return this.open = false }

        if (!this.open) { this.open = true }
    }

    /** LIFECYLE */
    componentDidLoad() {
        if (!document.head.querySelector('style[name="drop-down-item-style"]')) {
            AppendStyleElement(itemStyle, document.head, 'drop-down-item-style')
        }

        if (typeof this.host.clickEvent === 'function') {
            this.host.clickEvent()
        }

        const clickFn = (e) => this.clicked(e)

        this.host.addEventListener('click', clickFn)
        this.host.clickEvent = () => {
            this.host.removeEventListener('submit', clickFn)
            delete this.host.clickEvent
        }
    }

    render() {
        return <div
            class={`drop-down-container${this.open ? ' open' : ''}`}
            onMouseOver={() => !this.openonhover ? undefined : this.open = true}
            onMouseOut={() => !this.openonhover ? undefined : this.open = false}
        >
            <div class="drop-down-label-container">
                <div class="drop-down-label"><slot name="label" /></div>
                <div class="drop-down-arrow"></div>
            </div>
            <div class="drop-down-items"><slot name="item" /></div>
        </div>
    }
}

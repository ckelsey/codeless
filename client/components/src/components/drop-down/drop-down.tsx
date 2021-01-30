import { Component, h, Element, Prop, Watch } from '@stencil/core'
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

    @Prop() arrow: boolean = true
    @Watch('arrow') arrowWatcher(newVal) { this.updateArrow(newVal) }

    @Prop() closeonclick: boolean = true
    @Prop() openonhover: boolean = true
    @Prop({ mutable: true, reflect: true }) open: boolean = false
    @Watch('open') openWatcher(newVal) {
        // If any inputs inside, blur them out
        if (!newVal) { this.inputElement.focus() }
    }

    inputElement!: HTMLInputElement
    containerElement!: HTMLElement

    clicked(e: Event) {
        const item = WasClickedOn(ArrayFrom(this.host.querySelectorAll('[slot="item"]')), e)

        if (item) { DispatchEvent(this.host, 'itemclicked', item) }

        if (this.closeonclick && this.open) { return this.open = false }

        if (!this.open) { this.open = true }
    }

    updateArrow(show) {
        this.containerElement.setAttribute('arrow', show ? 'true' : 'false')
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

        this.updateArrow(this.arrow)
    }

    render() {
        return <div
            class={`drop-down-container${this.open ? ' open' : ''}`}
            onMouseOver={() => !this.openonhover || this.open === true ? undefined : this.open = true}
            onMouseLeave={() => !this.openonhover || this.open === false ? undefined : this.open = false}
            ref={el => this.containerElement = el}
        >
            <input ref={el => this.inputElement = el} class="dropdown-hidden-input" />
            <div class="drop-down-label-container">
                <div class="drop-down-label"><slot name="label" /></div>
                <icon-element kind="chevron-down" class="drop-down-arrow"></icon-element>
            </div>
            <div class="drop-down-items"><slot name="item" /></div>
        </div>
    }
}

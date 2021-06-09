import { Component, h, Prop, Watch } from '@stencil/core'
import Overlay, { OverlayApi } from '../../../../utils/behaviors/overlay'

@Component({
    tag: 'overlay-element',
    styleUrl: 'style.scss',
    shadow: false
})

export class OverlayElement {
    /** PROPS */
    @Prop({ reflect: true }) active: boolean = false

    @Watch('active') activeWatcher(newVal) {
        this.overlay.active = newVal
    }

    contentElement!: HTMLElement
    overlay: OverlayApi

    componentDidLoad() {
        Overlay({
            target: this.contentElement
        }).then(api => this.overlay = api)
    }

    render() {
        return <div class="overlay-element-content" ref={el => this.contentElement = el}><slot /></div>
    }
}

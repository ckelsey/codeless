import { Component, Element, h, Prop, Watch } from '@stencil/core'
import Drag from '../../../../utils/behaviors/drag'


@Component({
    tag: 'drag-x',
    styleUrl: 'style.scss',
    shadow: false
})

export class DragX {
    @Element() host
    @Prop() contained: boolean = true
    @Watch('contained') containedWatcher() { this.initializeDrag() }

    initializeDrag() {
        Drag({
            target: this.host,
            contained: this.contained,
            onMove: (position) => this.host.style.left = `${position.percentX}%`
        })
    }

    componentDidLoad() { this.initializeDrag() }
    render() { return <slot /> }
}

import { Component, Element, Event, h, Prop, Watch } from '@stencil/core'
import Drag from '../../../../utils/behaviors/drag'


@Component({
    tag: 'drag-xy',
    styleUrl: 'style.scss',
    shadow: false
})

export class DragXy {
    @Element() host
    @Prop() contained: boolean = true
    @Watch('contained') containedWatcher() { this.initializeDrag() }

    @Event() moved

    initializeDrag() {
        Drag({
            target: this.host,
            contained: this.contained,
            onMove: (position) => {
                this.host.style.left = `${position.percentX}%`
                this.host.style.top = `${position.y}px`
                this.moved.emit(position)
            }
        })
    }

    componentDidLoad() { this.initializeDrag() }
    render() { return <slot /> }
}

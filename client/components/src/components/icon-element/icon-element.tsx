import { Component, h, Prop, Watch } from '@stencil/core'
import * as _chevLeft from './paths/chevron-left.json'
import * as _chevRight from './paths/chevron-right.json'
import * as _chevDown from './paths/chevron-down.json'
import * as _arrowLeftRight from './paths/arrow-left-right.json'
import * as _eyedropper from './paths/eyedropper.json'

const paths = {
    "arrow-left-right": _arrowLeftRight['default'],
    "chevron-left": _chevLeft['default'],
    "chevron-right": _chevRight['default'],
    "chevron-down": _chevDown['default'],
    "eyedropper": _eyedropper['default'],
}

@Component({
    tag: 'icon-element',
    styleUrl: 'style.scss',
    shadow: true
})

export class IconElement {
    @Prop({ reflect: true }) kind: string = ''
    @Watch('kind') kindWatcher(newVal) { this.updatePath(newVal) }

    containerElement!: HTMLElement

    path: string = ''

    updatePath(path) { this.path = paths[path] }

    componentWillLoad() { this.updatePath(this.kind) }

    render() {
        return <div class="icon-element-container" ref={el => this.containerElement = el as HTMLElement}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24"
            >
                <path d={this.path}></path>
            </svg>
        </div >
    }
}

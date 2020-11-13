import { Component, h } from '@stencil/core'

@Component({
    tag: 'root-element',
    styleUrl: 'style.scss',
    shadow: false
})

export class RootElement {
    render() { return <div class="root-element-container"><slot /></div> }
}

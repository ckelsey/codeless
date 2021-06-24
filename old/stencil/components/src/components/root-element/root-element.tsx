import { Component, h, Prop } from '@stencil/core'

@Component({
    tag: 'root-element',
    styleUrl: 'style.scss',
    shadow: false
})

export class RootElement {
    @Prop() theme: 'inverse' | '' = ''


    render() {
        return <div class="root-element-container" data-theme={this.theme}>
            <slot />
        </div>
    }
}

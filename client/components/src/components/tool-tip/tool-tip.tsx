import { Component, Element, h, Prop, State, Watch } from '@stencil/core'
import ID from '../../../../utils/id'

const animationTimers = {}
const alignments: ['bottom', 'top', 'left', 'right'] = ['bottom', 'top', 'left', 'right']

@Component({
    tag: 'tool-tip',
    styleUrl: 'style.scss',
    shadow: true
})

export class ToolTip {
    /** PROPS */
    @Prop() active: boolean = false
    @Prop() align: 'top' | 'bottom' | 'left' | 'right' = 'bottom'
    @Prop() container: string | HTMLElement
    @Prop() on: string = 'mousedown'
    @Prop() off: string = 'mouseup'



    /** STATE */
    @State() containerElement: HTMLElement
    @State() internalAlign: 'top' | 'bottom' | 'left' | 'right' = 'bottom'



    /** ELEMENTS */
    @Element() host
    tooltipContainerElement!: HTMLElement
    contentElement!: HTMLElement
    arrowElement!: HTMLElement



    /** WATCHERS */
    @Watch('active') activeWatch(isActive) {
        cancelAnimationFrame(animationTimers[this.id])

        if (!isActive) { return }

        const check = () => {
            cancelAnimationFrame(animationTimers[this.id])

            if (!this.active) { return }

            const containerBox = this.containerElement.getBoundingClientRect()
            const pageWidth = window.innerWidth
            const pageHeight = window.innerHeight

            // close if offscreen
            if (containerBox.bottom < 0 ||
                containerBox.top > pageHeight ||
                containerBox.right < 0 ||
                containerBox.left > pageWidth
            ) {
                return this.active = false
            }

            const contentBox = this.contentElement.getBoundingClientRect()
            const halfContentWidth = contentBox.width / 2
            const centerX = containerBox.left + (containerBox.width / 2)
            const centerY = containerBox.top + (containerBox.height / 2)
            const isTaller = containerBox.bottom + contentBox.height > pageHeight
            const isShorter = containerBox.top - contentBox.height < 0
            const protrudes = containerBox.right + contentBox.width > pageWidth
            const recessed = containerBox.left - contentBox.width < 0

            let x = centerX
            let y = containerBox.bottom

            if (this.internalAlign === 'bottom') {
                if (isTaller) {
                    if (!isShorter) {
                        this.internalAlign = 'top'
                        return check()
                    }

                    y = centerY // make do
                }
            }

            if (this.internalAlign === 'top') {
                y = containerBox.top - contentBox.height

                if (isShorter) {
                    if (!isTaller) {
                        this.internalAlign = 'bottom'
                        return check()
                    }

                    y = centerY // make do
                }
            }

            if (this.internalAlign === 'bottom' || this.internalAlign === 'top') {
                if (pageWidth < halfContentWidth + centerX) { x = pageWidth - halfContentWidth }
                if (centerX - halfContentWidth < 0) { x = halfContentWidth }
            }

            if (this.internalAlign === 'left') {
                x = containerBox.left - contentBox.width

                if (recessed) {
                    if (!protrudes) {
                        this.internalAlign = 'right'
                        return check()
                    }

                    x = centerX // make do
                }
            }

            if (this.internalAlign === 'right') {
                x = containerBox.right

                if (protrudes) {
                    if (!recessed) {
                        this.internalAlign = 'left'
                        return check()
                    }

                    x = centerX // make do
                }
            }

            if (this.internalAlign === 'left' || this.internalAlign === 'right') { y = centerY }

            this.tooltipContainerElement.style.left = `${x}px`
            this.tooltipContainerElement.style.top = `${y}px`
            animationTimers[this.id] = requestAnimationFrame(() => check())
        }

        check()
    }

    @Watch('align') alignWatch(newVal) { this.updateAlignment(newVal) }

    @Watch('container') containerWatch(newVal) { this.updateContainer(newVal) }

    @Watch('containerElement') containerElementWatch(newVal, oldVal) {
        this.removeListeners(oldVal, this.on, this.off)
        this.updateContainerElement(newVal)
    }

    @Watch('on') onWatch(_newVal, oldVal) {
        this.removeListeners(this.containerElement, oldVal, this.off)
        this.updateContainerElement(this.containerElement)
    }

    @Watch('off') offWatch(_newVal, oldVal) {
        this.removeListeners(this.containerElement, this.on, oldVal)
        this.updateContainerElement(this.containerElement)
    }



    /** INTERNAL */
    id: string = ID()
    setActive(event) { this.active = event.type === this.on }

    updateAlignment(value) {
        if (alignments.indexOf(value) === -1) {
            return this.internalAlign = alignments[0]
        }

        this.internalAlign = value
    }

    updateContainer(value) {
        if (typeof value === 'string') {
            return this.containerElement = this.host.closest(value) || this.host.parentElement
        }

        if (value instanceof HTMLElement) {
            return this.containerElement = value
        }

        this.containerElement = this.host.parentElement
    }

    updateContainerElement(containerElement) {
        if (!containerElement) { return }

        containerElement.style.position = 'relative'
        containerElement.style.cursor = 'pointer'

        if (!this.on) { return }

        containerElement.addEventListener(this.on, this.setActive)

        if (!this.off) { return }

        containerElement.addEventListener(this.off, this.setActive)
    }

    removeListeners(containerElement, on, off) {
        try {
            containerElement.style.removeProperty('position')
            containerElement.style.removeProperty('cursor')
            containerElement.removeEventListener(on, this.setActive)
            containerElement.removeEventListener(off, this.setActive)
        } catch (error) { }
    }



    /** LIFECYCLE */
    componentWillLoad() {
        this.setActive = this.setActive.bind(this)
        this.updateContainer(this.container)
        this.updateAlignment(this.align)
        animationTimers[this.id] = 0
    }

    disconnectedCallback() { this.removeListeners(this.containerElement, this.on, this.off) }

    render() {
        return <div
            class={`tool-tip-container${this.active ? ' active' : ''}`}
            ref={el => this.tooltipContainerElement = el as HTMLElement}
            data-align={this.internalAlign}
        >
            <div class="tool-tip-content" ref={el => this.contentElement = el as HTMLElement}>
                <div class="tool-tip-arrow" ref={el => this.arrowElement = el as HTMLElement}></div>
                <slot />
            </div>
        </div >
    }
}

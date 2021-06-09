import { Component, Event, h, Prop, State, Watch } from '@stencil/core'

@Component({
    tag: 'slider-bar',
    styleUrl: 'style.scss',
    shadow: true
})

export class SliderBar {
    @Prop({ mutable: true, reflect: true }) value: number = 0 // 0->100
    @Watch('value') valueWatcher() { this.updateValue(this.value) }

    @Prop() vertical: boolean

    @State() moving: boolean = false

    @Event() sliderbarinput

    sliderBarContainerElement!: HTMLElement
    sliderBarIndicatorElement!: HTMLElement
    handleElement!: HTMLElement

    updateValue(value) {
        const handleBox = this.handleElement.getBoundingClientRect()

        if (!!this.vertical) {
            this.handleElement.setAttribute('style', `top:calc(${100 - this.value}% - ${handleBox.height / 2}px); left:calc(50% - ${handleBox.width / 2}px);`)
            this.sliderBarIndicatorElement.style.height = `${this.value}%`
        } else {
            this.handleElement.setAttribute('style', `top:calc(50% - ${handleBox.height / 2}px); left:calc(${this.value}% - ${handleBox.width / 2}px);`)
            this.sliderBarIndicatorElement.style.width = `${this.value}%`
        }

        if (this.value === value) { return }

        this.value = value
        this.sliderbarinput.emit(value)
    }

    componentDidLoad() { this.updateValue(this.value) }

    render() {
        return <div class="slider-bar" data-vertical={!!this.vertical ? 'true' : 'false'} data-moving={!!this.moving ? 'true' : 'false'}>
            <div
                class="slider-bar-container"
                onMouseDown={e => {
                    function _update(event) {
                        this.moving = true

                        const box = this.sliderBarContainerElement.getBoundingClientRect()

                        if (!!this.vertical) {
                            this.updateValue(Math.max(0, Math.min(100,
                                (1 - ((event.y - box.top) / box.height)) * 100
                            )))
                        } else {
                            this.updateValue(Math.max(0, Math.min(100,
                                ((event.x - box.left) / box.width) * 100
                            )))
                        }
                    }

                    function _onUp() {
                        window.removeEventListener('mousemove', update)
                        window.removeEventListener('mouseup', onUp)
                        this.moving = false
                    }

                    const update = _update.bind(this)
                    const onUp = _onUp.bind(this)

                    window.addEventListener('mousemove', update)
                    window.addEventListener('mouseup', onUp)
                    update(e)
                }}
                ref={el => this.sliderBarContainerElement = el}
            >
                <div class="slider-bar-background">
                    <slot name="slider-bar-background">
                        <div class="default-slider-bar-background"></div>
                    </slot>

                    <div class="slider-bar-indicator" ref={el => this.sliderBarIndicatorElement = el}>
                        <slot name="slider-bar-indicator">
                            <div class="default-slider-bar-indicator"></div>
                        </slot>
                    </div>
                </div>

                <div class="slider-bar-handle" ref={el => this.handleElement = el}>
                    <slot name="slider-bar-handle">
                        <div class="default-slider-bar-handle"></div>
                    </slot>
                </div>
            </div>
        </div>
    }
}

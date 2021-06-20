import { Component, Event, h, Prop, State, Watch } from '@stencil/core'
import ColorObject, { ColorResult } from '../../../../utils/color/color-object'

@Component({
    tag: 'alpha-slider',
    styleUrl: 'style.scss',
    shadow: true
})

export class AlphaSlider {
    @Prop() value: string = ''
    @Watch('value') valueWatcher() { this.updateColor(this.value) }

    @Prop() color: () => ColorResult = () => ColorObject(`hsla(${this.hue} deg, ${this.saturation}%, ${this.lightness}%, ${this.alpha})`)

    @State() hue: number = 0
    @State() saturation: number = 100
    @State() lightness: number = 100
    @State() alpha: number = 100

    @Event() alphasliderinput

    alphaColor!: HTMLElement
    alphaGrid!: HTMLElement
    sliderBar!: HTMLSliderBarElement

    updateColor(color) {
        const colorObject = ColorObject(color)

        this.hue = colorObject.h
        this.saturation = colorObject.s
        this.lightness = colorObject.l
        this.alpha = colorObject.a

        const hsl = `${this.hue}, ${this.saturation}%, ${this.lightness}%`

        this.alphaColor.style.backgroundImage = `linear-gradient(to right, hsla(${hsl}, 0), hsla(${hsl}, 1))`
        this.alphaGrid.style.backgroundImage = `linear-gradient(to right, hsl(${hsl}) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(${hsl}) 1px, transparent 1px)`

        this.sliderBar.value = this.alpha * 100

        this.alphasliderinput.emit(colorObject)
    }

    componentWillLoad() {
        const colorObject = ColorObject(this.value)
        this.hue = colorObject.h
        this.saturation = colorObject.s
        this.lightness = colorObject.l
        this.alpha = colorObject.a
    }

    componentDidLoad() {
        this.updateColor(this.value)
    }

    render() {
        return <div class="alpha-slider">
            <slider-bar
                ref={el => this.sliderBar = el as HTMLSliderBarElement}
                onSliderbarinput={e => this.updateColor(`hsla(${this.hue}deg, ${this.saturation}%, ${this.lightness}%, ${e.detail}%)`)}
            >
                <div class="alpha-slider-background" slot="slider-bar-background">
                    <div class="alpha-slider-grid" ref={el => this.alphaGrid = el as HTMLElement}></div>
                    <div class="alpha-slider-color" ref={el => this.alphaColor = el as HTMLElement}></div>
                </div>
                <div slot="slider-bar-indicator"></div>
            </slider-bar>
        </div>
    }
}

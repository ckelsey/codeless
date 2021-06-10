import { Component, Event, h, Prop, State, Watch } from '@stencil/core'
import ColorObject, { ColorResult } from '../../../../utils/color/color-object'

@Component({
    tag: 'saturation-slider',
    styleUrl: 'style.scss',
    shadow: true
})

export class SaturationSlider {
    @Prop() value: string = ''
    @Watch('value') valueWatcher() { this.updateColor(this.value) }

    @Prop() color: () => ColorResult = () => ColorObject(this.value)

    @State() colorObject: ColorResult

    @Event() saturationsliderinput

    sliderBar!: HTMLSliderBarElement
    saturationColorElement!: HTMLElement

    updateColor(color) {
        this.colorObject = ColorObject(color)

        if (this.saturationColorElement) {
            this.saturationColorElement.style.backgroundImage = `linear-gradient(to right, hsl(${this.colorObject.h}deg, 0%, ${this.colorObject.l}%), hsl(${this.colorObject.h}deg, 100%, ${this.colorObject.l}%))`
        }

        if (this.sliderBar) {
            this.sliderBar.value = this.colorObject.s
        }

        this.saturationsliderinput.emit(this.colorObject)
    }

    componentWillLoad() { this.updateColor(this.value) }

    componentDidLoad() {
        this.saturationColorElement.style.backgroundImage = `linear-gradient(to right, hsl(${this.colorObject.h}deg, 0%, ${this.colorObject.l}%), hsl(${this.colorObject.h}deg, 100%, ${this.colorObject.l}%))`
        this.sliderBar.value = this.colorObject.s
    }

    render() {
        return <div class="saturation-slider">
            <slider-bar
                ref={el => this.sliderBar = el as HTMLSliderBarElement}
                onSliderbarinput={e => this.updateColor(Object.assign({}, ColorObject(this.value), { s: e.detail }).toHsla())}
            >
                <div class="saturation-slider-background" slot="slider-bar-background" ref={el => this.saturationColorElement = el as HTMLElement}></div>
                <div slot="slider-bar-indicator"></div>
            </slider-bar>
        </div>
    }
}

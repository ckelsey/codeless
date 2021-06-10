import { Component, Event, h, Prop, State, Watch } from '@stencil/core'
import ColorObject, { ColorResult, ColorType } from '../../../../utils/color/color-object'

@Component({
    tag: 'color-picker',
    styleUrl: 'style.scss',
    shadow: true
})

export class ColorPicker {
    @Prop({ mutable: true, reflect: true }) value: string = ''
    @Watch('value') valueWatcher() { this.updateColor(ColorObject(this.value)) }

    @Prop() color: () => ColorResult = () => ColorObject(this.value)

    @State() mode: string = 'hex'

    @Event() colorpickerchanged

    eyedropperElement!: HTMLEyeDropperElement
    backgroundContainer!: HTMLElement

    getString(colorObject) {
        let colorString = colorObject.toHex()

        if (this.mode === 'hsl') {
            colorString = colorObject[`toHsl${colorObject.a === 1 ? '' : 'a'}`]()
        }

        if (this.mode === 'rgb') {
            colorString = colorObject[`toRgb${colorObject.a === 1 ? '' : 'a'}`]()
        }

        return colorString
    }

    updateColor(colorObject) {
        this.value = this.getString(colorObject)
        this.colorpickerchanged.emit(this.value)

        if (colorObject.l > 61) {
            this.eyedropperElement.style.color = '#000'
        } else {
            this.eyedropperElement.style.color = '#fff'
        }
    }

    updateMode(mode) {
        if (mode === this.mode) { return }
        this.mode = mode || this.mode || 'hex'
    }

    componentDidLoad() {
        this.updateMode(ColorType(this.value))
        this.updateColor(ColorObject(this.value))
    }

    render() {
        return <div class="color-picker-container">
            <color-wheel value={this.value} onColorwheelchanged={e => this.updateColor(e.detail)}></color-wheel>
            <div class="color-picker-middle">
                <div class="background-fill-container" ref={el => this.backgroundContainer = el as HTMLElement}>
                    <background-fill color={this.value}></background-fill>
                    <eye-dropper ref={el => this.eyedropperElement = el as HTMLEyeDropperElement} onEyedropperpick={e => this.updateColor(e.detail)}></eye-dropper>
                    <div class="background-fill-overlay"></div>
                </div>
                <div class="color-picker-sliders">
                    <saturation-slider value={this.value} onSaturationsliderinput={e => this.updateColor(e.detail)}></saturation-slider>
                    <alpha-slider value={this.value} onAlphasliderinput={e => this.updateColor(e.detail)}></alpha-slider>
                </div>
            </div>
            <color-inputs value={this.value} onColorinputschanged={e => this.updateColor(e.detail)} onColorinputsmodechanged={e => this.updateMode(e.detail)}></color-inputs>
        </div>
    }
}

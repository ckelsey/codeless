import { Component, Event, h, Prop, State, Watch } from '@stencil/core'
import ColorObject, { ColorResult } from '../../../../utils/color/color-object'
import DrawWheel from './draw-wheel'
import HueLightnessFromPoint from './hue-lightness-from-point'
import RadialXY from './radial-x-y'

@Component({
    tag: 'color-wheel',
    styleUrl: 'style.scss',
    shadow: true
})

export class ColorWheel {
    @Prop() value: string = ''
    @Watch('value') valueWatcher() { this.updateColor(this.value) }

    @Prop() color: () => ColorResult = () => ColorObject(`hsla(${this.hue} deg, ${this.saturation}%, ${this.lightness}%, ${this.alpha})`)

    @State() hue: number = 0
    @State() saturation: number = 100
    @State() lightness: number = 100
    @State() alpha: number = 1

    @Event() colorwheelchanged

    canvasElement!: HTMLCanvasElement
    wheelElement!: HTMLElement
    handleElement!: HTMLElement

    updateColor(color) {
        const wheelBox = this.canvasElement.getBoundingClientRect()
        const colorObject = ColorObject(color)
        const { x, y } = RadialXY(colorObject.h, colorObject.l, wheelBox)

        this.hue = colorObject.h
        this.saturation = colorObject.s
        this.lightness = colorObject.l
        this.alpha = colorObject.a
        /** TODO: when page is scrolled, y is wron and prolly x too */
        this.handleElement.style.top = `calc(${(y / wheelBox.height) * 100}% - 0.5em)`
        this.handleElement.style.left = `calc(${(x / wheelBox.width) * 100}% - 0.5em)`
        this.handleElement.style.backgroundColor = `hsl(${this.hue}deg, ${this.saturation}%, ${this.lightness}%)`
        this.colorwheelchanged.emit(colorObject)
    }

    componentWillLoad() {
        const colorObject = ColorObject(this.value)
        this.hue = colorObject.h
        this.saturation = colorObject.s
        this.lightness = colorObject.l
        this.alpha = colorObject.a
    }

    componentDidLoad() {
        DrawWheel(this.canvasElement.getContext('2d'))
        this.updateColor(this.value)
    }

    render() {
        return <div class="color-wheel">
            <div class="color-wheel-inner"
                ref={el => this.wheelElement = el as HTMLElement}
                onMouseDown={e => {
                    const updateColor = this.updateColor.bind(this)
                    const box = this.canvasElement.getBoundingClientRect()
                    const saturation = this.saturation
                    const alpha = this.alpha

                    function update(event) {
                        const { hue, lightness } = HueLightnessFromPoint(event.pageX, event.pageY, box)
                        updateColor(`hsla(${hue}deg, ${saturation}%, ${lightness}%, ${alpha} )`)
                    }

                    function onUp() {
                        document.body.removeEventListener('mousemove', update)
                        window.removeEventListener('mouseup', onUp)
                    }

                    document.body.addEventListener('mousemove', update)
                    window.addEventListener('mouseup', onUp)
                    update(e)
                }}
            >
                <canvas
                    ref={el => this.canvasElement = el as HTMLCanvasElement}
                    class="color-wheel-canvas"
                    width="1000"
                    height="1000"
                ></canvas>
                <div class="color-wheel-shade1"></div>
                <div class="color-wheel-shade2"></div>
                <div class="color-wheel-cursor" ref={el => this.handleElement = el as HTMLElement}></div>
            </div>
        </div>
    }
}

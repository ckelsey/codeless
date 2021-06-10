import { Component, Event, h, Prop } from '@stencil/core'
import FromJSON from '../../../../utils/conversion/from-json'

const defaultSize = '100%'
const defaultPosition = '0%'
const defaultColor = 'transparent'
const defaultRepeat = false

@Component({
    tag: 'background-fill',
    styleUrl: 'style.scss',
    shadow: true
})

export class BackgroundFill {
    @Prop() color: string = defaultColor

    @Prop() image: string = ''

    @Prop() repeat: boolean | string = defaultRepeat

    @Prop() sizex: string = defaultSize

    @Prop() sizey: string = defaultSize

    @Prop() positionx: string = defaultPosition

    @Prop() positiony: string = defaultPosition

    @Prop() line: string = defaultPosition

    @Prop() lineargradient: string = ''

    @Prop() radialgradient: string = ''

    @Event() backgroundchange

    backgroundElement!: HTMLElement

    updateStyle() {
        const { color, image, repeat, sizex, sizey, positionx, positiony, lineargradient, radialgradient } = this
        const linearGradients = FromJSON(lineargradient)
        const radialGradients = FromJSON(radialgradient)

        let style = `background-color:${color}; background-repeat:${!repeat ? 'no-repeat' : repeat === 'x' ? 'repeat-x' : repeat === 'y' ? 'repeat-y' : 'repeat'}; background-size:${sizex} ${sizey}; background-position:${positionx} ${positiony};`

        if (linearGradients.length || radialGradients.length || image) {
            const images = []

            if (image) { images.push(`url(${image})`) }

            if (linearGradients.length) { linearGradients.forEach(v => images.push(`linear-gradient(${v})`)) }

            if (radialGradients.length) { radialGradients.forEach(v => images.push(`radial-gradient(${v})`)) }

            style = `${style} background-image:${images.join(',')};`
        }

        this.backgroundElement.setAttribute('style', style)

        this.backgroundchange.emit(this)
    }

    componentDidLoad() { this.updateStyle() }
    componentDidUpdate() { this.updateStyle() }

    render() {
        return <div class="background-fill" ref={el => this.backgroundElement = el}><slot /></div>
    }
}

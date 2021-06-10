import { Component, Event, h, Prop, State, Watch } from '@stencil/core'
import ColorObject, { ColorResult, ColorType } from '../../../../utils/color/color-object'
import IsValidHex from '../../../../utils/color/is-valid-hex'

const defaultColor = '#FFFFFF'

function rgbValue(e) { return Math.max(0, Math.min(255, parseFloat(e.target.value))) }
function hueValue(e) { return Math.max(0, Math.min(360, parseFloat(e.target.value))) }
function percentValue(e) { return Math.max(0, Math.min(100, parseFloat(e.target.value))) }
function hexValue(e) { return IsValidHex(e.target.value) ? e.target.value : defaultColor }
function constrain(e, constrainedValue) {
    if (constrainedValue !== e.target.value) { e.target.value = constrainedValue }
    return constrainedValue
}
function constrainRgb(e) { return constrain(e, rgbValue(e)) }
function constrainAlpha(e) { return constrain(e, percentValue(e)) }
function constrainHex(e) { return constrain(e, hexValue(e)) }

@Component({
    tag: 'color-inputs',
    styleUrl: 'style.scss',
    shadow: true
})

export class ColorInputs {
    @Prop({ mutable: true, reflect: true }) value: string = defaultColor
    @Watch('value') valueWatcher() { this.updateValue(this.value) }

    @Prop() color: () => ColorResult = () => ColorObject(this.value)

    @State() colorObject: ColorResult
    @State() mode: string = 'hex'

    @Event() colorinputschanged
    @Event() colorinputsmodechanged

    elementTransition!: HTMLElementTransitionElement
    rgbContainer!: HTMLElement
    hslContainer!: HTMLElement
    hexContainer!: HTMLElement

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

    updateValue(value = defaultColor) {
        this.updateMode(ColorType(value))
        this.colorObject = ColorObject(value)
        this.value = this.getString(this.colorObject)
        this.colorinputschanged.emit(this.colorObject)
    }

    mergeValue(key, value) {
        this.value = this.getString(Object.assign({}, this.color(), { [key]: value }))
        this.colorObject = ColorObject(this.value)
    }

    updateMode(mode) {
        if (mode === this.mode) { return }

        this.mode = mode || this.mode || 'hex'

        if (this.elementTransition) { this.elementTransition.transition(this[`${mode}Container`]) }

        this.colorinputsmodechanged.emit(this.mode)
    }

    componentWillLoad() { this.updateValue(this.value) }

    render() {
        return <div
            class="color-inputs"
            data-mode={this.mode}
        >
            <drop-down onDropdownitemclicked={e => this.updateMode(e.detail.textContent)}>
                <div class="color-inputs-dropdown-label" slot="label">{this.mode}</div>
                <div class="color-inputs-dropdown-item" slot="item">hex</div>
                <div class="color-inputs-dropdown-item" slot="item">rgb</div>
                <div class="color-inputs-dropdown-item" slot="item">hsl</div>
            </drop-down>
            <element-transition ref={el => this.elementTransition = el as HTMLElementTransitionElement} speed={1}>
                <div class="color-inputs-row color-inputs-row-rgb" ref={el => this.rgbContainer = el as HTMLElement}>
                    <field-number label="R" value={this.colorObject.r} autowidth onInput={constrainRgb} onBlur={e => this.mergeValue('r', rgbValue(e))}></field-number>
                    <field-number label="G" value={this.colorObject.g} autowidth onInput={constrainRgb} onBlur={e => this.mergeValue('g', rgbValue(e))}></field-number>
                    <field-number label="B" value={this.colorObject.b} autowidth onInput={constrainRgb} onBlur={e => this.mergeValue('b', rgbValue(e))}></field-number>
                    <field-number label="A" value={Math.round(this.colorObject.a * 100)} autowidth onInput={constrainAlpha} onBlur={e => this.mergeValue('a', percentValue(e) / 100)}></field-number>
                </div>
                <div class="color-inputs-row color-inputs-row-hsl" ref={el => this.hslContainer = el as HTMLElement}>
                    <field-number label="H" value={this.colorObject.h} autowidth onBlur={e => this.mergeValue('h', hueValue(e))}></field-number>
                    <field-number label="S" value={this.colorObject.s} autowidth onBlur={e => this.mergeValue('s', percentValue(e))}></field-number>
                    <field-number label="L" value={this.colorObject.l} autowidth onBlur={e => this.mergeValue('l', percentValue(e))}></field-number>
                    <field-number label="A" value={Math.round(this.colorObject.a * 100)} autowidth onBlur={e => this.mergeValue('a', percentValue(e) / 100)}></field-number>
                </div>
                <div class="color-inputs-row color-inputs-row-hex" ref={el => this.hexContainer = el as HTMLElement}>
                    <field-text value={this.colorObject.hex} autowidth onBlur={e => this.mergeValue('hex', constrainHex(e))}></field-text>
                </div>
            </element-transition>
        </div>
    }
}

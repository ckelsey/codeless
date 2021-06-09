/** TODO/NOTE: margins on elements without a wrapping element can mess up height */
import { Component, Element, Event, h, Method, Prop, State, Watch } from '@stencil/core'
import ArrayFrom from '../../../../utils/conversion/array-from'
import Timer from '../../../../utils/timing/timer'
import EaseInOut from '../../../../utils/animation/ease-in-out'
import Get from '../../../../utils/objects/get'

export interface CurrentTransition {
    from: HTMLElement | undefined
    to: HTMLElement | undefined
    fromContainer: HTMLElement
    toContainer: HTMLElement
    canceled: boolean
    startHeight: number
    endHeight: number
    host: HTMLElementTransitionElement
    speed: number
    animateHeight: {
        start: Function
        cancel?: Function
    },
    animateFade: {
        start: Function,
        cancel?: Function
    }
}

function animator(from, to, speed, stepFn) {
    const timer = Timer(stepFn, EaseInOut([from, to], speed))

    return {
        then: timer ? timer.then : fn => { fn() },
        cancel: timer ? timer.cancel : () => { }
    }
}

function removeChild(el: HTMLElement) {
    try { el.parentElement.removeChild(el) } catch (error) { }
}

function animateHeight({ startHeight, endHeight, host, speed }: CurrentTransition) {
    return animator(startHeight, endHeight, speed, heightStep => host.style.height = ''.concat(heightStep, 'px'))
}

function animateOpacity(fromOpacity, toOpacity, el, speed) {
    return animator(fromOpacity, toOpacity, speed, opacityStep => el.style.opacity = opacityStep)
}

function elementOpacity(el, opacity = 1) {
    return Get(el, 'style.opacity', opacity, val => val === '' ? opacity : parseFloat(val))
}

function transitionFade({ fromContainer, toContainer, speed }: CurrentTransition) {
    const result = {
        current: animateOpacity(elementOpacity(fromContainer), 0, fromContainer, speed * 0.75),
        next: animateOpacity(elementOpacity(toContainer, 0), 1, toContainer, speed * 1.1),
        promise: undefined
    }

    result.promise = Promise.all([result.current, result.next])

    return result
}

function endTransition({ host, from, to, fromContainer, toContainer }: CurrentTransition) {
    if (from && from.getAttribute('slot') !== 'hidden') { from.setAttribute('slot', 'hidden') }
    if (to && to.getAttribute('slot') !== 'current') { to.setAttribute('slot', 'current') }
    toContainer.removeAttribute('style')
    fromContainer.removeAttribute('style')
    host.style.removeProperty('height')
}

@Component({
    tag: 'element-transition',
    styleUrl: 'style.scss',
    shadow: true
})

export class ElementTransition {
    @Element() host

    @Prop() speed: number = 382
    @Prop() removeinactive: boolean = false
    @Watch('removeinactive') removeinactiveWatcher() { if (this.removeinactive) { this.removeHidden() } }

    @State() activeElement!: HTMLElement
    @State() initialized: boolean = false
    @State() currentTransition: CurrentTransition | undefined

    @Event() elementtransitioned
    @Event() elementtransitioning

    @Method() transition(nextElement) {
        return new Promise(resolve => {
            if (!nextElement) { return }

            if (this.currentTransition) {
                this.currentTransition.animateHeight.cancel()
                this.currentTransition.animateFade.cancel()
            }

            const previousElement = this.activeElement
            const activeElement = this.activeElement = nextElement

            const currentTransition: CurrentTransition = {
                from: previousElement,
                to: activeElement,
                fromContainer: this.activeContainer,
                toContainer: this.nextContainer,
                canceled: false,
                host: this.host,
                speed: this.speed,
                startHeight: !previousElement ? this.host.offsetHeight : previousElement.offsetHeight,
                endHeight: activeElement.offsetHeight,
                animateHeight: { start: () => currentTransition.animateHeight.cancel = animateHeight(currentTransition).cancel.bind(this) },
                animateFade: {
                    start: () => {
                        const timer = transitionFade(currentTransition)
                        const cancel = () => {
                            currentTransition.canceled = true
                            timer.current.cancel()
                            timer.next.cancel()
                            reset()
                        }

                        currentTransition.animateFade.cancel = cancel.bind(this)

                        timer.promise.then(() => endTransition(currentTransition))
                            .then(() => this.elementtransitioned.emit(currentTransition))
                            .then(() => this.currentTransition = undefined)
                            .then(() => resolve(this))
                    }
                }
            }

            this.currentTransition = currentTransition

            this.elementtransitioning.emit(currentTransition)
            activeElement.setAttribute('slot', 'next')
            currentTransition.animateHeight.start()
            currentTransition.animateFade.start()

            const reset = () => {
                if (activeElement) { activeElement.setAttribute('slot', 'hidden') }
                if (previousElement) { activeElement.setAttribute('slot', 'current') }
                this.host.style.removeProperty('height')
            }
        })

    }

    removeHidden() {
        ArrayFrom(this.hiddenContainer.querySelector('slot').assignedNodes())
            .forEach(removeChild)
    }

    activeContainer!: HTMLElement
    hiddenContainer!: HTMLElement
    nextContainer!: HTMLElement
    unsortedContainer!: HTMLElement

    render() {
        return <div class="element-transition">
            <div class="element-transition-inner">
                <div class="unsorted-content" ref={el => this.unsortedContainer = el as HTMLElement}>
                    <slot onSlotchange={() => {
                        const newElements = ArrayFrom(this.unsortedContainer.querySelector('slot').assignedNodes()).filter(el => el.nodeName !== '#text')

                        if (!!this.activeElement) { return newElements.forEach(el => this.transition(el)) }

                        newElements.forEach(el => el.setAttribute('slot', 'hidden'))
                        this.transition(newElements[newElements.length - 1])
                    }}></slot>
                </div>
                <div class="next-slot" ref={el => this.nextContainer = el as HTMLElement}>
                    <slot name="next" />
                </div>
                <div class="current-slot" ref={el => this.activeContainer = el as HTMLElement}>
                    <slot name="current" />
                </div>
                <div class="hidden-slot" ref={el => this.hiddenContainer = el as HTMLElement}>
                    <div class="hidden-slot-inner">
                        <slot name="hidden" />
                    </div>
                </div>
            </div>
        </div>
    }
}

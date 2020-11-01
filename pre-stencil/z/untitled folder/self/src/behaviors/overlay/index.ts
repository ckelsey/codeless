/** TODO MOVE EXPAND/OPACITY TO OWN BEHAVIOR */

import Timer from '../../utils/timing/timer'
import EaseInOut from '../../utils/animation/ease-in-out'
import Pipe from '../../utils/function-helpers/pipe'
import IndexOf from '../../utils/checks/index-of'
import IfInvalid from '../../utils/checks/if-invalid'
import ToNumber from '../../utils/conversion/to-number'
import DispatchEvent from '../../utils/dom/dispatch-event'
import { ComponentElement, OverlayElement } from '../../component-builder/component'
import Get from '../../utils/objects/get'
import Set from '../../utils/objects/set'

export type AlignmentOption = 'center' | 'left' | 'right' | 'top' | 'bottom' | 'center center' | 'center top' | 'center bottom' | 'left center' | 'left top' | 'left bottom' | 'right center' | 'right top' | 'right bottom';
const alignments: AlignmentOption[] = ['center', 'left', 'right', 'top', 'bottom', 'center center', 'center top', 'center bottom', 'left center', 'left top', 'left bottom', 'right center', 'right top', 'right bottom']

export type WidthBasisOption = 'content' | 'parent'
const widthBasisOptions: WidthBasisOption[] = ['content', 'parent']

export interface PositionsObject {
    parent: HTMLElement | ComponentElement | OverlayElement
    parentBox: DOMRect
    target: HTMLElement | ComponentElement | OverlayElement
    targetBox: DOMRect
    windowHeight: number
    windowWidth: number
    isOnTop: boolean
    outOfView: boolean
    targetLeft: number
    targetTop: number
    leftShift: number
}

export interface OverlayObject {
    parent: Element | HTMLElement | ComponentElement | OverlayElement
    target: Element | HTMLElement | ComponentElement | OverlayElement
    showing: boolean
    align: AlignmentOption
    speed: number
    widthbasis: WidthBasisOption
    positionTimer1: any
    positionTimer2: any
    getPositions: () => Promise<PositionsObject>
    scrollContent: (x: number, y: number) => void
    show: () => Promise<any>
    hide: () => Promise<any>
    position: Promise<PositionsObject>
}


function animator(points: number[], speed: number, stepFn: (frame: number[]) => any) {
    return Timer(
        stepFn,
        EaseInOut(points, speed)
    )
}

function setPositions(state: OverlayObject) {
    clearTimeout(state.positionTimer1)
    cancelAnimationFrame(state.positionTimer2)

    const parent = state.parent

    if (!state.showing || !parent) { return }

    state.getPositions().then(function (positions) {
        clearTimeout(state.positionTimer1)
        cancelAnimationFrame(state.positionTimer2)

        if (positions.outOfView) { return state.hide() }

        if (positions.isOnTop) {
            positions.target.style.transformOrigin = '50% 100%'
            positions.target.style.top = `${positions.parentBox.top - positions.targetBox.height}px`
        } else {
            positions.target.style.transformOrigin = '50% 0%'
            positions.target.style.top = `${positions.parentBox.bottom}px`
        }

        if (positions.parentBox.left + positions.targetBox.width > positions.windowWidth) {
            if (positions.parentBox.right > positions.windowWidth) {
                positions.target.style.left = `${(positions.windowWidth - positions.targetBox.width) + positions.leftShift}px`
            } else {
                positions.target.style.left = `${(positions.parentBox.right - positions.targetBox.width) + positions.leftShift}px`
            }
        } else {
            positions.target.style.left = `${positions.parentBox.left + positions.leftShift}px`
        }

        state.positionTimer1 = setTimeout(() => {
            state.positionTimer2 = requestAnimationFrame(() => setPositions(state))
        }, 33)
    })
}

export default function Overlay(
    parent: OverlayElement | HTMLElement | ComponentElement,
    target: OverlayElement | HTMLElement | ComponentElement,
    { align, speed, widthbasis } = { align: 'center', speed: 100, widthbasis: 'content' }
) {
    target.classList.add('overlay-content-target')

    const state: OverlayObject = {
        parent,
        target,

        showing: false,

        align: Pipe(IndexOf(alignments), IfInvalid('center'))(align),
        speed: Pipe(ToNumber, IfInvalid(100))(speed),
        widthbasis: Pipe(IndexOf(widthBasisOptions), IfInvalid('content'))(widthbasis),

        positionTimer1: null,
        positionTimer2: null,

        get position() {
            return state.getPositions()
        },

        getPositions: () => new Promise<PositionsObject>(resolve => requestAnimationFrame(() => {
            const parentBox = parent.getBoundingClientRect()
            const targetBox = target.getBoundingClientRect()

            const windowWidth = window.innerWidth
            const windowHeight = window.innerHeight
            const spaceAbove = parentBox.top
            const spaceBelow = windowHeight - (parentBox.top + parentBox.height)
            const isOnTop = spaceAbove > spaceBelow
            const outOfView = parentBox.top - 10 > windowHeight || parentBox.bottom + 10 < 0
            const targetLeft = Get(target, 'offsetLeft', 0)

            return resolve({
                parent,
                parentBox,
                target,
                targetBox,
                windowHeight,
                windowWidth,
                isOnTop,
                outOfView,
                targetLeft,
                targetTop: Get(target, 'offsetTop', 0),
                // This is important as if an ancestor has any transforms, 
                // it will cause fixed position to be relative to that ancestor
                leftShift: targetLeft - Math.round(targetBox.left)
            })
        })),

        scrollContent: (x, y) => {
            target.scrollTop = y
            target.scrollLeft = x
        },

        show: () => {
            if (state.showing) { return Promise.resolve() }
            state.showing = true

            setPositions(state)

            Set(target, 'style.pointerEvents', 'all')
            Set(target, 'style.zIndex', '999')

            return animator(
                [0, 1],
                state.speed,
                function (scalePoint) {
                    Set(target, 'style.transform', `scale(1, ${scalePoint})`)
                    Set(target, 'style.opacity', scalePoint)
                }).then(function () {
                    Set(target, 'style.transform', 'scale(1, 1)')
                    Set(target, 'style.opacity', 1)
                    DispatchEvent(target, 'shown', state)
                })
        },

        hide: () => {
            if (!state.showing) { return Promise.resolve() }

            Set(target, 'style.pointerEvents', 'none')
            Set(target, 'style.zIndex', -1)

            return new Promise(resolve => {
                state.showing = false
                Set(target, 'style.transform', 'scale(1, 0)')
                Set(target, 'style.opacity', 0)
                resolve(DispatchEvent(target, 'hidden', state))
            })
        }
    }

    return state
}
import ID from '../id'
import DispatchEvent from '../dom/dispatch-event'

const draggables: { _current?: any } = {}
const defaultHandler = (_api?: DragApi): void => { }

export interface DragOptions {
    target: HTMLElement
    container?: HTMLElement
    onMove?: typeof defaultHandler
    onStart?: typeof defaultHandler
    onStop?: typeof defaultHandler
    startOnContainer?: boolean
    contained?: boolean
}

export interface DragApi {
    target: HTMLElement
    container: HTMLElement
    dragging: boolean
    contained: boolean
    stop: () => void
    start: (e: MouseEvent) => void
    dispose: () => void
    onMove: typeof defaultHandler
    onStart: typeof defaultHandler
    onStop: typeof defaultHandler
    startXDistance: number
    startYDistance: number
    x: number
    y: number
    width: number
    height: number
    containerX: number
    containerY: number
    containerWidth: number
    containerHeight: number
    percentX: number
    percentY: number
}

export default function Drag({
    target,
    onMove = defaultHandler,
    onStart = defaultHandler,
    onStop = defaultHandler,
    startOnContainer = false,
    contained = true
}: DragOptions) {
    return new Promise((resolve, reject) => {
        if (!target) { return reject() }

        if (target['_drag'] && typeof target['_drag'].dispose == 'function') { target['_drag'].dispose() }

        const container = target.offsetParent as HTMLElement

        const id = ID()

        const overStart = (eventPosition: number,
            targetPosition: number,
            targetDimension: number,
            containerPosition: number
        ) => {
            const total = targetDimension + containerPosition
            return eventPosition - targetPosition <= total ? eventPosition - targetPosition : total
        }

        const underStart = (
            eventPosition: number,
            containerPosition: number
        ) => eventPosition <= containerPosition ? containerPosition : eventPosition

        const constrain = (
            valueToTest: number,
            startToTest: number,
            eventPosition: number,
            containerDimension: number,
            containerPosition: number,
            targetDimension: number,
            targetPosition: number
        ) => {
            let start = startToTest
            let value = valueToTest

            if (valueToTest + targetDimension > containerDimension) {
                start = overStart(eventPosition, targetPosition, targetDimension, containerPosition)
                value = containerDimension - targetDimension
            } else if (valueToTest <= 0) {
                start = underStart(eventPosition, containerPosition)
                value = 0
            }

            return { start, value }
        }

        const handleDrag = (e: MouseEvent) => {
            let x = e.x - api.startXDistance
            let y = e.y - api.startYDistance

            if (api.contained) {
                const constrainedX = constrain(x, api.startXDistance, e.x, api.containerWidth, api.containerX, api.width, api.x)
                const constrainedY = constrain(y, api.startYDistance, e.y, api.containerHeight, api.containerY, api.height, api.y)

                x = constrainedX.value
                api.startXDistance = constrainedX.start

                y = constrainedY.value
                api.startYDistance = constrainedY.start
            }

            Object.assign(api, {
                x, y,
                percentX: (x / api.containerWidth) * 100,
                percentY: !y ? 0 : (y / api.containerHeight) * 100
            })

            api.onMove(api)
            DispatchEvent(target, 'moving', api)
        }

        const stop = () => {
            api.dragging = false
            window.removeEventListener('mousemove', handleDrag)
            window.removeEventListener('mouseup', stop)
            document.body.style.removeProperty('user-select')
            target.setAttribute('dragging', 'false')
            api.onStop(api)
            DispatchEvent(target, 'stopmove', api)
        }

        const getDimensions = (x: number, y: number) => {
            const containerX = container.offsetLeft
            const containerY = container.offsetTop
            const containerWidth = container.offsetWidth
            const containerHeight = container.offsetHeight

            return {
                x,
                y,
                width: target.offsetWidth,
                height: target.offsetHeight,
                containerX,
                containerY,
                containerWidth,
                containerHeight,
                percentX: ((x - containerX) / containerWidth) * 100,
                percentY: ((y - containerY) / containerHeight) * 100
            }
        }

        const start = (e: MouseEvent) => {
            if (draggables._current && draggables[draggables._current].dragging) {
                draggables[draggables._current].stop()
            }

            draggables._current = id

            const x = target.offsetLeft
            const y = target.offsetTop

            Object.assign(api, {
                startXDistance: e.x - x,
                startYDistance: e.y - y,
                dragging: true,
                ...getDimensions(x, y)
            })

            window.addEventListener('mousemove', handleDrag)
            window.addEventListener('mouseup', stop)
            document.body.style.userSelect = 'none'
            target.setAttribute('dragging', 'true')

            api.onStart(api)
            DispatchEvent(target, 'startmove', api)
        }

        const dispose = () => {
            target.removeEventListener('mousedown', api.start)
            delete draggables[id]
            delete draggables._current
            delete target['_drag']
            target.style.removeProperty('left')
        }

        const x = target.offsetLeft
        const y = target.offsetTop

        const api: DragApi = {
            target,
            container,
            dragging: false,
            contained: contained,
            stop,
            start,
            dispose,
            onMove,
            onStart,
            onStop,
            startXDistance: 0,
            startYDistance: 0,
            ...getDimensions(x, y)
        }

        const triggerEl: any = startOnContainer ? container : target

        triggerEl.addEventListener('mousedown', api.start)

        draggables[id] = target['_drag'] = api

        return resolve(api)
    })
}

(window as any).draggables = draggables
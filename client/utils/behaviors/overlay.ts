const alignments = ['center', 'top', 'bottom', 'left', 'right'] as const

export interface OverlayOptions {
    target: HTMLElement
    attachedTo?: HTMLElement
    align?: typeof alignments[number]
    startXFrom?: typeof alignments[number]
    startYFrom?: typeof alignments[number]
}

export interface OverlayApi {
    target: HTMLElement
    attachedTo?: HTMLElement
    align?: typeof alignments[number]
    startXFrom?: typeof alignments[number]
    startYFrom?: typeof alignments[number]
    active: boolean
    dispose: () => void
}

export default function Overlay({
    target,
    attachedTo = null,
    align = alignments[0],
    startXFrom = alignments[0],
    startYFrom = alignments[0]
}: OverlayOptions): Promise<OverlayApi> {

    return new Promise((resolve, reject) => {
        if (!target) { return reject() }

        let active = false

        const setStyles = isActive => {
            target.style.opacity = isActive ? '1' : '0'
            target.style.pointerEvents = isActive ? 'all' : 'none'
            target.style.transform = isActive ?
                `translateX(-50%) translateY(50%)` :
                `translateX(${api.align === 'left' ?
                    'calc(-100vw - 100%)' :
                    api.align === 'right' ?
                        '100vw' :
                        '-50%'
                }) translateY(${api.align === 'left' || api.align === 'right' ?
                    '-50%' :
                    api.align === 'bottom' ?
                        '100vh' :
                        'calc(-100vh + -100%)'
                })`
        }


        const api: OverlayApi = {
            get active() { return active },
            set active(is: boolean) {
                active = is
                setStyles(is)
            },
            target,
            attachedTo,
            align,
            startXFrom,
            startYFrom,
            dispose() {

            }
        }

        target.style.opacity = '0'
        target.style.position = 'fixed'
        target.style.top = target.style.left = '50%'
        target.style.transition = 'opacity 0.2s, transform 0.2s'

        setStyles(false)

        return resolve(api)
    })
}
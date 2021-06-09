/**
 * oncancel
 */
import Debounce from "../timing/debounce"
import ScreenCapture from "./screen-capture"

export interface ScreenShareObject {
    stream: null | MediaStream
    frame: () => Promise<Blob>
    isSharing: boolean
    start: (options?: undefined | MediaStreamConstraints) => Promise<MediaStream>
    stop: () => void
    can: boolean
    onEnd: (callback: Function) => void
}

const eventCallbacks = {
    ended: []
}

const ScreenShare: ScreenShareObject = {
    stream: null,

    start(options?: MediaStreamConstraints) {
        if (ScreenShare.stream) { ScreenShare.stop() }

        return new Promise((resolve, reject) => {
            try {
                (navigator.mediaDevices as any)
                    .getDisplayMedia(options)
                    .then((stream: MediaStream) => {
                        ScreenShare.stream = stream

                        const endedDebounce = Debounce(() => eventCallbacks.ended.forEach(callback => typeof callback !== 'function' ? undefined : callback(stream)), 0)

                        stream.getTracks().forEach(track => track.addEventListener('ended', endedDebounce))

                        resolve(stream)
                    })
                    .catch(reject)
            } catch (error) {
                return reject(error)
            }
        })
    },

    stop() {
        if (!ScreenShare.stream) { return }
        try { ScreenShare.stream.getTracks().forEach(track => track.stop()) } catch (error) { }
        ScreenShare.stream = null
    },

    frame() {
        return new Promise((resolve, reject) => {
            if (!ScreenShare.stream) { return reject('ScreenShare has not been started') }

            ScreenCapture(ScreenShare.stream)
                .then(resolve)
                .catch(reject)
        })
    },

    get isSharing() { return !!ScreenShare.stream },
    get can() { return (window.navigator.mediaDevices && 'getDisplayMedia' in window.navigator.mediaDevices) },

    onEnd(callback) {
        eventCallbacks.ended.push(callback)
    }
}


export default ScreenShare
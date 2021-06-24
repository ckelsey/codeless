/** TODO
 * Fuck, idk
 * scan pixels
 * crop image
 * find color
 * scoop on cursor
 * overlay message on how it works
 */
import { Component, Element, Event, h } from '@stencil/core'
import ColorObject from '../../../../utils/color/color-object'
import PixelFromMedia from '../../../../utils/media/pixel-from-media'
import ScreenShare from '../../../../utils/media/screen-share'

// function createOverlay() {
//     const overlay = document.createElement('div')

//     Object.assign(overlay.style, {
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         width: '100%',
//         height: '100%',
//         zIndex: 99999999,
//         cursor: 'none'
//     })

//     document.body.appendChild(overlay)

//     return overlay
// }

@Component({
    tag: 'eye-dropper',
    styleUrl: 'style.scss',
    shadow: true
})

export class EyeDropper {
    @Element() host

    @Event() eyedropperpick

    container!: HTMLElement
    scope!: HTMLElement
    scopeCanvas!: HTMLCanvasElement

    startShare() {
        ScreenShare.start()
            .then(() => {
                // const video = document.createElement('video')
                // const ctx = this.scopeCanvas.getContext('2d')
                // const { width, height } = stream.getVideoTracks()[0].getSettings()
                // video.muted = true
                // video.width = this.scopeCanvas.width = width
                // video.height = this.scopeCanvas.height = height
                // video.srcObject = stream

                function _paintCanvas() {
                    // this.scopeCanvas.style.top = `${-window.screenTop - (window.outerHeight - window.innerHeight)}px`
                    // this.scopeCanvas.style.left = `${-window.screenLeft}px`

                    // video.play()
                    // video.ontimeupdate = function () {
                    //     console.log('time')
                    //     ctx.drawImage(video, 0, 0)
                    //     video.ontimeupdate = null
                    //     video.pause()
                    // }

                    // ScreenShare.frame().then(image=>{

                    // })
                }

                function _onClick(e) {
                    window.removeEventListener('click', onClick)

                    if (!ScreenShare.isSharing) { return }

                    const { screenX, screenY, y } = e
                    console.log(screenY, y, e)

                    ScreenShare.frame()
                        .then(image => new Promise(resolve => {
                            const img = document.createElement('img')
                            const url = window.URL.createObjectURL(image)
                            img.onload = () => {
                                document.body.appendChild(img)
                                window.URL.revokeObjectURL(url)

                                const { r, g, b } = PixelFromMedia(img, screenX, screenY)

                                this.eyedropperpick.emit(ColorObject(`rgb(${r}, ${g}, ${b})`))

                                resolve(undefined)
                            }
                            img.src = url
                        }))
                        .then(ScreenShare.stop)
                }

                const onClick = _onClick.bind(this)
                const paintCanvas = _paintCanvas.bind(this)

                window.addEventListener('click', onClick)
                paintCanvas()

                ScreenShare.onEnd((e) => console.log(e))
            })
            .catch(() => { })
    }

    componentDidLoad() {
        if (!ScreenShare.can) {
            try { this.host.remove() } catch (error) { }
        }
    }

    render() {
        return <div class="eye-dropper" onClick={() => this.startShare()} ref={el => this.container = el}>
            <div class="scope" ref={el => this.scope = el}>
                <canvas ref={el => this.scopeCanvas = el}></canvas>
            </div>
            <icon-element kind="eyedropper"></icon-element>
        </div>
    }
}

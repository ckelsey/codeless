function drawImageUrl(canvas: HTMLCanvasElement, video: HTMLVideoElement) {
    canvas.width = video.width
    canvas.height = video.height
    canvas.getContext('2d').drawImage(video, 0, 0, video.width, video.height)
    return canvas
}

function videoPlays(video: HTMLVideoElement, stream, stopStream = true) {
    video.ontimeupdate = null
    video.pause()

    if (stopStream) { stream.getTracks().forEach(track => track.stop()) }

    return drawImageUrl(document.createElement('canvas'), video)
}

const runVideo = (video, stream, stopStream = true): Promise<Blob> => new Promise(resolve => {
    const { width, height } = stream.getVideoTracks()[0].getSettings()
    video.setAttribute('muted', 'true')
    video.setAttribute('autoplay', 'true')
    video.setAttribute('width', width)
    video.setAttribute('height', height)
    video.ontimeupdate = function () { videoPlays(video, stream, stopStream).toBlob(resolve) }
    video.srcObject = stream
})

const initVideo = (video, stopStream) => stream => runVideo(video, stream, stopStream)

function ScreenCapture(stream?: MediaStream): Promise<Blob> {
    if (!!stream) { return initVideo(document.createElement('video'), false)(stream) }

    return (navigator.mediaDevices as any)
        .getDisplayMedia({
            video: {
                mediaSource: 'window',
                cursor: 'never'
            },
            audio: false
        })
        .then(initVideo(document.createElement('video'), true))
}

export default ScreenCapture
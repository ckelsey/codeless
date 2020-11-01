export default function DOMReady() {
    return new Promise((resolve) => {
        return document.readyState !== 'loading' ?
            resolve() :
            document.addEventListener('DOMContentLoaded', resolve)
    })
}
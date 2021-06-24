import { ComponentElement } from './component'
export default function WhenState(host: ComponentElement) {
    return new Promise(resolve => {
        let max = 100
        const has = () => {
            max = max - 1

            if (host.state) {
                const keys = Object.keys(host.state)
                if (keys.length && typeof host.state[keys[0]].subscribe == 'function') {
                    return requestAnimationFrame(() => resolve(host.state))
                }
            }

            if (max > 0) { requestAnimationFrame(has) }
        }

        has()
    })
}
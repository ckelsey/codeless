export default function Try(fn: Function, elseFn: any = () => { }) {
    try {
        return fn()
    } catch (error) {
        try {
            return fn.apply(null)
        } catch (error) {
            if (typeof elseFn !== 'function') { return elseFn }
            return elseFn()
        }
    }
}
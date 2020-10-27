import Get from "../objects/get"

export default function InputMethods() {
    return {
        blur: (host: any) => () => {
            Get(host, 'elements.input.blur()')
            host.focused = false
        },
        focus: (host: any) => () => {
            Get(host, 'elements.input.checkfocusValidity()')
            host.focused = true
        },
        checkValidity: (host: any) => () => Get(host, 'elements.input.checkValidity()'),
        reportValidity: (host: any) => () => Get(host, 'elements.input.reportValidity()'),
    }
}
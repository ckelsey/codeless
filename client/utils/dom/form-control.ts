const onSubmit = (input: HTMLInputElement) => () => {
    if (!input) { return }
    if (input.validationMessage) { (this || {} as any).error = input.validationMessage }
}

const FormControl = (inputid: string, input: HTMLInputElement, form: HTMLFormElement) => {
    if (!form) { }

    const onSub = onSubmit(input).bind(this)

    if (!form.events) { form.events = {} }

    if (form.events[inputid] && typeof form.events[inputid] === 'function') {
        form.events[inputid]()
    }

    form.addEventListener('submit', onSub)
    form.events[inputid] = () => {
        form.removeEventListener('submit', onSub)
        delete form.events[inputid]
    }
}

export default FormControl
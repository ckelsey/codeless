import Pipe from "../function-helpers/pipe"
import ToBool from "../conversion/to-bool"
import IfInvalid from "../checks/if-invalid"
import IndexOf from '../checks/index-of'
import Get from "../objects/get"
import ToString from "../conversion/to-string"
import ValidateHtml from "../validate/html"
import ToNumber from "../conversion/to-number"
import ToRegex from "../conversion/to-regex"
import { ComponentElement, ComponentProperties } from "./component"
import ID from "../id"
import { updateFocusState } from "./input-elements"

const boolOr = (def: boolean = false) => ({
    format: (val: any) => Pipe(
        ToBool,
        IfInvalid(def)
    )(val)
})

const validString = () => ({
    format: (val: any) => Pipe(
        ToString,
        IfInvalid(''),
        (value: string) => ValidateHtml(value).sanitized
    )(val)
})

const validNumber = (key: string) => ({
    format: (val: any, host: ComponentElement) => Pipe(
        ToNumber,
        IfInvalid(Get(host, key, 0))
    )(val)
})

function setAttr(value: any, host: ComponentElement, key: string) {
    const input = host.elements.input

    if (input) {
        input[!!value ? 'setAttribute' : 'removeAttribute'](key, !!value ? value : undefined)
    }
}

function getValueType(host: ComponentElement) {
    const input = host.elements.input
    let valueType = 'string'

    if (input) {
        const tag = input.tagName.toLowerCase()
        const type = input.type
        if (tag == 'input') {
            if (type == 'number') {
                valueType = 'number'
            }

            if (type == 'checkbox') {
                valueType = 'bool'
            }
        }

        if (tag == 'select') {
            valueType = 'bool|number|string'
        }
    }

    return valueType
}

function onChange(key: string) {
    return { onChange: (val: number, host: ComponentElement) => setAttr(val, host, key) }
}

export function AllInputProperties(): ComponentProperties {
    return {
        autocomplete: Object.assign(onChange('autocomplete'), boolOr(true)),

        autofocus: Object.assign(onChange('autofocus'), boolOr(false), { initialValue: false }),

        disabled: Object.assign(onChange('disabled'), boolOr(false), { initialValue: false }),

        error: {
            format: Pipe(
                ToString,
                IfInvalid(''),
                (value: string) => ValidateHtml(value).sanitized
            ),
            onChange(error, host) {
                const input = Get(host, 'elements.input')
                if (!input) { return }
                input.setCustomValidity(error || '')
            }
        },

        focused: {
            format: (_val: any, host: ComponentElement) => document.activeElement == Get(host, 'elements.input')
        },

        form: {
            format: (_val, host) => Get(host, 'elements.input.form')
        },

        helptext: validString(),

        iconalign: {
            format: (value: any, host: ComponentElement) => Pipe(
                ToString,
                IndexOf(['left', 'right']),
                IfInvalid(Get(host, 'iconalign', 'left')),
            )(value)
        },

        isempty: {
            format: (_val: any, host: ComponentElement) => {
                const value = Get(host, 'value')
                return value == '' || value == undefined
            },
            onChange(_isempty, host) {
                requestAnimationFrame(updateFocusState(Get(host, 'elements.input'), host, true))
            }
        },

        id: {
            format: Pipe(
                ToString,
                (val: any) => {
                    const id = ID()
                    return IfInvalid(id, val)
                }
            ),
            reflect: true
        },

        isvalid: {
            format: (_val: any, host: ComponentElement) => Get(host, 'elements.input.validity.valid')
        },

        label: {
            format: (val: any) => Pipe(
                ToString,
                IfInvalid(''),
                (value: string) => ValidateHtml(value).sanitized
            )(val)
        },

        labelalign: {
            format: (val: any) => Pipe(
                ToString,
                IndexOf(['top', 'inside']),
                IfInvalid('inside'),
                (value: string) => ValidateHtml(value).sanitized
            )(val),
            reflect: true,
            onChange(labelalign, host) {
                if (host.getAttribute('labelalign') !== labelalign) {
                    host.setAttribute('labelalign', labelalign)
                }
            }
        },

        name: Object.assign(onChange('name'), validString()),

        readonly: Object.assign(onChange('readonly'), boolOr(false), { initialValue: false }),

        required: Object.assign(onChange('required'), boolOr(false), { initialValue: false }),

        tabindex: Object.assign(onChange('tabindex'), validNumber('tabindex')),

        value: {
            format: (value: any, host: ComponentElement) => {
                const valueType = getValueType(host)

                if (valueType == 'number') {
                    return Pipe(ToNumber, IfInvalid(Get(host, 'value')))(value)
                }

                if (valueType == 'bool') {
                    const checked = Get(host, 'elements.input.checked')
                    return Pipe(ToBool, IfInvalid(Get(host, 'value', false)))(checked)
                }

                const validateString = Pipe(
                    ToString,
                    (value: string) => typeof value !== 'string' ? '' : value,
                    (value: string) => ValidateHtml(value).sanitized || ''
                )

                return validateString(value)
            }
        },

        validity: {
            format: (_val, host) => Get(host, 'elements.input.validity')
        },

        validationMessage: {
            format: (_val, host) => Get(host, 'elements.input.validationMessage')
        },

        willValidate: Object.assign(onChange('willValidate'), boolOr(true)),
    }
}

export function FieldInputProperties(): ComponentProperties {
    return {
        count: {
            format: (_val: any, host: ComponentElement) => !host.elements.input.value ? 0 : host.elements.input.value.length
        },

        showcount: boolOr(false),

        max: {
            format: (val: any, host: ComponentElement) => Pipe(ToNumber, IfInvalid(Get(host, 'max')))(val),
            onChange: (val, host) => setAttr(val, host, getValueType(host) == 'string' ? 'maxlength' : 'max')
        },
        min: {
            format: (val: any, host: ComponentElement) => Pipe(ToNumber, IfInvalid(Get(host, 'min')))(val),
            onChange: (val, host) => setAttr(val, host, getValueType(host) == 'string' ? 'min' : 'max')
        },
        pattern: {
            format: (val: any, host: ComponentElement) => Pipe(ToRegex, IfInvalid(Get(host, 'pattern')))(val),
            onChange: (val, host) => setAttr(val, host, 'pattern')
        },
    }
}
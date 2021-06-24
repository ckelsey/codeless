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
import IsNoValue from "../types/is-no-value"

const boolOr = (def: boolean = false) => ({ format: (val: any) => Pipe(ToBool, IfInvalid(def))(val) })
const validString = () => ({ format: (val: any) => Pipe(ToString, IfInvalid(''), (value: string) => ValidateHtml(value).sanitized)(val) })
const getInput = (host: ComponentElement) => Get(host, 'elements.input', Get(host, 'elements.input.0'))

export const autocomplete = () => boolOr(true)
export const autofocus = () => boolOr(false)
export const count = () => ({ format: (_val: any, host: ComponentElement) => !host.elements.input.value ? 0 : host.elements.input.value.length })
export const disabled = () => boolOr(false)
export const error = () => ({ format: Pipe(ToString, IfInvalid(''), (value: string) => ValidateHtml(value).sanitized) })
export const focused = () => ({ format: (_val: any, host: ComponentElement) => document.activeElement == getInput(host) })
export const form = () => ({ format: (_val: any, host: ComponentElement) => Get(getInput(host), 'form') })
export const helptext = () => validString()
export const iconalign = () => ({ format: Pipe(ToString, IndexOf(['left', 'right']), IfInvalid('left')) })
export const isempty = () => ({ format: (_val: any, host: ComponentElement) => IsNoValue(Get(host, 'value')) })
export const id = () => ({ format: Pipe(ToString, (val: any) => IfInvalid(ID(), val)), reflect: true })
export const isvalid = () => ({ format: (_val: any, host: ComponentElement) => Get(getInput(host), 'validity.valid') })
export const label = () => ({ format: (val: any) => Pipe(ToString, IfInvalid(''), (value: string) => ValidateHtml(value).sanitized)(val) })
export const labelalign = () => ({ format: Pipe(ToString, IndexOf(['top', 'inside']), IfInvalid('inside'), (value: string) => ValidateHtml(value).sanitized), reflect: true })
export const max = () => ({ format: Pipe(ToNumber, IfInvalid(undefined)) })
export const min = () => ({ format: Pipe(ToNumber, IfInvalid(undefined)) })
export const name = () => validString()
export const pattern = () => ({ format: Pipe(ToRegex, IfInvalid(undefined)) })
export const readonly = () => boolOr(false)
export const required = () => boolOr(false)
export const showcount = () => boolOr(false)
export const validity = () => ({ format: (_val: any, host: ComponentElement) => Get(getInput(host), 'validity') })
export const validationMessage = () => ({ format: (_val: any, host: ComponentElement) => Get(getInput(host), 'validationMessage') })
export const value = () => ({ format: (val: any) => val })
export const willValidate = () => boolOr(true)

export function AllInputProperties(): ComponentProperties {
    return {
        autocomplete: autocomplete(),
        autofocus: autofocus(),
        disabled: disabled(),
        error: error(),
        focused: focused(),
        form: form(),
        helptext: helptext(),
        iconalign: iconalign(),
        isempty: isempty(),
        id: id(),
        isvalid: isvalid(),
        label: label(),
        labelalign: labelalign(),
        name: name(),
        readonly: readonly(),
        required: required(),
        value: value(),
        validity: validity(),
        validationMessage: validationMessage(),
        willValidate: willValidate(),
    }
}

export function FieldInputProperties(): ComponentProperties {
    return {
        count: count(),
        max: max(),
        min: min(),
        pattern: pattern(),
        showcount: showcount(),
    }
}
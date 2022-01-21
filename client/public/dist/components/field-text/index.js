import Observer from "../../utils/observe/observer.js";
import EventObserver from "../../utils/observe/event-observer.js";
import Type from "../../utils/types/type.js";
import Pipe from "../../utils/function-helpers/pipe.js";
import ToBool from "../../utils/conversion/to-bool.js";
import ToNumber from "../../utils/conversion/to-number.js";
import IfInvalid from "../../utils/checks/if-invalid.js";
import { SantizedHTML } from "../../utils/validate/html.js";
import Create from "../../utils/dom/create.js";
import ID from "../../utils/id.js";
import SetAttribute from "../../utils/dom/set-attribute.js";
import IsNothing from "../../utils/checks/is-nothing.js";
import Get from "../../utils/objects/get.js";
import DispatchEvent from "../../utils/dom/dispatch-event.js";
import IfSelector from "../../utils/checks/if-selector.js";
import RemoveElement from "../../utils/dom/remove-element.js";
import IndexOf from "../../utils/checks/index-of.js";
import Try from "../../utils/try.js";
const html = "<div class=\"field-element-container\"><div class=\"field-element-container-inner\"><span class=\"icon-container icon-padding\"><slot name=\"iconleft\"></slot></span><div class=\"field-input-label\"><div class=\"field-label\"><slot name=\"label\"></slot></div><div class=\"field-input\"><slot name=\"input\"></slot></div></div><span class=\"icon-container error-icon\"><slot name=\"error-icon\"><svg xmlns=\"http://www.w3.org/2000/svg\" preserveAspectRatio=\"xMidYMid meet\" viewBox=\"0 0 24 24\" style=\"width:100%;fill:currentColor\"><path d=\"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z\"></path></svg></slot></span><span class=\"icon-container\"><slot name=\"iconright\"></slot></span></div><span class=\"field-input-bottom-container\"><span class=\"field-error-text\"><slot name=\"error\"></slot></span><span class=\"field-input-bottom\"><span class=\"field-help-text\"><slot name=\"help\"></slot></span><span class=\"field-count-text\"></span></span></span></div>";
const styles = "@keyframes rotating{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@keyframes onAutoFillStart{from{background:transparent}to{background:transparent}}@keyframes onAutoFillCancel{from{background:transparent}to{background:transparent}}@keyframes delayOverflowIn{0%{overflow:hidden}99%{overflow:hidden}100%{overflow:visible}}@keyframes delayOverflowOut{0%{overflow:visible}99%{overflow:visible}100%{overflow:hidden}}@keyframes fadeIn{0%{opacity:0}10%{opacity:0}100%{opacity:1}}@keyframes fadeOut{0%{opacity:1}100%{opacity:0}}:host{display:inline-block;max-width:100%;box-sizing:border-box;vertical-align:text-bottom;line-height:150%;font-size:inherit;color:inherit}:host *{box-sizing:border-box}:host([focused=\"true\"]) .field-element-container-inner{background-color:#fff}:host([disabled=\"true\"]) .field-element-container-inner{opacity:0.62}:host([error-message]:not([error-message=\"\"])) .field-element-container-inner{box-shadow:0 0 0 1px #df0700}:host .field-input-label{flex:1 0 50%;display:flex;flex-direction:column;justify-content:flex-start;align-items:flex-start;min-height:2.725em}:host .field-input{width:100%}:host .icon-container{position:relative;top:0;left:0;margin:0;width:auto;height:1.5em;max-width:2.5em;display:inline-flex;line-height:100%;font-size:inherit;pointer-events:none;color:rgba(34,34,34,0.75)}:host .icon-container slot[name=\"icon\"]{display:flex;height:1.5em;width:auto;max-width:2em;align-items:center;justify-content:flex-start;font-size:initial}:host .icon-container.icon-padding{padding-left:0.25em;margin-right:-0.25em}::slotted([slot=\"icon\"]){height:1.5em;width:1.5em;min-width:1.5em;min-height:1.5em;margin:0 0 0 0.62em}:host .field-input-bottom-container{display:block;padding:0em 0.125em;flex-grow:1;width:100%;color:inherit;font-size:70%;line-height:150%}:host .field-input-bottom-container .field-input-bottom{display:flex;justify-content:space-between;align-items:flex-start;flex-grow:1;width:100%;font-weight:100;opacity:0.62;color:inherit}:host .field-error-text{display:block;color:#df0700}.field-element-container-inner{position:relative;width:auto;max-width:100%;min-height:2.725em;display:flex;align-items:center;justify-content:flex-start;flex-wrap:wrap;background-color:#eee;border-radius:3px;transition:background-color 0.2s}:host .field-label{width:100%;min-height:1.05em;text-align:left;display:flex;align-items:center;transform:translateX(-0.2em) translateY(0.7em) translateZ(0px) scale(1);transform-origin:0 0;font-size:inherit;pointer-events:none;position:relative;line-height:150%;padding:0 0 0 0.75em;margin-bottom:-1.5em;color:rgba(34,34,34,0.62);transition:transform 0.2s, opacity 0.2s ease-in 0.062s}:host([focused=\"true\"]) .field-label,:host([empty=\"false\"]) .field-label{transform:translateX(0.2em) translateY(0.25em) translateZ(0) scale(0.7)}:host([required=\"true\"]) .field-label ::before{content:\"*\";color:#df0700;line-height:100%;position:relative;top:0.25em;margin-right:0.25em;font-style:italic}:host .error-icon{width:0em;color:#df0700;transition:width 0.2s}:host([error-message]:not([error-message=\"\"])) .error-icon{width:1.5em}::slotted([slot=\"input\"]){padding:1.3em 0.7em 0.3em;position:relative;margin:0;height:auto;width:100%;border-radius:3px;background-color:transparent;color:#222;border:none !important;box-sizing:border-box;height:100%;flex-grow:1;font-size:inherit;font-family:inherit;line-height:initial;outline:none !important;appearance:none;transition:color 0.2s, background-color 0.2s, background-position 0.2s, transform 0.2s}::slotted([slot=\"input\"])::-webkit-input-placeholder{color:transparent;opacity:0}::slotted([slot=\"input\"]):-webkit-input-placeholder{color:transparent;opacity:0}::slotted([slot=\"input\"]):-ms-input-placeholder{color:transparent;opacity:0}::slotted([slot=\"input\"])::placeholder{color:transparent;opacity:0}::slotted([slot=\"input\"]:focus){background-color:transparent}::slotted([slot=\"input\"]:-internal-autofill-selected){background-color:transparent !important}::slotted([slot=\"input\"]:-webkit-autofill),::slotted([slot=\"input\"]:-webkit-autofill:hover),::slotted([slot=\"input\"]:-webkit-autofill:focus),::slotted([slot=\"input\"]:-webkit-autofill:active){animation-name:onAutoFillStart;transition:background-color 50000s ease-in-out 0s}::slotted([slot=\"input\"]:not(:-webkit-autofill)){animation-name:onAutoFillCancel}";
const slotProperties = ['label', 'error', 'help', 'input', 'iconleft', 'iconright'];
const types = ['text', 'email', 'search', 'tel', 'url', 'password'];
const boolOrFalse = Pipe(ToBool, IfInvalid(false));
function htmlValue(value) { return typeof value === 'string' ? SantizedHTML(value) : SantizedHTML(Get(value, 'innerHTML', '')); }
function append(el) { return function (element) { el && !el.contains(element) ? el.appendChild(element) : undefined; }; }
function trueOrNull(value) { return value === true ? true : null; }
function stringOrNull(value) { return !!value && typeof value === 'string' ? value : null; }
function numberOrNull(value) { return IsNothing(value) ? null : Pipe(ToNumber, IfInvalid(null))(value); }
function setCountTextContent(countElement, text) { return countElement ? countElement.textContent = text : undefined; }
function setCountText(el) { return el.count ? setCountTextContent(el.countElement, `${Get(el.value, 'length', 0)}${el.max ? `/${el.max}` : ''}`) : undefined; }
function orRevert(conditionFunction, modifierFunction = (value) => value) {
    return function (value, observer) {
        return conditionFunction(value) ? modifierFunction(value) : observer ? observer.changed : undefined;
    };
}
function initialValue(host, key) {
    if (slotProperties.indexOf(key) > -1) {
        const child = host.querySelector(`[slot="${key}"]`);
        if (child) {
            return child;
        }
    }
    const attrValue = host.getAttribute(key);
    if (attrValue !== null) {
        return attrValue;
    }
    if (key === 'inputid') {
        return ID();
    }
    return propertyMeta[key].initial;
}
function queryShadow(el, selector) { return !el || !el.shadowRoot ? null : el.shadowRoot.querySelector(selector); }
function getSlot(el, name) { return queryShadow(el, `[name="${name}"]`); }
function elementCreateOptions(tag, slot) {
    return function (value) {
        return Create({ tag, attributes: { slot }, properties: { innerHTML: htmlValue(value) } });
    };
}
function createInput(_value) {
    return Create({ tag: 'input', attributes: { slot: 'input', placeholder: ' ' } });
}
function applyCreated(element) {
    element.createdOn = element.createdOn || new Date().getTime();
    return element;
}
function slotFormatter(createFn, applyFn = (v) => v, key) {
    return function formatter(value) {
        const type = Type(value);
        if (['string', 'dom'].indexOf(type) === -1) {
            value = '';
        }
        if (type === 'dom') {
            if (value.slot !== key) {
                value.slot = key;
            }
            return applyFn(value);
        }
        if (IfSelector(value)) {
            const element = document.body.querySelector(value);
            if (element) {
                if (element.slot !== key) {
                    element.slot = key;
                }
                return applyFn(element);
            }
        }
        const created = createFn(value);
        return applyFn(created);
    };
}
function slotEvent(host, name) {
    const slot = getSlot(host, name);
    if (!slot) {
        return;
    }
    const eventName = `${name}SlotChange`;
    if (!host.events[eventName]) {
        host.events[eventName] = EventObserver(slot, 'slotchange');
        host.events[eventName].subscribe(() => {
            const assigned = Array.from(slot.assignedNodes()).sort((a, b) => {
                const createdOnA = a.createdOn;
                const createdOnB = b.createdOn;
                return !createdOnA && !createdOnB ? 0 : !createdOnA ? 1 : !createdOnB ? -1 : createdOnA > createdOnB ? 1 : -1;
            });
            const next = assigned.pop();
            if (next && !next.isSameNode(host.state[name].value)) {
                host.state[name].next(next);
            }
            while (assigned.length) {
                RemoveElement(assigned.pop());
            }
        });
    }
}
const propertyMeta = {
    autocomplete: {
        initial: 'on',
        inputAttribute: true,
        formatter: (value) => {
            if (value === 'true' || value === true) {
                return 'on';
            }
            if (value === 'false' || value === false) {
                return 'off';
            }
            if (typeof value !== 'string') {
                return null;
            }
            return value;
        }
    },
    autofocus: {
        initial: false,
        inputAttribute: true,
        formatter: boolOrFalse,
        matchType: true
    },
    count: {
        initial: false,
        formatter: boolOrFalse,
        matchType: true
    },
    disabled: {
        initial: false,
        inputAttribute: true,
        formatter: boolOrFalse,
        matchType: true
    },
    error: {
        initial: '',
        formatter: slotFormatter(elementCreateOptions('div', 'error'), applyCreated, 'error')
    },
    help: {
        initial: '',
        formatter: slotFormatter(elementCreateOptions('div', 'help'), applyCreated, 'help')
    },
    iconleft: {
        initial: '',
        formatter: slotFormatter(elementCreateOptions('div', 'iconleft'), applyCreated, 'iconleft')
    },
    iconright: {
        initial: '',
        formatter: slotFormatter(elementCreateOptions('div', 'iconright'), applyCreated, 'iconright')
    },
    input: {
        initial: null,
        formatter: slotFormatter(createInput, applyCreated, 'input')
    },
    inputid: {
        initial: '',
        inputAttribute: true,
        matchType: true,
        formatter: orRevert(value => !!value && typeof value === 'string')
    },
    label: {
        initial: '',
        formatter: slotFormatter(elementCreateOptions('label', 'label'), applyCreated, 'label')
    },
    max: {
        initial: null,
        inputAttribute: true,
        formatter: numberOrNull
    },
    min: {
        initial: null,
        inputAttribute: true,
        formatter: numberOrNull
    },
    name: {
        initial: '',
        inputAttribute: true,
        formatter: stringOrNull
    },
    pattern: {
        initial: null,
        inputAttribute: true,
        formatter: stringOrNull
    },
    required: {
        initial: false,
        inputAttribute: true,
        formatter: boolOrFalse,
        matchType: true
    },
    type: {
        initial: 'text',
        inputAttribute: true,
        matchType: true,
        formatter: Pipe((value) => Try(() => value.toLowerCase()), IndexOf(types), IfInvalid(types[0]))
    },
    value: {
        initial: null,
        inputAttribute: true,
        formatter: (host) => (newValue, observer) => {
            if (!host.state.disabled || !host.disabled) {
                if (typeof newValue === 'string') {
                    return newValue;
                }
            }
            if (observer) {
                return observer.changed;
            }
        }
    }
};
function getInputAttributes() {
    return Object.keys(propertyMeta)
        .reduce((result, key) => propertyMeta[key].inputAttribute ? result.concat([key]) : result, []);
}
function updateInputAttributes(el, changedAttributeKeys = getInputAttributes()) {
    if (!el || !el.state) {
        return;
    }
    const input = el.input;
    const label = el.label;
    if (!input) {
        return;
    }
    changedAttributeKeys.forEach(attr => {
        const value = el.state[attr].value;
        if (attr === 'value') {
            if (el.state.disabled && el.state.disabled.value === true) {
                return;
            }
            if (input.value !== value && value !== undefined) {
                input.value = value;
            }
            setCountText(el);
            el.setLabelPosition();
            const validationMessage = el.validationMessage;
            if (el.error && !validationMessage) {
                el.error = validationMessage;
            }
            return;
        }
        if (attr === 'max') {
            setCountText(el);
            return SetAttribute(input, 'maxlength', value);
        }
        if (attr === 'min') {
            return SetAttribute(input, 'minlength', value);
        }
        if (attr === 'inputid') {
            SetAttribute(label, 'for', value);
            return SetAttribute(input, 'id', value);
        }
        if (['required', 'disabled'].indexOf(attr) > -1) {
            return SetAttribute(input, attr, trueOrNull(value));
        }
        if (attr === 'autofocus') {
            const autofocus = trueOrNull(value);
            SetAttribute(input, attr, autofocus);
            if (autofocus) {
                input.focus();
            }
            else if (el.focused) {
                input.blur();
            }
            return;
        }
        SetAttribute(input, attr, value);
    });
}
function subscribeStates(el) {
    el.state.input.subscribe((input) => {
        SetAttribute(input, 'placeholder', ' ');
        append(el)(input);
        el.inputid = input.id || el.inputid;
        updateInputAttributes(el);
    });
    el.state.label.subscribe((label) => {
        append(el)(label);
        updateInputAttributes(el);
    });
    el.state.help.subscribe(append(el));
    el.state.iconleft.subscribe(append(el));
    el.state.iconright.subscribe(append(el));
    el.state.count.subscribe((count) => count ? setCountText(el) : setCountTextContent(el.countElement, ''));
    el.state.error.subscribe((errorElement) => {
        append(el)(errorElement);
        SetAttribute(el, 'error-message', !!el.validationMessage ? el.validationMessage : null);
    });
    getInputAttributes().forEach(attr => el.state[attr].subscribe(() => updateInputAttributes(el, [attr])));
}
export default class FieldText extends HTMLElement {
    constructor() {
        super();
        this.state = {};
        this.events = {};
        if (!this.shadowRoot) {
            const shadowRoot = this.attachShadow({ mode: 'open' });
            shadowRoot.innerHTML = `<style>${styles}</style>${html}`;
        }
        this.state = Object.freeze(Object.keys(propertyMeta).reduce((result, key) => Object.assign(result, {
            [key]: Observer(initialValue(this, key), {
                matchType: propertyMeta[key].matchType,
                formatter: key === 'value' ? propertyMeta[key].formatter(this) : propertyMeta[key].formatter
            })
        }), {}));
        subscribeStates(this);
    }
    static get observedAttributes() { return Object.keys(propertyMeta); }
    get autocomplete() { return this.state.autocomplete.value; }
    set autocomplete(v) { this.state.autocomplete.next(v); }
    get autofocus() { return this.state.autofocus.value; }
    set autofocus(v) { this.state.autofocus.next(v); }
    get count() { return this.state.count.value; }
    set count(v) { this.state.count.next(v); }
    get disabled() { return this.state.disabled.value; }
    set disabled(v) { this.state.disabled.next(v); }
    get error() { return this.state.error.value; }
    set error(v) { this.state.error.next(v); }
    get help() { return this.state.help.value; }
    set help(v) { this.state.help.next(v); }
    get iconleft() { return this.state.iconleft.value; }
    set iconleft(v) { this.state.iconleft.next(v); }
    get iconright() { return this.state.iconright.value; }
    set iconright(v) { this.state.iconright.next(v); }
    get input() { return this.state.input.value; }
    set input(v) { this.state.input.next(v); }
    get inputid() { return this.state.inputid.value; }
    set inputid(v) { this.state.inputid.next(v); }
    get label() { return this.state.label.value; }
    set label(v) { this.state.label.next(v); }
    get max() { return this.state.max.value; }
    set max(v) { this.state.max.next(v); }
    get min() { return this.state.min.value; }
    set min(v) { this.state.min.next(v); }
    get name() { return this.state.name.value; }
    set name(v) { this.state.name.next(v); }
    get pattern() { return this.state.pattern.value; }
    set pattern(v) { this.state.pattern.next(v); }
    get required() { return this.state.required.value; }
    set required(v) { this.state.required.next(v); }
    get type() {
        return this.state.type.value;
    }
    set type(v) { this.state.type.next(v); }
    get value() { return this.state.value.value; }
    set value(v) { this.state.value.next(v); }
    get countElement() { return queryShadow(this, '.field-count-text'); }
    get focused() { return !!document.activeElement && this.inputid === document.activeElement.id; }
    get form() { return this.closest('form'); }
    get isempty() { return this.value == '' || this.value == undefined; }
    get validity() { return this.input ? this.input.validity : undefined; }
    get validationMessage() { return Get(this, 'input.validationMessage', ''); }
    set validationMessage(error) { this.input ? this.input.setCustomValidity(error) : undefined; }
    setLabelPosition() {
        const focused = this.focused.toString();
        const empty = this.isempty.toString();
        const attrFocused = this.getAttribute('focused');
        const attrEmpty = this.getAttribute('empty');
        if (focused !== attrFocused) {
            this.setAttribute('focused', focused);
        }
        if (empty !== attrEmpty) {
            this.setAttribute('empty', empty);
        }
        return focused || !empty;
    }
    attributeChangedCallback(name, _oldValue, newValue) {
        if (this.state[name]) {
            this.state[name].next(newValue);
        }
    }
    connectedCallback() {
        slotProperties.forEach((key) => slotEvent(this, key));
        if (!this.events.keydown) {
            this.events.keydown = EventObserver(this, 'keydown');
            this.events.keydown.subscribe((e) => {
                if (e.key && e.key.toLowerCase() === 'enter') {
                    DispatchEvent(this, 'formsubmit', { originalEvent: e, field: this });
                }
            });
        }
        if (!this.events.input) {
            this.events.input = EventObserver(this, 'input');
            this.events.input.subscribe(() => this.state.value.next(Get(this, 'input.value', null)));
        }
        if (!this.events.animationStart) {
            this.events.animationStart = EventObserver(queryShadow(this, '.field-input'), 'animationstart');
            this.events.animationStart.subscribe(() => this.setLabelPosition());
        }
        if (!this.events.focus) {
            this.events.focus = EventObserver(this, 'focus');
            this.events.focus.subscribe(() => this.setLabelPosition());
        }
        if (!this.events.blur) {
            this.events.blur = EventObserver(this, 'blur');
            this.events.blur.subscribe(() => {
                this.setLabelPosition();
                this.error = this.validationMessage;
            });
        }
        this.setLabelPosition();
    }
    disconnectedCallback() {
        Object.keys(this.events).forEach(key => {
            this.events[key].complete();
            delete this.events[key];
        });
    }
}
window.customElements.define('field-text', FieldText);

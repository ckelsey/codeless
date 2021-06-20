import Observer from '../../utils/observe/observer.js';
import { slotEvent, getSlottedElement, getSlot } from '../../utils/dom/web-components/field-utils/slot-element.js';
import EventObserver from '../../utils/observe/event-observer.js';
import Type from '../../utils/types/type.js';
import Pipe from '../../utils/function-helpers/pipe.js';
import ToJSON from '../../utils/conversion/to-json.js';
import ToBool from '../../utils/conversion/to-bool.js';
import ToNumber from '../../utils/conversion/to-number.js';
import IfInvalid from '../../utils/checks/if-invalid.js';
import { SantizedHTML } from '../../utils/validate/html.js';
import Create from '../../utils/dom/create.js';
import ID from '../../utils/id.js';
import SetAttribute from '../../utils/dom/set-attribute.js';
import IsNothing from '../../utils/checks/is-nothing.js';
import Get from '../../utils/objects/get.js';
import DispatchEvent from '../../utils/dom/dispatch-event.js';
const styles = `@keyframes rotating{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@keyframes onAutoFillStart{from{background:transparent}to{background:transparent}}@keyframes onAutoFillCancel{from{background:transparent}to{background:transparent}}@keyframes delayOverflowIn{0%{overflow:hidden}99%{overflow:hidden}100%{overflow:visible}}@keyframes delayOverflowOut{0%{overflow:visible}99%{overflow:visible}100%{overflow:hidden}}@keyframes fadeIn{0%{opacity:0}10%{opacity:0}100%{opacity:1}}@keyframes fadeOut{0%{opacity:1}100%{opacity:0}}:host{display:inline-block;max-width:100%;box-sizing:border-box;vertical-align:text-bottom;line-height:150%;font-size:inherit;color:inherit}:host *{box-sizing:border-box}:host([focused="true"]) .field-element-container-inner{background-color:#fff}:host([disabled="true"]) .field-element-container-inner{opacity:0.62}:host([error-message]:not([error-message=""])) .field-element-container-inner{box-shadow:0 0 0 1px #df0700}:host .field-input-label{flex:1 0 50%;display:flex;flex-direction:column;justify-content:flex-start;align-items:flex-start;min-height:2.725em}:host .field-input{width:100%}:host .icon-container{position:relative;top:0;left:0;margin:0;width:auto;height:1.5em;max-width:2.5em;display:inline-flex;line-height:100%;font-size:inherit;pointer-events:none;color:rgba(34,34,34,0.75)}:host .icon-container slot[name="icon"]{display:flex;height:1.5em;width:auto;max-width:2em;align-items:center;justify-content:flex-start;font-size:initial}:host .icon-container.icon-padding{padding-left:0.25em;margin-right:-0.25em}::slotted([slot="icon"]){height:1.5em;width:1.5em;min-width:1.5em;min-height:1.5em;margin:0 0 0 0.62em}:host .field-input-bottom-container{display:block;padding:0em 0.125em;flex-grow:1;width:100%;color:inherit;font-size:70%;line-height:150%}:host .field-input-bottom-container .field-input-bottom{display:flex;justify-content:space-between;align-items:flex-start;flex-grow:1;width:100%;font-weight:100;opacity:0.62;color:inherit}:host .field-error-text{display:block;color:#df0700}.field-element-container-inner{position:relative;width:auto;max-width:100%;min-height:2.725em;display:flex;align-items:center;justify-content:flex-start;flex-wrap:wrap;background-color:#eee;border-radius:3px;transition:background-color 0.2s}:host .field-label{width:100%;min-height:1.05em;text-align:left;display:flex;align-items:center;transform:translateX(-0.2em) translateY(0.75em) translateZ(0px) scale(1);transform-origin:0 0;text-transform:capitalize;font-size:inherit;pointer-events:none;position:relative;line-height:150%;padding:0 0 0 0.75em;margin-bottom:-1.5em;color:rgba(34,34,34,0.62);transition:transform 0.2s, opacity 0.2s ease-in 0.062s}:host([focused="true"]) .field-label,:host([empty="false"]) .field-label{transform:translateX(0.2em) translateY(0.25em) translateZ(0) scale(0.7)}:host([required="true"]) .field-label ::before{content:"*";color:#df0700;line-height:100%;position:relative;top:0.25em;margin-right:0.25em;font-style:italic;text-transform:none}:host .error-icon{width:0em;color:#df0700;transition:width 0.2s}:host([error-message]:not([error-message=""])) .error-icon{width:1.5em}::slotted([slot="input"]){padding:1.3em 0.7em 0.3em;position:relative;margin:0;height:auto;width:100%;border-radius:3px;background-color:transparent;color:#222;border:none !important;box-sizing:border-box;height:100%;flex-grow:1;font-size:inherit;font-family:inherit;line-height:initial;outline:none !important;appearance:none;transition:color 0.2s, background-color 0.2s, background-position 0.2s, transform 0.2s}::slotted([slot="input"])::-webkit-input-placeholder{color:transparent;opacity:0}::slotted([slot="input"]):-webkit-input-placeholder{color:transparent;opacity:0}::slotted([slot="input"]):-ms-input-placeholder{color:transparent;opacity:0}::slotted([slot="input"])::placeholder{color:transparent;opacity:0}::slotted([slot="input"]:focus){background-color:transparent}::slotted([slot="input"]:-internal-autofill-selected){background-color:transparent !important}::slotted([slot="input"]:-webkit-autofill),::slotted([slot="input"]:-webkit-autofill:hover),::slotted([slot="input"]:-webkit-autofill:focus),::slotted([slot="input"]:-webkit-autofill:active){animation-name:onAutoFillStart;transition:background-color 50000s ease-in-out 0s}::slotted([slot="input"]:not(:-webkit-autofill)){animation-name:onAutoFillCancel}`;
const html = `<div class="field-element-container"><div class="field-element-container-inner"><span class="icon-container icon-padding"><slot name="iconleft"></slot></span><div class="field-input-label"><div class="field-label"><slot name="label"></slot></div><div class="field-input"><slot name="input"></slot></div></div><span class="icon-container error-icon"><slot name="error-icon"><svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" style="width:100%;fill:currentColor"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"></path></svg></slot></span><span class="icon-container"><slot name="iconright"></slot></span></div><span class="field-input-bottom-container"><span class="field-error-text"><slot name="error"></slot></span><span class="field-input-bottom"><span class="field-help-text"><slot name="help"></slot></span><span class="field-count-text"></span></span></span></div>`;
const innerHTMLValue = (value) => typeof value === 'string' ? SantizedHTML(value) : Get(value, 'innerHTML', '');
const elementCreateOptions = (tag, slot) => (value) => ({ tag, attributes: { slot }, properties: { innerHTML: innerHTMLValue(value) } });
const appendToSlot = (el) => (element) => el && !el.contains(element) ? el.appendChild(element) : undefined;
const trueOrNull = (value) => value === true ? true : null;
const setCountText = (el) => el.count ? el.countElement.textContent = `${Get(el.value, 'length', 0)}${el.max ? `/${el.max}` : ''}` : undefined;
const inputAttributes = ['autocomplete', 'autofocus', 'disabled', 'inputid', 'max', 'min', 'name', 'pattern', 'required', 'type', 'value'];
function attachShadow(el) {
    if (!el.shadowRoot) {
        const shadowRoot = el.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `<style>${styles}</style>${html}`;
    }
}
function slotFormatter(createOptions = elementCreateOptions('div', '')) {
    return function slotFormatterInner(element, observer) {
        const type = Type(element);
        if (type === 'string') {
            return Create(createOptions(element));
        }
        if (type === 'dom') {
            return element;
        }
        if (observer) {
            return observer.changed;
        }
        return '';
    };
}
function updateInputAttributes(el, attrs = inputAttributes) {
    if (!el || !el.state) {
        return;
    }
    const input = el.input;
    const label = el.label;
    if (!input) {
        return;
    }
    attrs.forEach(attr => {
        const value = el.state[attr].value;
        if (attr === 'value') {
            if (input.value !== value && value !== undefined) {
                input.value = value;
            }
            setCountText(el);
            el.setLabelPosition();
            return requestAnimationFrame(() => {
                const error = el.validationMessage;
                if (!error) {
                    el.error = error;
                }
            });
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
            return;
        }
        SetAttribute(input, attr, value);
    });
}
function setStates(el) {
    el.state.autocomplete = Observer('on', {
        formatter: (newValue, observer) => {
            if (typeof newValue === 'string') {
                if (newValue === 'true') {
                    return 'on';
                }
                if (newValue === 'false') {
                    return 'off';
                }
                return newValue;
            }
            if (observer) {
                return observer.changed;
            }
        }
    });
    el.state.autofocus = Observer(false, { formatter: Pipe(ToBool, IfInvalid(false)), matchType: true });
    el.state.count = Observer(false, { formatter: Pipe(ToBool, IfInvalid(false)), matchType: true });
    el.state.disabled = Observer(false, { formatter: Pipe(ToBool, IfInvalid(false)), matchType: true });
    el.state.error = Observer('', { noInit: true, formatter: slotFormatter(elementCreateOptions('div', 'error')) });
    el.state.help = Observer('', { noInit: true, formatter: slotFormatter(elementCreateOptions('div', 'help')) });
    el.state.iconleft = Observer('', { noInit: true, formatter: slotFormatter(elementCreateOptions('div', 'iconleft')) });
    el.state.iconright = Observer('', { noInit: true, formatter: slotFormatter(elementCreateOptions('div', 'iconright')) });
    el.state.input = Observer(null, {
        noInit: true,
        formatter: (input, observer) => {
            if (Type(input) === 'dom') {
                return input;
            }
            if (observer) {
                return observer.changed;
            }
        }
    });
    el.state.inputid = Observer(ID(), { matchType: true });
    el.state.label = Observer('', { noInit: true, formatter: slotFormatter(elementCreateOptions('label', 'label')) });
    el.state.max = Observer(null, { formatter: value => IsNothing(value) ? null : Pipe(ToNumber, IfInvalid(null))(value) });
    el.state.min = Observer(null, { formatter: value => IsNothing(value) ? null : Pipe(ToNumber, IfInvalid(null))(value) });
    el.state.name = Observer('', { matchType: true });
    el.state.pattern = Observer(null);
    el.state.required = Observer(false, { formatter: Pipe(ToBool, IfInvalid(false)), matchType: true });
    el.state.type = Observer('text', {
        matchType: true,
        formatter: (newValue, observer) => {
            if (typeof newValue === 'string') {
                return newValue;
            }
            if (observer) {
                return observer.changed;
            }
        }
    });
    el.state.value = Observer(null, {
        formatter: (newValue, observer) => {
            if (typeof newValue === 'string') {
                return newValue;
            }
            const valueType = Type(newValue);
            if (['number', 'function', 'date'].indexOf(valueType) > -1) {
                return newValue.toString();
            }
            if (['array', 'object'].indexOf(valueType) > -1 && observer) {
                return Pipe(ToJSON, IfInvalid(observer.changed))(newValue);
            }
            if (observer) {
                return observer.changed;
            }
        }
    });
}
function subscribeStates(el) {
    el.state.count.subscribe((count) => count ? setCountText(el) : el.countElement.textContent = '');
    el.state.error.subscribe((errorElement) => {
        appendToSlot(el)(errorElement);
        const error = el.validationMessage;
        const currentErrorMsg = el.getAttribute('error-message');
        if (currentErrorMsg !== error) {
            SetAttribute(el, 'error-message', !!error ? error : null);
        }
    });
    el.state.help.subscribe(appendToSlot(el));
    el.state.iconleft.subscribe(appendToSlot(el));
    el.state.iconright.subscribe(appendToSlot(el));
    el.state.input.subscribe((input) => {
        input.setAttribute('placeholder', ' ');
        appendToSlot(el)(input);
        el.inputid = input.id || el.inputid;
        updateInputAttributes(el);
    });
    el.state.label.subscribe(appendToSlot(el));
    inputAttributes.forEach(attr => el.state[attr].subscribe(() => updateInputAttributes(el, [attr])));
}
export default class FieldText extends HTMLElement {
    static get observedAttributes() { return inputAttributes.concat(['count', 'error', 'help', 'iconleft', 'iconright', 'input', 'label']); }
    state = {};
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
    get type() { return this.state.type.value; }
    set type(v) { this.state.type.next(v); }
    get value() { return this.state.value.value; }
    set value(v) { this.state.value.next(v); }
    get countElement() {
        const non = { textContent: '' };
        if (!this.shadowRoot) {
            return non;
        }
        return this.shadowRoot.querySelector('.field-count-text') || non;
    }
    get focused() { return !!document.activeElement && this.inputid === document.activeElement.id; }
    get form() { return this.closest('form'); }
    get input() { return this.state.input.value; }
    get isempty() { return this.value == '' || this.value == undefined; }
    get validity() { return this.input.validity; }
    get validationMessage() { return this.input.validationMessage; }
    set validationMessage(error) { this.input.setCustomValidity(error); }
    events = {};
    constructor() {
        super();
        attachShadow(this);
        setStates(this);
        subscribeStates(this);
    }
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
    }
    attributeChangedCallback(name, _oldValue, newValue) { if (this.state[name]) {
        this.state[name].next(newValue);
    } }
    connectedCallback() {
        this.state.input.next(getSlottedElement(this, 'input', elementCreateOptions('input', 'input')(this.input)));
        slotEvent(this, getSlot(this, 'input'), elementCreateOptions('input', 'input')(this.input));
        slotEvent(this, getSlot(this, 'label'), elementCreateOptions('label', 'label')(this.label));
        slotEvent(this, getSlot(this, 'error'), elementCreateOptions('div', 'error')(this.error));
        slotEvent(this, getSlot(this, 'help'), elementCreateOptions('div', 'help')(this.help));
        slotEvent(this, getSlot(this, 'iconleft'), elementCreateOptions('div', 'iconleft')(this.iconleft));
        slotEvent(this, getSlot(this, 'iconright'), elementCreateOptions('div', 'iconright')(this.iconright));
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
            this.events.input.subscribe(() => this.state.value.next(this.input.value));
        }
        if (!this.events.focus) {
            this.events.focus = EventObserver(this, 'focus');
            this.events.focus.subscribe(() => this.setLabelPosition());
        }
        if (!this.events.blur) {
            this.events.blur = EventObserver(this, 'blur');
            this.events.blur.subscribe(() => {
                this.setLabelPosition();
                requestAnimationFrame(() => this.error = this.validationMessage);
            });
        }
        if (!this.events.animationStart) {
            this.events.animationStart = EventObserver(this.shadowRoot.querySelector('.field-input'), 'animationstart');
            this.events.animationStart.subscribe(() => this.setLabelPosition());
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

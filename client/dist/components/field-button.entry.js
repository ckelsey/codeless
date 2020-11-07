import { r as registerInstance, h } from './index-cb63118f.js';

const styleCss = "@keyframes rotating{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@keyframes onAutoFillStart{from{}to{}}@keyframes onAutoFillCancel{from{}to{}}@keyframes delayOverflowIn{0%{overflow:hidden}99%{overflow:hidden}100%{overflow:visible}}@keyframes delayOverflowOut{0%{overflow:visible}99%{overflow:visible}100%{overflow:hidden}}@keyframes fadeIn{0%{opacity:0}10%{opacity:0}100%{opacity:1}}@keyframes fadeOut{0%{opacity:1}100%{opacity:0}}:host{display:inline-block;vertical-align:text-bottom;white-space:nowrap}:host .field-button-container{display:inline-block}:host .field-button-container button{border-radius:2px;font-size:inherit;font-weight:bold;line-height:normal;opacity:1;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;padding:0.832em;color:#eee;background-color:#469ab6;min-width:5em;border:none;outline:none !important;transition:color 0.2s, background-color 0.2s}:host .field-button-container button:hover{color:#fff;background-color:#4da7c5}:host .field-button-container button:before{content:\"\";margin-right:0em;width:0em;height:0em;border:0px solid currentColor;border-top-color:transparent;border-radius:50%;opacity:0;transition:width 0.2s, height 0.2s, border-width 0.4s, margin-right 0.2s, opacity 0.3s}:host .field-button-container button[disabled]{cursor:not-allowed;user-select:none;pointer-events:none;opacity:0.5}:host .field-button-container button[data-kind=link]{color:#469ab6;background-color:transparent;font-weight:normal}:host .field-button-container button[data-kind=link]:hover{color:#4da7c5;background-color:transparent}:host .field-button-container button[data-theme=danger]{color:#ffecec;background-color:#df0700}:host .field-button-container button[data-theme=danger]:hover{color:#ffffff;background-color:#ff312a}:host .field-button-container button[data-theme=danger][data-kind=link]{color:#df0700;background-color:transparent}:host .field-button-container button[data-theme=danger][data-kind=link]:hover{color:#ff312a;background-color:transparent}:host .field-button-container button[data-theme=warning]{color:#fff2e6;background-color:#f79138}:host .field-button-container button[data-theme=warning]:hover{color:#ffffff;background-color:#ffa85d}:host .field-button-container button[data-theme=warning][data-kind=link]{color:#f79138;background-color:transparent}:host .field-button-container button[data-theme=warning][data-kind=link]:hover{color:#ffa85d;background-color:transparent}:host .field-button-container button[data-theme=secondary]{color:#222;background-color:#eee}:host .field-button-container button[data-theme=secondary]:hover{color:#333;background-color:#fff}:host .field-button-container button[data-theme=secondary][data-kind=link]{color:#eee;background-color:transparent}:host .field-button-container button[data-theme=secondary][data-kind=link]:hover{color:#fff;background-color:transparent}:host .field-button-container button[data-size=small]{font-size:80%;padding:0.125em 0.5em;min-width:unset}:host .field-button-container button[data-size=big]{font-size:120%}:host .field-button-container button[data-spinner=true]{pointer-events:none}:host .field-button-container button[data-spinner=true]:before{animation:rotating 1.38s linear infinite;height:0.62em;width:0.62em;margin-right:0.38em;border-width:2px;opacity:0.75}:host .field-button-container button[data-spinner=true]>*{opacity:0.5}";

const FieldButton = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.type = '';
    this.theme = '';
    this.size = '';
    this.kind = '';
    this.disabled = false;
    this.spinner = false;
  }
  validateType(newValue) {
    if (!newValue || newValue == '' || typeof newValue != 'string' || newValue !== 'submit') {
      return this.type = '';
    }
  }
  validateTheme(newValue) {
    if (typeof newValue != 'string' || ['danger', 'warning', 'secondary'].indexOf(newValue) == -1) {
      this.theme = '';
    }
  }
  validateSize(newValue) {
    if (typeof newValue != 'string' || ['big', 'small'].indexOf(newValue) == -1) {
      this.size = '';
    }
  }
  validateKind(newValue) {
    if (typeof newValue != 'string' || ['link'].indexOf(newValue) == -1) {
      this.kind = '';
    }
  }
  render() {
    return h("div", { ref: (el) => this.containerElement = el, class: "field-button-container hide-until-ready" }, h("button", { ref: (el) => this.btn = el, type: this.type, "data-theme": this.theme, "data-size": this.size, "data-kind": this.kind, "data-spinner": this.spinner, disabled: this.disabled }, h("slot", null)));
  }
  static get watchers() { return {
    "type": ["validateType"],
    "theme": ["validateTheme"],
    "size": ["validateSize"],
    "kind": ["validateKind"]
  }; }
};
FieldButton.style = styleCss;

export { FieldButton as field_button };

/*! Built with http://stenciljs.com */
const{h:e}=window.nvcomponents;class t{icons(){return{check_box:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',check_box_outline_blank:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',indeterminate_check_box:'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><defs><path id="a" d="M0 0h24v24H0z"/></defs><clipPath id="b"><use xlink:href="#a" overflow="visible"/></clipPath><path clip-path="url(#b)" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"/></svg>'}}get svgIcon(){return this.icons()[this.type]||""}get styles(){return{color:this.color||"inherit",height:this.size||"24px",width:this.size||"24px"}}render(){return e("span",{class:"material-icon",innerHTML:this.svgIcon,style:this.styles})}static get is(){return"material-icon"}static get encapsulation(){return"shadow"}static get properties(){return{color:{type:String,attr:"color"},icons:{method:!0},size:{type:String,attr:"size"},type:{type:String,attr:"type"}}}static get style(){return"\@font-face{font-family:Roboto;src:url(src/components/material-icon/assets/fonts/Roboto-Regular.ttf) format(\"truetype\");font-weight:400;font-style:normal}\@font-face{font-family:Roboto;src:url(src/components/material-icon/assets/fonts/Roboto-Italic.ttf) format(\"truetype\");font-weight:400;font-style:italic}\@font-face{font-family:Roboto;src:url(src/components/material-icon/assets/fonts/Roboto-Bold.ttf) format(\"truetype\");font-weight:700;font-style:normal}\@font-face{font-family:Roboto;src:url(src/components/material-icon/assets/fonts/Roboto-BoldItalic.ttf) format(\"truetype\");font-weight:700;font-style:italic}\@-webkit-keyframes fadeInOut{0%,100%{opacity:0}40%{opacity:.5}60%{opacity:.8}}\@keyframes fadeInOut{0%,100%{opacity:0}40%{opacity:.5}60%{opacity:.8}}\@-webkit-keyframes fade{from{opacity:.24}}\@keyframes fade{from{opacity:.24}}\@-webkit-keyframes pulsing{from{opacity:.05;-webkit-transform:scale3d(2,2,2);transform:scale3d(2,2,2)}}\@keyframes pulsing{from{opacity:.05;-webkit-transform:scale3d(2,2,2);transform:scale3d(2,2,2)}}\@-webkit-keyframes pulsingLight{to{opacity:.2;-webkit-transform:scale3d(1.2,1.2,1.2);transform:scale3d(1.2,1.2,1.2)}}\@keyframes pulsingLight{to{opacity:.2;-webkit-transform:scale3d(1.2,1.2,1.2);transform:scale3d(1.2,1.2,1.2)}}\@-webkit-keyframes pulsingLighter{from{opacity:.1;-webkit-transform:scale3d(1.1,1.1,1.1);transform:scale3d(1.1,1.1,1.1)}}\@keyframes pulsingLighter{from{opacity:.1;-webkit-transform:scale3d(1.1,1.1,1.1);transform:scale3d(1.1,1.1,1.1)}}.nv-component-disabled{opacity:.3;pointer-events:none}.nv-component-disabled *{pointer-events:none}:host{line-height:0;display:inline-block}.material-icon{display:inline-block}.material-icon svg{width:100%;height:100%;fill:currentColor}"}}class s{get state(){switch(this.value){case"mixed":return"indeterminate_check_box";case!0:case"true":return"check_box";case!1:case"false":return"check_box_outline_blank"}}get tabIndex(){return this.disabled||this.parentDisabled?-1:0}toggle(){if(this.disabled||this.parentDisabled)return!1;const e={oldValue:this.value,newValue:"mixed"===this.value||!this.value,element:this};console.log(this),this.whenUpdate&&"function"==typeof this.whenUpdate&&this.whenUpdate(e),this.change.emit(e),this.onClick()}keyPress(e){"Enter"===e.key&&(e.preventDefault(),this.toggle())}mouseOverBox(){this.hoverBox.classList.add("pulseIn"),this.hoverBox.classList.add("pulseOut"),this.pulseTimer=setInterval(()=>{this.hoverBox.classList.toggle("pulseOut")},1200)}onClick(){const e=()=>{clearTimeout(this.rippleTimer),this.rippleBox.classList.remove("rippling"),this.rippleBox.classList.remove("rippleIn"),this.rippleBox.classList.remove("rippleMiddle"),this.rippleBox.classList.remove("rippleOut"),this.rippleBox.classList.remove("rippleGrow")};this.container.querySelector("input:focus")||(clearInterval(this.pulseTimer),this.hoverBox.classList.remove("pulseIn"),this.hoverBox.classList.remove("pulseOut")),this.rippleBox.classList.add("rippling"),this.rippleBox.classList.add("rippleIn"),this.rippleTimer=setTimeout(()=>{this.rippleBox.classList.add("rippleGrow"),this.rippleBox.classList.add("rippleMiddle"),this.rippleBox.classList.remove("rippleIn"),this.rippleTimer=setTimeout(()=>{this.rippleBox.classList.add("rippleOut"),this.rippleBox.classList.remove("rippleMiddle"),this.rippleTimer=setTimeout(()=>{this.rippleBox.classList.remove("rippling"),this.rippleBox.classList.remove("rippleOut"),e()},300)},200)},10)}mouseLeaveBox(){clearInterval(this.pulseTimer),this.hoverBox.classList.remove("pulseIn"),this.hoverBox.classList.remove("pulseOut")}render(){return e("div",{ref:e=>this.container=e,class:{"nv-checkbox-container":!0,selected:!!this.value&&"false"!==this.value,"nv-component-disabled":this.disabled||this.parentDisabled},onClick:()=>this.toggle(),onKeyPress:e=>this.keyPress(e)},e("div",{class:"nv-checkbox-box",onMouseEnter:()=>this.mouseOverBox(),onMouseLeave:()=>this.mouseLeaveBox()},e("div",{class:"nv-checkbox-box-hover",ref:e=>this.hoverBox=e}),e("div",{class:"nv-checkbox-box-ripple",ref:e=>this.rippleBox=e}),e("material-icon",{type:this.state})),e("label",{innerHTML:this.label}),e("input",{class:"nv-checkbox-checkbox-native",ref:e=>this.nativeCheckbox=e,tabindex:this.tabIndex,type:"checkbox",name:this.label,value:this.label,onFocus:()=>this.mouseOverBox(),onBlur:()=>this.mouseLeaveBox()}))}static get is(){return"nv-checkbox"}static get encapsulation(){return"shadow"}static get properties(){return{disabled:{type:Boolean,attr:"disabled"},element:{elementRef:!0},label:{type:String,attr:"label"},parentDisabled:{type:Boolean,attr:"parent-disabled"},toggle:{method:!0},value:{type:"Any",attr:"value"},whenUpdate:{type:"Any",attr:"when-update"}}}static get events(){return[{name:"change",method:"change",bubbles:!0,cancelable:!0,composed:!0}]}static get style(){return"\@font-face{font-family:Roboto;src:url(src/components/nv-checkbox/assets/fonts/Roboto-Regular.ttf) format(\"truetype\");font-weight:400;font-style:normal}\@font-face{font-family:Roboto;src:url(src/components/nv-checkbox/assets/fonts/Roboto-Italic.ttf) format(\"truetype\");font-weight:400;font-style:italic}\@font-face{font-family:Roboto;src:url(src/components/nv-checkbox/assets/fonts/Roboto-Bold.ttf) format(\"truetype\");font-weight:700;font-style:normal}\@font-face{font-family:Roboto;src:url(src/components/nv-checkbox/assets/fonts/Roboto-BoldItalic.ttf) format(\"truetype\");font-weight:700;font-style:italic}\@-webkit-keyframes fadeInOut{0%,100%{opacity:0}40%{opacity:.5}60%{opacity:.8}}\@keyframes fadeInOut{0%,100%{opacity:0}40%{opacity:.5}60%{opacity:.8}}\@-webkit-keyframes fade{from{opacity:.24}}\@keyframes fade{from{opacity:.24}}\@-webkit-keyframes pulsing{from{opacity:.05;-webkit-transform:scale3d(2,2,2);transform:scale3d(2,2,2)}}\@keyframes pulsing{from{opacity:.05;-webkit-transform:scale3d(2,2,2);transform:scale3d(2,2,2)}}\@-webkit-keyframes pulsingLight{to{opacity:.2;-webkit-transform:scale3d(1.2,1.2,1.2);transform:scale3d(1.2,1.2,1.2)}}\@keyframes pulsingLight{to{opacity:.2;-webkit-transform:scale3d(1.2,1.2,1.2);transform:scale3d(1.2,1.2,1.2)}}\@-webkit-keyframes pulsingLighter{from{opacity:.1;-webkit-transform:scale3d(1.1,1.1,1.1);transform:scale3d(1.1,1.1,1.1)}}\@keyframes pulsingLighter{from{opacity:.1;-webkit-transform:scale3d(1.1,1.1,1.1);transform:scale3d(1.1,1.1,1.1)}}.nv-component-disabled{opacity:.3;pointer-events:none}.nv-component-disabled *{pointer-events:none}:host{width:auto;height:auto;display:inline-block}.nv-checkbox-container{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;margin:7px 0;outline:0!important;font-size:1em;font-family:Roboto,sans-serif;font-weight:400;line-height:1.4em;color:rgba(255,255,255,.75);cursor:pointer}.nv-checkbox-container .nv-checkbox-box{width:24px;height:24px;border-radius:50%;position:relative;color:rgba(255,255,255,.75)}.nv-checkbox-container .nv-checkbox-box .nv-checkbox-box-hover,.nv-checkbox-container .nv-checkbox-box .nv-checkbox-box-ripple{position:absolute;width:100%;height:100%;top:0;left:0;border-radius:50%;-webkit-box-shadow:0 0 0 6px rgba(255,255,255,.45);box-shadow:0 0 0 6px rgba(255,255,255,.45);background:rgba(255,255,255,.45);opacity:0;-webkit-transform:scale3d(0,0,0);transform:scale3d(0,0,0);-webkit-transition:all .2s ease-out;transition:all .2s ease-out;pointer-events:none}.nv-checkbox-container .nv-checkbox-box .nv-checkbox-box-hover.pulseIn{opacity:.16;-webkit-transform:scale3d(.9,.9,.9);transform:scale3d(.9,.9,.9);-webkit-transition:all 1s ease-out;transition:all 1s ease-out}.nv-checkbox-container .nv-checkbox-box .nv-checkbox-box-hover.pulseOut{opacity:.08;-webkit-transform:scale3d(1.1,1.1,1.1);transform:scale3d(1.1,1.1,1.1)}.nv-checkbox-container .nv-checkbox-box .nv-checkbox-box-ripple.rippling{-webkit-transition:opacity .15s ease-out,-webkit-transform .4s ease-out;transition:opacity .15s ease-out,-webkit-transform .4s ease-out;transition:opacity .15s ease-out,transform .4s ease-out;transition:opacity .15s ease-out,transform .4s ease-out,-webkit-transform .4s ease-out}.nv-checkbox-container .nv-checkbox-box .nv-checkbox-box-ripple.rippling.rippleIn{opacity:0;-webkit-transform:scale3d(.6,.6,.6);transform:scale3d(.6,.6,.6)}.nv-checkbox-container .nv-checkbox-box .nv-checkbox-box-ripple.rippling.rippleMiddle{opacity:.32}.nv-checkbox-container .nv-checkbox-box .nv-checkbox-box-ripple.rippling.rippleOut{opacity:.04}.nv-checkbox-container .nv-checkbox-box .nv-checkbox-box-ripple.rippling.rippleGrow{-webkit-transform:scale3d(1.2,1.2,1.2);transform:scale3d(1.2,1.2,1.2)}.nv-checkbox-container.selected .nv-checkbox-box{color:#76b900}.nv-checkbox-container.selected .nv-checkbox-box .nv-checkbox-box-hover{-webkit-box-shadow:0 0 0 6px #76b900;box-shadow:0 0 0 6px #76b900;background:#76b900}.nv-checkbox-container.selected.nv-component-disabled .nv-checkbox-box{color:rgba(255,255,255,.75)}.nv-checkbox-container label{padding:0 32px;cursor:pointer}.nv-checkbox-container .nv-checkbox-checkbox-native{opacity:0;pointer-events:none;position:absolute;width:0;height:0;margin:0}"}}class i{constructor(){this.lastToggleState=!1}get isDisabled(){return this.parentDisabled||this.disabled}get groupState(){const e=t=>{let s=[];for(let i=0;i<t.length;i++)t[i].values?s.push(e(t[i].values)):s.push(t[i].value);const i=s.indexOf(!1)>-1,a=s.indexOf(!0)>-1;return s.indexOf("mixed")>-1?"mixed":!(!a||i)||!(!a&&i)&&"mixed"};return!!Array.isArray(this.values)&&e(this.values)}setGroupState(e,t){return t.map(t=>t.disabled||t.parentDisabled?t:(t.values?t.values=this.setGroupState(e,t.values):t.value=e,t))}updateParent(){const e=this.groupState,t=this.values;let s;this.lastToggleState=!this.lastToggleState;const i={oldValue:t,newValue:s=!0===e?this.setGroupState(!1,this.values):"mixed"===e?this.setGroupState(this.lastToggleState,this.values):this.setGroupState(!0,this.values),element:this};this.whenUpdate&&"function"==typeof this.whenUpdate&&this.whenUpdate(i),this.change.emit(i)}updateChild(e){const t=e.element.element,s=this.values;let i=JSON.parse(JSON.stringify(this.values));var a=t.parentNode.parentNode,l=Array.prototype.indexOf.call(a.children,t.parentNode);i[l].values?i[l].values=e.newValue:i[l].value=e.newValue;const r={oldValue:s,newValue:i,element:this};this.whenUpdate&&"function"==typeof this.whenUpdate&&this.whenUpdate(r),this.change.emit(r)}componentDidLoad(){this.lastToggleState=!!this.groupState}render(){return this.values?e("div",{class:"nv-checkbox-array"},e("div",{class:"nv-checkbox-array-container"},e("div",{class:"nv-checkbox-array-parent"},e("nv-checkbox",{class:"nv-checkbox-array-parent-checkbox",label:this.label,value:this.groupState,disabled:this.isDisabled,whenUpdate:this.updateParent.bind(this)})),e("div",{class:"nv-checkbox-array-children"},this.values.map(t=>e("div",null,t.values?e("nv-checkbox-array",{label:t.label,values:t.values,disabled:this.isDisabled||t.disabled,whenUpdate:this.updateChild.bind(this)}):e("nv-checkbox",{label:t.label,value:t.value,disabled:this.isDisabled||t.disabled,whenUpdate:this.updateChild.bind(this)})))))):e("div",null)}static get is(){return"nv-checkbox-array"}static get encapsulation(){return"shadow"}static get properties(){return{disabled:{type:Boolean,attr:"disabled"},element:{elementRef:!0},label:{type:String,attr:"label"},parentDisabled:{type:Boolean,attr:"parent-disabled"},values:{type:"Any",attr:"values"},whenUpdate:{type:"Any",attr:"when-update"}}}static get events(){return[{name:"change",method:"change",bubbles:!0,cancelable:!0,composed:!0}]}static get style(){return"\@font-face{font-family:Roboto;src:url(src/components/nv-checkbox-array/assets/fonts/Roboto-Regular.ttf) format(\"truetype\");font-weight:400;font-style:normal}\@font-face{font-family:Roboto;src:url(src/components/nv-checkbox-array/assets/fonts/Roboto-Italic.ttf) format(\"truetype\");font-weight:400;font-style:italic}\@font-face{font-family:Roboto;src:url(src/components/nv-checkbox-array/assets/fonts/Roboto-Bold.ttf) format(\"truetype\");font-weight:700;font-style:normal}\@font-face{font-family:Roboto;src:url(src/components/nv-checkbox-array/assets/fonts/Roboto-BoldItalic.ttf) format(\"truetype\");font-weight:700;font-style:italic}\@-webkit-keyframes fadeInOut{0%,100%{opacity:0}40%{opacity:.5}60%{opacity:.8}}\@keyframes fadeInOut{0%,100%{opacity:0}40%{opacity:.5}60%{opacity:.8}}\@-webkit-keyframes fade{from{opacity:.24}}\@keyframes fade{from{opacity:.24}}\@-webkit-keyframes pulsing{from{opacity:.05;-webkit-transform:scale3d(2,2,2);transform:scale3d(2,2,2)}}\@keyframes pulsing{from{opacity:.05;-webkit-transform:scale3d(2,2,2);transform:scale3d(2,2,2)}}\@-webkit-keyframes pulsingLight{to{opacity:.2;-webkit-transform:scale3d(1.2,1.2,1.2);transform:scale3d(1.2,1.2,1.2)}}\@keyframes pulsingLight{to{opacity:.2;-webkit-transform:scale3d(1.2,1.2,1.2);transform:scale3d(1.2,1.2,1.2)}}\@-webkit-keyframes pulsingLighter{from{opacity:.1;-webkit-transform:scale3d(1.1,1.1,1.1);transform:scale3d(1.1,1.1,1.1)}}\@keyframes pulsingLighter{from{opacity:.1;-webkit-transform:scale3d(1.1,1.1,1.1);transform:scale3d(1.1,1.1,1.1)}}.nv-component-disabled{opacity:.3;pointer-events:none}.nv-component-disabled *{pointer-events:none}:host{width:auto;height:auto;display:inline-block}.nv-checkbox-array .nv-checkbox-array-children{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;padding-left:53px}"}}export{t as MaterialIcon,s as NvCheckbox,i as NvCheckboxArray};
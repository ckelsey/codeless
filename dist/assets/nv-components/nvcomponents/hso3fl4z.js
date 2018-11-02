/*! Built with http://stenciljs.com */
const{h:t}=window.nvcomponents;class e{doActivating(t,e){if(!t||!t.parentElement)return!1;clearTimeout(this.activeTimer),this.stopPulsing();const i=this.element.getAttribute("tab-id"),s=t.parentElement.children,n=document.body.querySelector(`nv-tab-content[tab-id="${i}"] .nv-tabs-content`);if(!n)return!1;const a=n.children[e],c=t.getBoundingClientRect(),l=this.element.getBoundingClientRect();if(a){for(let t=0;t<n.children.length;t++)a&&a===n.children[t]?n.children[t].classList.add("nv-tab-activating"):(n.children[t].classList.remove("nv-tab-activating"),n.children[t].classList.remove("nv-tab-active"));for(let e=0;e<s.length;e++)t===s[e]?s[e].classList.add("nv-tab-activating"):(s[e].classList.remove("nv-tab-activating"),s[e].classList.remove("nv-tab-active"));t.classList.add("nv-tab-activating"),this.container.classList.add("nv-tabs-activating"),this.activeIndicator.classList.add("nv-tabs-activating"),this.activeIndicator.style.width=`${c.width}px`,this.activeIndicator.style.left=`${c.left-l.left}px`,this.activeTimer=setTimeout(()=>{clearTimeout(this.activeTimer),this.activeIndicator.classList.remove("nv-tabs-activating"),this.container.classList.remove("nv-tabs-activating"),t.classList.remove("nv-tab-activating"),t.classList.add("nv-tab-active"),a.classList.remove("nv-tab-activating"),a.classList.add("nv-tab-active")},3e3)}}doRipple(t,e){const i=t.getBoundingClientRect(),s=t.querySelector(".nv-tabs-active-ripple"),n=t.querySelector(".nv-tabs-active-ripple2");if(s&&n)if(e){const t=(e.pageX-i.left)/i.width*100,a=(e.pageY-i.top)/i.height*100;s.style.top=`${a}%`,s.style.left=`${t}%`,n.style.top=`${a}%`,n.style.left=`${t}%`}else s.style.removeProperty("top"),s.style.removeProperty("left");t.classList.add("nv-tab-rippling"),setTimeout(()=>{t.classList.remove("nv-tab-rippling")},300)}doPulsing(t){t.classList.add("nv-tab-pulsing-start"),setTimeout(()=>{t.classList.add("nv-tab-pulsing")},300)}stopPulsing(){const t=this.container.querySelectorAll(".nv-tab-pulsing");for(let e=0;e<t.length;e++){const i=t[e];i.classList.remove("nv-tab-pulsing"),setTimeout(()=>{i.classList.remove("nv-tab-pulsing-start")},300)}}openTab(t,e){if(!t||!t.parentElement)return!1;const i=Array.prototype.indexOf.call(t.parentElement.children,t);this.doActivating(t,i),this.doRipple(t,e)}initTabs(){const t=this.container.children;for(let e=0;e<t.length;e++){const i=t[e];if(!i.classList.contains("nv-tab")){i.classList.add("nv-tab");const t=document.createElement("div");t.classList.add("nv-tabs-active-tab-indicator"),i.appendChild(t);const e=document.createElement("div");e.classList.add("nv-tabs-active-ripple"),i.appendChild(e);const s=document.createElement("div");s.classList.add("nv-tabs-active-ripple2"),i.appendChild(s),i.setAttribute("tabindex","0"),i.classList.add("nv-tab"),i.addEventListener("mousedown",t=>{t.preventDefault(),t.stopPropagation(),this.openTab(i,t)}),i.addEventListener("focus",()=>{this.doPulsing(i);const t=t=>{"Enter"===t.key&&(this.stopPulsing(),this.openTab(i))},e=()=>{this.stopPulsing(),i.removeEventListener("keypress",t),i.removeEventListener("blur",e)};t.bind(this),window.addEventListener("click",e),i.addEventListener("keypress",t),i.addEventListener("blur",e)})}}}init(){let t=this.initial;const e=this.container.children;t&&e[t]||(t=0),this.container.classList.add("nv-tabs-ready"),this.container.classList.add("nv-tabs-tabs"),this.openTab(e[this.initial||0])}setClasses(){this.element&&this.element.getAttribute("center")?this.container.classList.add("nv-tabs-center"):this.container.classList.remove("nv-tabs-center")}componentDidUpdate(){this.setClasses(),this.initTabs()}componentDidLoad(){this.setClasses(),this.initTabs(),requestAnimationFrame(()=>{this.init()})}render(){return t("div",{class:"nv-tabs-wrapper"},t("div",{class:"nv-tabs",ref:t=>this.container=t},t("slot",null)),t("div",{ref:t=>this.activeIndicator=t,class:"active-indicator"}))}static get is(){return"nv-tabs"}static get properties(){return{element:{elementRef:!0},initial:{type:Number,attr:"initial"}}}static get style(){return"\@font-face{font-family:Roboto;src:url(src/components/nv-tabs/assets/fonts/Roboto-Regular.ttf) format(\"truetype\");font-weight:400;font-style:normal}\@font-face{font-family:Roboto;src:url(src/components/nv-tabs/assets/fonts/Roboto-Italic.ttf) format(\"truetype\");font-weight:400;font-style:italic}\@font-face{font-family:Roboto;src:url(src/components/nv-tabs/assets/fonts/Roboto-Bold.ttf) format(\"truetype\");font-weight:700;font-style:normal}\@font-face{font-family:Roboto;src:url(src/components/nv-tabs/assets/fonts/Roboto-BoldItalic.ttf) format(\"truetype\");font-weight:700;font-style:italic}\@-webkit-keyframes fadeInOut{0%,100%{opacity:0}40%{opacity:.5}60%{opacity:.8}}\@keyframes fadeInOut{0%,100%{opacity:0}40%{opacity:.5}60%{opacity:.8}}\@-webkit-keyframes fade{from{opacity:.24}}\@keyframes fade{from{opacity:.24}}\@-webkit-keyframes pulsing{from{opacity:.05;-webkit-transform:scale3d(2,2,2);transform:scale3d(2,2,2)}}\@keyframes pulsing{from{opacity:.05;-webkit-transform:scale3d(2,2,2);transform:scale3d(2,2,2)}}\@-webkit-keyframes pulsingLight{to{opacity:.2;-webkit-transform:scale3d(1.2,1.2,1.2);transform:scale3d(1.2,1.2,1.2)}}\@keyframes pulsingLight{to{opacity:.2;-webkit-transform:scale3d(1.2,1.2,1.2);transform:scale3d(1.2,1.2,1.2)}}\@-webkit-keyframes pulsingLighter{from{opacity:.1;-webkit-transform:scale3d(1.1,1.1,1.1);transform:scale3d(1.1,1.1,1.1)}}\@keyframes pulsingLighter{from{opacity:.1;-webkit-transform:scale3d(1.1,1.1,1.1);transform:scale3d(1.1,1.1,1.1)}}.nv-component-disabled{opacity:.3;pointer-events:none}.nv-component-disabled *{pointer-events:none}:host{width:100%;height:auto;display:block}.nv-tabs-wrapper{position:relative;width:100%;height:auto;display:block}.nv-tabs-wrapper .nv-tabs{display:none;opacity:0;position:relative;outline:0!important;font-size:1em;font-family:Roboto,sans-serif;font-weight:400;line-height:1.4em;color:rgba(255,255,255,.75)}.nv-tabs-wrapper .nv-tabs.nv-tabs-ready{opacity:1;display:block}.nv-tabs-wrapper .nv-tabs.nv-tabs-tabs{display:-webkit-box;display:-ms-flexbox;display:flex;width:100%;-ms-flex-wrap:nowrap;flex-wrap:nowrap;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:start;-ms-flex-pack:start;justify-content:flex-start}.nv-tabs-wrapper .nv-tabs.nv-tabs-tabs.nv-tabs-center{-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center}.nv-tabs-wrapper .nv-tabs .nv-tab{position:relative;cursor:pointer;padding:12px 24px;-webkit-box-sizing:border-box;box-sizing:border-box;opacity:.625;outline:0!important;overflow:hidden;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;white-space:nowrap;-ms-flex-negative:0;flex-shrink:0;line-height:2em;-webkit-transition:opacity .2s ease-in-out;transition:opacity .2s ease-in-out}.nv-tabs-wrapper .nv-tabs .nv-tab .nv-tabs-active-ripple,.nv-tabs-wrapper .nv-tabs .nv-tab .nv-tabs-active-ripple2{width:40px;height:40px;margin:-20px;top:calc(50% - 20px);left:calc(50% - 20px);opacity:0;position:absolute;-webkit-transform:scale3d(0,0,0);transform:scale3d(0,0,0);-webkit-transform-origin:50% 50%;transform-origin:50% 50%;-webkit-transition:margin .5s ease-in-out .4s,opacity .4s ease-in-out,-webkit-transform .4s ease-in-out .2s;transition:margin .5s ease-in-out .4s,opacity .4s ease-in-out,-webkit-transform .4s ease-in-out .2s;transition:margin .5s ease-in-out .4s,transform .4s ease-in-out .2s,opacity .4s ease-in-out;transition:margin .5s ease-in-out .4s,transform .4s ease-in-out .2s,opacity .4s ease-in-out,-webkit-transform .4s ease-in-out .2s;pointer-events:none;border-radius:50%;background:radial-gradient(circle at center,#76b900 80%,rgba(118,185,0,0) 80%)}.nv-tabs-wrapper .nv-tabs .nv-tab .nv-tabs-active-ripple2{width:30px;height:30px;margin:-15px;top:calc(50% - 15px);left:calc(50% - 15px);-webkit-transition:margin .5s ease-in-out,opacity .5s ease-in-out,-webkit-transform .5s ease-in-out .5s;transition:margin .5s ease-in-out,opacity .5s ease-in-out,-webkit-transform .5s ease-in-out .5s;transition:margin .5s ease-in-out,transform .5s ease-in-out .5s,opacity .5s ease-in-out;transition:margin .5s ease-in-out,transform .5s ease-in-out .5s,opacity .5s ease-in-out,-webkit-transform .5s ease-in-out .5s}.nv-tabs-wrapper .nv-tabs .nv-tab .nv-tabs-active-tab-indicator{position:absolute;height:2px;background:#76b900;width:100%;pointer-events:none;bottom:0;opacity:0}.nv-tabs-wrapper .nv-tabs .nv-tab:hover{opacity:.75}.nv-tabs-wrapper .nv-tabs .nv-tab.nv-tab-activating,.nv-tabs-wrapper .nv-tabs .nv-tab.nv-tab-active,.nv-tabs-wrapper .nv-tabs .nv-tab.nv-tab-pulsing,.nv-tabs-wrapper .nv-tabs .nv-tab.nv-tab-rippling{opacity:1}.nv-tabs-wrapper .nv-tabs .nv-tab.nv-tab-active{-webkit-animation:2s ease-in-out ripple;animation:2s ease-in-out ripple}.nv-tabs-wrapper .nv-tabs .nv-tab.nv-tab-active .nv-tabs-active-tab-indicator{opacity:1}.nv-tabs-wrapper .nv-tabs .nv-tab.nv-tab-pulsing-start .nv-tabs-active-ripple{opacity:.03;-webkit-transform:scale3d(1.8,1.8,1.8);transform:scale3d(1.8,1.8,1.8);-webkit-transition:all .4s;transition:all .4s;top:calc(50% - 20px)!important;left:calc(50% - 20px)!important;margin:0;background:radial-gradient(circle at center,rgba(255,255,255,.75) 80%,rgba(255,255,255,0) 80%)}.nv-tabs-wrapper .nv-tabs .nv-tab.nv-tab-pulsing .nv-tabs-active-ripple{-webkit-animation-name:pulsing;animation-name:pulsing;-webkit-animation-duration:1.2s;animation-duration:1.2s;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite;-webkit-animation-direction:alternate;animation-direction:alternate}.nv-tabs-wrapper .nv-tabs .nv-tab.nv-tab-rippling .nv-tabs-active-ripple{opacity:.05;-webkit-transform:scale3d(5,5,5);transform:scale3d(5,5,5);-webkit-transition:opacity .4s ease-in-out,-webkit-transform .4s ease-in-out 0s;transition:opacity .4s ease-in-out,-webkit-transform .4s ease-in-out 0s;transition:transform .4s ease-in-out 0s,opacity .4s ease-in-out;transition:transform .4s ease-in-out 0s,opacity .4s ease-in-out,-webkit-transform .4s ease-in-out 0s}.nv-tabs-wrapper .nv-tabs .nv-tab.nv-tab-rippling .nv-tabs-active-ripple2{opacity:.025;-webkit-transform:scale3d(3,3,3);transform:scale3d(3,3,3);-webkit-transition:opacity .5s ease-in-out,-webkit-transform .5s ease-in-out 0s;transition:opacity .5s ease-in-out,-webkit-transform .5s ease-in-out 0s;transition:transform .5s ease-in-out 0s,opacity .5s ease-in-out;transition:transform .5s ease-in-out 0s,opacity .5s ease-in-out,-webkit-transform .5s ease-in-out 0s}.nv-tabs-wrapper .active-indicator{position:absolute;height:2px;background:#76b900;width:0%;pointer-events:none;bottom:0;-webkit-transition:left .2s ease-in-out,width .3s ease-in-out;transition:left .2s ease-in-out,width .3s ease-in-out;opacity:0}.nv-tabs-wrapper .active-indicator.nv-tabs-activating{opacity:1}"}}export{e as NvTabs};
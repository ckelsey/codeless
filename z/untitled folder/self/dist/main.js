!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=2)}([function(e,t){e.exports='<div class="projects-list-container"> <button class="new-project-btn">New</button> <div class="projects-list-items"></div> <div class="projects-list-overlay"> <label>Hello?</label> </div> </div>'},function(e,t,n){"use strict";n.r(t)},function(e,t,n){"use strict";function r(e){const t=parseFloat(e);return isNaN(e)?t:e.trim()}function o(e){return null==e}function i(e){return e}function c(e=""){const t=/\((.*?)\)/g.exec(e||"");return t?t[1]:""}function s(e,t,n,s=i){if(!e)return s(n);const a=t.split(".");let u=e;const l=a.length;let f=a.length;for(;f;){if(o(u)){u=n;break}const e=l-f,t=/\(/.exec(a[e]);if(t){const n=u[a[e].slice(0,t.index)];if("function"==typeof n){u=n.apply(u,c(a[e]).split(",").map(r)),f-=1;continue}}u=u[a[e]],f-=1}return o(u)&&(u=n),s(u)}n.r(t);let a=0;function u(e){return(performance.now()+"xxxxxxxxxxxxxxxx").replace(/[x]|\./g,(function(){return(16*Math.random()|0).toString(16)}))+e}function l(){return a+=1,u(a)}const f=["string","number","null","undefined","function","boolean","date"];function p(e){return f.indexOf(typeof e)>-1||null===e||e instanceof Date}function d(e){return null===e?"null":p(e)?typeof e:function(e){return e instanceof Element||e instanceof Node}(e)?"dom":Array.isArray(e)?"array":function(e){let t=new Date(Date.parse(e));return"Invalid Date"!==t&&!isNaN(t)&&t instanceof Date}(e)?"date":function(e){return(typeof e).indexOf("object")>-1&&null!==e&&!Array.isArray(e)&&!(e instanceof Date)}(e)?"object":typeof e}function h(e,t){const n=d(e);if(d(t)!==n)return!1;if(p(e))return t===e;if("boolean"===n&&e!==t)return!1;if("array"===n&&e.length!==t.length)return!1;if("object"===n&&Object.keys(e).length!==Object.keys(t).length)return!1;if("object"===n&&e.constructor!==t.constructor)return!1;if("date"===n){let n=e===t;return n=new Date(e).getTime()===new Date(t).getTime(),n}if("dom"===n)return e.isEqualNode(t);if("array"===n){let n=e.length;for(;n--;)if(!h(e[n],t[n]))return!1}if("object"===n){const n=Object.keys(e);let r=n.length;for(;r--;)if(!h(e[n[r]],t[n[r]]))return!1}return!0}var m=(e,t=300,n=!1)=>{let r=0;return function(){const o=void 0,i=arguments,c=n&&!r,s=function(){r=requestAnimationFrame((function(){r=0,n||e.apply(o,i)}))};clearTimeout(r),cancelAnimationFrame(r),r=setTimeout(s,t),c&&e.apply(o,i)}};function v(e,t){const n={},r=d(e),o=d(e),i=["object","array"];if(-1==i.indexOf(r)||-1==i.indexOf(o))return e!==t?t||e:void 0;if(r!==o)return"undefined"==o&&"undefined"!==r?e:t;function c(r){if(n[r])return;const o=v(e[r],t[r]);void 0!==o&&(n[r]=e[r]===o?void 0:o)}return"object"==r&&(Object.keys(e).forEach(c),Object.keys(t).forEach(c)),"array"==r&&(e.forEach((e,t)=>c(t)),t.forEach((e,t)=>c(t))),n}const g=()=>{};function y(e,t={}){const n=!!t.noInit,r=!!t.nextOnNew,o=!0===t.noSubsComplete,i=!!t.matchType,c=t.onSubscribe&&"function"==typeof t.onSubscribe?t.onSubscribe:e=>e,a=t.formatter&&"function"==typeof t.formatter?t.formatter:e=>e,u=d(a(e)),f=!!t.takeFirst,p=!!t.takeLast,b=!!f||!!p,x=(e,t={})=>{const n=a(e,t);return i&&d(n)!=u?j.value:n},w=[x(e)],j={errors:[],updated:(new Date).getTime(),subscriptions:{},isComplete:!1,initialType:u,initialValue:e,eventCallbacks:{},formatter:a,matchType:i,nextOnNew:r,noInit:n,noSubsComplete:o,takeFirst:f,takeLast:p,value:null,previousValue:null};Object.defineProperties(j,{value:{get:()=>w[0],set(e){for(w.unshift(e);w.length>2;)w.pop()}},previousValue:{get:()=>w[1]}});const O=(e,t)=>((e,t)=>Array.isArray(e)&&Array.isArray(t))(e,t)?e.reduce((e=>(t,n)=>(-1===e.indexOf(n)&&t.push(n),t))(t),[]):[];function k(){P&&(P.trigger("destroy",j),Object.keys(j.subscriptions).forEach(e=>s(j,`subscriptions.${e}.unsubscribe`,g)),Object.defineProperties(P,{value:{get:function(){}},previous:{get:function(){}},subscriptions:{get:function(){}},next:{value:g},error:{value:g},complete:{value:g},subscribe:{value:g},unsubscribe:{value:g},insert:{value:g},insertAll:{value:g},remove:{value:g},removeElements:{value:g},has:{value:g},indexOf:{value:g},reverse:{value:g},on:{value:g},trigger:{value:g}}),j.eventCallbacks={},j.isComplete=!0)}const C=(e,t,n)=>{P&&P.trigger(e,n||{}),Object.keys(j.subscriptions).forEach(((e,t,n,r)=>o=>{const i=s(r,`${o}.${n}`);"function"==typeof i&&i(e,t||{},o)})(t,n,e,j.subscriptions)),"complete"===e&&k()},E=m(C,1e3,!!f),A=b?E:C;function T(e){return function(){delete j.subscriptions[e.id],P&&P.trigger("unsubscribe",{subscription:e,subscriptions:j.subscriptions}),o&&0===Object.keys(j.subscriptions).length&&k()}}function N(e,t){if(!t)return;const n=j.value.indexOf(e);return n>-1?n:void 0}function S(e){let t;const n=Object.keys(j.value);let r=n.length;for(;r--;)if(e===j.value[n[r]]){t=n[r];break}return t}let P={get isComplete(){return j.isComplete},get value(){return j.value},get previous(){return j.previousValue},get subscriptions(){return j.subscriptions},get lastUpdate(){return j.updated},get settings(){return{initialType:u,formatter:a,matchType:i,nextOnNew:r,noInit:n,takeFirst:f,takeLast:p}},get removed(){return j?O(j.previousValue,j.value):[]},get added(){return j?O(j.value,j.previousValue):[]},get changed(){return v(j.previousValue,j.value)},next:function(e,t){const n=x(e,P);if(t||!r||!h(n,j.value))return j.value=n,j.updated=(new Date).getTime(),A("next",j.value,j),j},error:function(e){j.errors=j.errors.concat([e]),j.updated=(new Date).getTime(),A("error",e,j),P.complete()},complete:function(){A("complete",j)},subscribe:function(e,t=(e=>{}),r=g){const o=Object.assign({},{next:e,error:t,complete:r,id:l()});return o.unsubscribe=T(o),j.subscriptions[o.id]=o,n||void 0===j.value||"function"!=typeof o.next||o.next(j.value),c(o),T(o)},unsubscribe:function(e){if(e&&e.id&&j.subscriptions[e.id])return T(e)},insert:function(e,t=j.value.length){return Array.isArray(j.value)?(j.value.splice(t,0,e),P.next(j.value,!0)):"string"==typeof j.value?(j.value=j.value.slice(0,t)+e+j.value.slice(t),P.next(j.value,!0)):(j.value[t]=e,P.next(j.value,!0))},insertAll:function(e,t=j.value.length){if(void 0===t&&(t=j.value.length),Array.isArray(j.value)){if(!Array.isArray(e))return;return j.value.splice.apply(j.value,[t,0,...e]),P.next(j.value,!0)}const n=e;return Object.keys(n).forEach(e=>j.value[e]=n[e]),P.next(j.value,!0)},remove:function(e,t,n=!1){const r=Array.isArray(j.value),o="string"==typeof j.value;if(void 0===t&&(t=N(e,r)),void 0===t&&r)return j.value;if(void 0===t&&o)return P.next(j.value.replace(new RegExp(e,n?"gm":""),""),!0);if(void 0!==t)return r?j.value.splice(t,1):o?j.value=j.value.slice(0,t):(j.value[t]=void 0,delete j.value[t]),P.next(j.value,!0);const i=S(e);return void 0!==i?(j.value[i]=null,delete j.value[i],P.next(j.value,!0)):P.next(j.value,!0)},removeElements:function(e){if(Array.isArray(j.value)){for(let t=0;t<e.length;t+=1){const n=j.value.indexOf(e[t]);n>-1&&j.value.splice(n,1)}return P.next(j.value,!0)}return Object.keys(e).forEach(e=>delete j.value[e]),P.next(j.value,!0)},reverse:function(){const e=Array.isArray(j.value),t="string"==typeof j.value;return e?P.next(j.value.reverse(),!0):t?P.next(j.value.split("").reverse(),!0):void P.next(j.value,!0)},has:function(e){const t=Array.isArray(j.value),n="string"==typeof j.value;if(t)return N(e,t)||!1;if(n)return j.value.indexOf(e)>-1;return void 0!==S(e)},indexOf:function(e){const t=Array.isArray(j.value),n="string"==typeof j.value;return t?N(e,t)||-1:n?j.value.indexOf(e):S(e)||-1},on:function(e,t){j.eventCallbacks[e]||(j.eventCallbacks[e]={});const n=l();return j.eventCallbacks[e][n]=t,()=>delete j.eventCallbacks[e][n]},trigger:function(e,t){j.eventCallbacks[e]&&Object.keys(j.eventCallbacks[e]).forEach(n=>j.eventCallbacks[e][n](t))},runNext:()=>(A("next",j.value,j),j),merge(e){const n=y(j.value,t),r=[];return n.on("complete",()=>r.forEach(e=>e())),e.forEach(e=>r.push(e.subscribe(e.next,e.error,e.complete))),n}};return P}function b(e,t=(()=>{})){try{return e()}catch(n){try{return e.apply(null)}catch(e){return"function"!=typeof t?t:t()}}}const x=Symbol("__valid"),w=e=>{if(null!=e){try{return void 0===e.constructor.prototype||void 0===e.constructor.prototype[x]||!0===e.constructor.prototype[x]}catch(e){}return!1}};var j=(e,t)=>{if(null!=e){try{e.constructor.prototype[x]=!0===t}catch(e){}return e}};function O(e){return b(()=>j(JSON.parse(e),!0))||j(e,!1)}function k(e){return function(e,t){return j(e||t,!!e)}(b(()=>JSON.stringify(e)),e)}const C=e=>O(localStorage.getItem(e)),E=(e,t)=>localStorage.setItem(e,k(t)),A=y(C("projects")||[],{matchType:!0,nextOnNew:!0});A.subscribe(e=>E("projects",e));const T=y(C("section")||"projects",{matchType:!0,nextOnNew:!0});T.subscribe(e=>E("section",e));var N={get projects(){return C("projects")||A.next([]),A.value},set projects(e){A.next(e)},get section(){return C("section")||T.next("projects"),T.value},set section(e){T.next(e)}};const S=y(N.projects,{matchType:!0,nextOnNew:!0,formatter:(e,t)=>{console.log("projects",e);const n=[];return e.forEach(e=>e.name&&e.id?n.push(e):void 0),n}});S.subscribe(e=>N.projects=e);const P=y(void 0,{nextOnNew:!0,formatter:(e,t)=>{const n=s(e,"id");return n&&q.findById(n)||s(t,"value")}}),q={get list(){return S.value},get current(){return P.value},set current(e){P.next(e)},findById(e){const t=S.value;let n,r=t.length;for(;!n&&r--;)t[r].id==e&&(n=t[r]);return n},newProject(e){if(!e)return;let t=l();for(;q.findById(t);)t=l();S.insert({name:e,id:t}),q.current=q.findById(t)}};var L=q;var D={projects:{path:"projects",title:"Projects",content:{"left-section":[{tag:"projects-list",evaluatedProperties:{list:()=>L.list},events:{projectselected:e=>{const t=e.target,n=s(t,"id");console.log(t),n&&(L.current=L.findById(n))}}}]}},pages:{path:"pages",title:"Pages",content:{}}};function B(e,t){if(!e)return e;const n=t.split(".");let r=e;const i=n.length;let c=n.length;for(;c&&!o(r);){if(1==c){delete r[n[i-c]];break}r=r[n[i-c]],c-=1}return e}function $(e){const t=s(e,"events");if(e&&t){for(let n in t)"function"==typeof t[n]&&(t[n](),B(e,"events."+n));return B(e,"events")}}function F(e){const t=[];if(e&&e.length){const n=e.length;let r=0;for(;r<n;)t.push(e[r]),r+=1}return t}function I(e){if(!e)return e;F(e.children||[]).forEach(I),$(e),e.parentElement&&e.parentElement.removeChild(e)}function M(e,t,n){const r=t?t.split("."):[];return r.reduce((function(e,t){return e||(e={}),e[t]||(e[t]={}),t?(t===r[r.length-1]&&(e[t]=n),e[t]):(e[t]=null,e)}),e),e}function V(e){return!e||"function"!=typeof e.split||""===e}var R=function(e=location.search||""){const t={};let n=e.slice();if(V(n))return t;const r=n.indexOf("?")>-1?n.split("?")[1]:n;return V(r)||r.split("&").forEach((function(e){e&&"function"==typeof e.split&&(t[e.split("=")[0]]=e.split("=")[1])})),t};function H(e){return"string"==typeof e?j(e.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;|&#8220;|&#8221;|&ldquo;|&rdquo;/g,'"').replace(/&apos;|&lsquo;|&rsquo;|&#8216;/g,"'"),!0):j(e,!1)}function _(e,t=document.body){return F(s(t,`querySelectorAll(${e})`))}const z=["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","pre","progress","q","rp","rt","ruby","s","samp","section","select","shadow","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"],W=["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","audio","canvas","circle","clippath","defs","desc","ellipse","filter","font","g","glyph","glyphref","hkern","image","line","lineargradient","marker","mask","metadata","mpath","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","video","view","vkern"];function Q(e){const t=function(e,t=[],n=[]){const r=e,o=b(()=>H(e.toString()),"");if(!o||!o.length)return{original:r,valid:!1,sanitized:o,reason:["no value"]};const i=b(()=>(new DOMParser).parseFromString(o,"text/html"));if(!i)return{original:r,valid:!0,sanitized:o,reason:["no html present"]};const c=_("*",i),s=[];let a=[];a=t.length?t.slice(0):z.concat(W),n.length&&n.forEach((function(e){const t=a.indexOf(e);t>-1&&a.splice(t,1)})),n.length||t.length||(a=z.concat(W)),a.forEach((function(e){const t=_(e,i);let n=t.length;for(;n--;)s.push(t[n])})),s.forEach((function(e){const t=e.parentNode;if(e&&t){const n=e.children.length;let r=0;for(;r<n;)"function"==typeof t.insertBefore&&t.insertBefore(e.children[r],e),r+=1;t.removeChild(e)}}));const u=_("*",i),l=c.length-u.length,f=0===l;return{original:r,valid:f,sanitized:f?o:i.body.innerHTML&&i.body.innerHTML.length?i.body.innerHTML:"",reason:f?[]:[`${l} element${l>1?"s were":"was"} removed`]}}(e.split("?")[0]).sanitized;return t.length>1&&"/"===t[t.length-1]?t.slice(0,t.length-1):t}function U(e,t,n={}){if(!e||!t)return;let r=!1;function o(){return e&&"function"==typeof e.addEventListener}n=Object.assign({},{preventDefault:!1,stopPropagation:!1,useCapture:!0},n||{});const i=y(void 0,{onSubscribe:function(){if(!r){if(!o())return s();r=!0,e.addEventListener(t,c,n.useCapture)}},noSubsComplete:!0});function c(e){if(!i||!i.subscriptions||0===Object.keys(i.subscriptions).length)return s();("function"==typeof n.preventDefault&&n.preventDefault(e)||"boolean"==typeof n.preventDefault&&n.preventDefault)&&e.preventDefault(),("function"==typeof n.stopPropagation&&n.stopPropagation(e)||"boolean"==typeof n.stopPropagation&&n.stopPropagation)&&e.stopPropagation(),i.next(e)}function s(){o()&&e.removeEventListener(t,c,n.useCapture),r=!1,Window}return i}const J=e=>"a"===s(e,"tagName","nope").toLowerCase()&&s(e,"href")?e:void 0,G=(e,t)=>{let n,r=0;for(;!n&&t(r);){const t=s(e,r.toString(),void 0,J);t&&(n=t),r+=1}return n},K=e=>{const t=e.target,n=s(t,"tagName","nope").toLowerCase(),r=s(e,"path",""),o=e.composedPath&&"function"==typeof e.composedPath?e.composedPath():void 0;let i;"a"===n&&(i=t),!i&&Array.isArray(r)&&(i=G(s(e,"path"),e=>e<r.length)),!i&&o&&(i=G(o,e=>e<o.length));const c=s(e,"originalTarget",s(e,"explicitOriginalTarget"),s(e,"parentNode"));if(!i&&c&&(i=function(e,t){let n;for(;!n&&e&&e!==document.body;)t(e)&&(n=e),e=e.parentNode;return n}(c,e=>"a"===s(e,"tagName").toLowerCase())),!i||"_blank"===i.getAttribute("target"))return;const a=b(()=>new URL(i.href));return a&&a.host===location.host?{link:i,href:a.href,path:a.pathname,search:a.search}:void 0};var X=function(){const e=y({},{matchType:!0,nextOnNew:!0,noSubsComplete:!0,noInit:!0}),t=U(document.documentElement,"click",{preventDefault:K}).subscribe(t=>{const n=K(t);n&&e.next(n)},()=>t(),()=>t());return e}();var Y=function(e={}){if(!Object.keys(e).length)return"";const t=Object.keys(e).map((function(t){return null!=(n=e[t])&&!1!==n&&"".concat(t,"=",e[t]);var n})).filter((function(e){return!!e})).join("&");return t?"?"+t:""};function Z(e="/",t={},n=!1){const r=function(e,t={}){return`${location.protocol}//${location.host}${function(e=""){return"/"==e[0]?e:"/"+e}(e)}${Y(t)}`}(e,t);n&&history.replaceState&&history.replaceState({},document.title,r),!n&&history.pushState&&history.pushState({},document.title,r)}function ee(e){const t=Object.assign({},e),n=function(e){return function(t=""){t=Q(t.toLowerCase()).split("/").filter(e=>!!e).join("/");let n=0;const r=Object.keys(e||{}),o="string"==typeof t?t.split("/").filter(e=>!!e):[];for(;n<r.length;){if(e[r[n]].path===t)return e[r[n]];if(e[r[n]].path.indexOf("/*")>-1){const t=e[r[n]].path.split("/");if(t.length>o.length&&"**"!==t[o.length-1]){n+=1;continue}if(t.length<o.length&&"**"!==t[t.length-1]){n+=1;continue}let i=!1,c=0;for(;c<t.length;){if(o[c]!==t[c]&&-1===t[c].indexOf("*")){i=!1;break}i=!0,c+=1}if(i)return e[r[n]]}n+=1}}}(t),r=(e={},t=[])=>{const n={},r=Object.keys(e);return t.length&&r.length?(r.forEach(r=>t.indexOf(r)>-1?n[r]=e[r]:void 0),n):n},o=n(`${location.pathname}${location.search}`),i={path:location.pathname,query:R(location.search),base:`${location.protocol}//${location.host}`};i.query=r(i.query,s(o,"allowedQueries"));const c=Object.assign({},i,o),a=y(c.query,{matchType:!0,nextOnNew:!0}),u=y(c,{matchType:!0,nextOnNew:!0,formatter:(e,t)=>{const o=s(t,"value",c),i="string"!=typeof e?"":e.split("?")[0].split("/").filter(e=>!!e).join("/"),u=s(e,"path",i,e=>"string"==typeof e?e:void 0);if(!u)return o;const l=n(u);if(!l)return o;const f=s(e,"query","string"==typeof e?R(e):{});o.query=r(f,s(l,"allowedQueries"));const p=v(a.value,o.query);Object.keys(p).length&&a.next(o.query);const d=Object.assign({},o,l);return Z(d.path,d.query,o.path===d.path),d}});X.subscribe(e=>u.next(`${e.path}${e.search||""}`));const l=U(window,"popstate");return l&&l.subscribe(()=>{console.log("popstateObserver",location.pathname,location.search),u.next(`${location.pathname}${location.search}`)}),{routes:t,subscribeToRoute:function(e,t,n){return u.subscribe(e,t,n)},subscribeToQuery:function(e,t,n){return a.subscribe(e,t,n)},get current(){return u.value},set current(e){u.next(e)},get query(){return s(u,"current.query",{})},set query(e){u.next(Object.assign({},u.value,{query:Object.assign({},s(u,"value.query"),e)}))},get lastState(){return u.previous}}}const te={};let ne=!1;function re(e){"childList"===e.type&&(F(e.removedNodes).forEach(e=>function e(t){if(!t)return;t.children&&F(t.children).forEach(t=>e(t)),$(t);const n=s(t,"nodeName.toLowerCase()"),r=s(t,"onDisconnected");n&&te[n]&&"function"==typeof r&&r(t)}(e)),F(e.addedNodes).forEach(e=>function e(t){if(!t)return;const n=s(t,"nodeName.toLowerCase()");"#text"!==n&&(n&&te[n]&&te[n].create(t),F(t.children).forEach(t=>e(t)))}(e)))}const oe={get:function(e){return e?te[e]:te},addComponent:(e,t)=>{ne||(ne=!0,oe.init()),te[e]={tag:e,create:e=>t(e)?e.onConnected(e):void 0},F(document.body.querySelectorAll(e)).forEach(te[e].create)},init:()=>new MutationObserver(e=>F(e).forEach(re)).observe(document.body,{childList:!0,subtree:!0})};var ie=oe;function ce(e,t=document.head,n){if(!t)return;e=e||"";const r=document.createElement("style");return r.type="text/css",r.style.display="none",n&&r.setAttribute("name",n),t.appendChild(r),function(e,t){if(e&&null!=t&&"undefined"!==t&&"null"!==t){e.innerHTML="";var n=document.createTextNode(t);e.appendChild(n)}}(r,e),r}function se(e,t,n){let r;return"function"==typeof Event?r=new CustomEvent(t,{detail:n}):(r=document.createEvent("Event"),r.initEvent(t,!0,!0)),e.dispatchEvent(r),e}function ae(e){}function ue(e){const t=s(e,"parentNode",s(e,"host"));t&&t.removeChild(e)}function le(e,t){t.methods&&Object.keys(t.methods).forEach(n=>e[n]=t.methods?t.methods[n](e):void 0),t.elements&&(e.elements=function(e,t){const n={},r={};function o(n){const o=F(e.querySelectorAll(t[n].selector));return r[n]=o.length>1?o:o[0],r[n]}for(let i in t){const c=t[i];n[i]=y(o(i)),c.onChange=c.onChange||ae,Object.defineProperty(r,i,{get:function(){return n[i].value},set:function(e){e!==n[i].value&&n[i].next(e)}}),n[i].subscribe(()=>{if($(n[i].previous),ue(n[i].previous),e.hasConnected)return requestAnimationFrame(()=>c.onChange?c.onChange(n[i].value,e):void 0);e.addEventListener("connected",()=>c.onChange?c.onChange(n[i].value,e):void 0)})}return r}(e,t.elements)),t.properties&&Object.keys(t.properties).forEach(n=>function(e,t,n){"function"!=typeof n.format&&(n.format=e=>e);const r=n.format(e.getAttribute(t)||e[t]||n.initialValue,e);if(e.state[t]=y(r,{initialValue:r,nextOnNew:!1!==n.nextOnNew,matchType:n.matchType}),Object.defineProperty(e,t,{get:()=>e.state[t].value,set(r){if(!e.state[t])return;const o=n.format?n.format(r,e):r;h(e.state[t].value,o)||e.state[t].next(o)}}),"function"!=typeof n.onChange)return;const o=t=>n.onChange?n.onChange(t,e):void 0;if(e.hasConnected)return e.state[t].subscribe(o);e.addEventListener("connected",()=>e.state[t].subscribe(o))}(e,n,t.properties?t.properties[n]:void 0)),setTimeout(()=>{(t.onConnected||ae)(e),se(e,"connected",e),e.hasConnected=!0},0)}function fe(e){const t=e.tag;function n(n){if(n.constructed)return;var r,o;n.hasConnected=!1,r=e.style||"",o=t,r&&!document.head.querySelector(`style[name="${o}"]`)&&ce(r,document.head,o),(n=function(e){return e.constructed=!0,e.componentId=l(),e.state={},e.elements={},e}(n)).onConnected=()=>le(n,e),n.onDisconnected=function(){$(n),"function"==typeof e.onDisconnected&&e.onDisconnected(n),n.state&&Object.keys(n.state).forEach(e=>n.state[e].complete())};const i=function(e){const t=[];let n=e.childNodes.length;for(;n--;)"#text"!==(r=e.childNodes[n]).nodeName||/\S/gm.test(r.textContent||"")?t.push(e.childNodes[n]):e.removeChild(e.childNodes[n]);var r;return t}(n);if(i[0]){const t=document.createDocumentFragment(),r=document.createElement("div");r.innerHTML=e.template||"",t.appendChild(r),F(t.children).forEach(e=>n.insertBefore(e,i[0]))}else n.innerHTML=e.template||"";Object.keys(e.properties||{});return n.events=n.events||{},n}return ie.addComponent(t,n),n}function pe(...e){const t=arguments,n=t.length;return function(e){let r=n+1;for(;r--;)e="function"!=typeof t[n-r]?e:t[n-r](e);return e}}function de(e){return t=b(()=>e.toString()),j(t,"string"==typeof t);var t}function he(e){return b(()=>j(decodeURIComponent(e),!0))||j(e,!1)}function me(e){return t=pe(de,he,H)(e),j(t,"string"==typeof t);var t}function ve(e){if(!e)return j(e,!1);if(Array.isArray(e))return j(e,!0);const t=pe(me,O);return Array.isArray(t)?j(t,!0):b(()=>{const t=F(e);j(t,Array.isArray(t))})||j(e,!1)}function ge(){return new Promise(e=>"loading"!==document.readyState?e():document.addEventListener("DOMContentLoaded",e))}const ye={},be=[];let xe,we,je=!1;function Oe(e){ye[e]&&(ye[e].hasRun=!0,ye[e].canceled=!0,delete ye[e])}function ke(e){return performance.now()-e<Ce.max}function Ce(e){cancelAnimationFrame(xe),clearTimeout(we);do{const e=be.shift();e&&(!ye[e]||ye[e].canceled||ye[e].hasRun||(ye[e].hasRun=!0,ye[e].resolve(ye[e].task()),requestAnimationFrame((function(){Oe(e)}))))}while(ke(e)&&be.length);if(be.length)return xe=requestAnimationFrame((function(){we=setTimeout((function(){Ce(performance.now())}))}));je=!1}function Ee(e){let t,n;const r=new Promise((function(e,r){t=e,n=r})),o=l();return ye[o]={hasRun:!1,canceled:!1,task:e,promise:r,resolve:t,reject:n,id:o,cancel:function(){Oe(o)}},be.push(o),!je&&be.length&&(je=!0,Ce(performance.now())),ye[o]}Ce.max=4.5,Ee.max=function(e){Ce.max=e};const Ae={};let Te=!1;function Ne(e){if(!e||!e.id)return;const t=e.id;Ae[t]&&!Ae[t].resolved&&(Ae[t].resolved=!0,Ae[t].resolve(),Ee((function(){delete Ae[t]})))}function Se(){Te=!0;const e=Object.keys(Ae);e.length?(e.forEach((function(e){if(!Ae[e]||Ae[e].resolved)return;const t=Ae[e],n=(new Date).getTime()-t.started;n>=t.frameValues.length?(t.end=n,Ee((function(){return t.stepFn(t.frameValues[t.frameValues.length-1])})),Ee((function(){return Ne(t)}))):Ee((function(){return t.stepFn(t.frameValues[n])}))})),Ee(Se)):Te=!1}var Pe=function(e,t){if(!Array.isArray(t)||0===t.length)return{then:e=>{}};if("function"!=typeof e)return{then:e=>{}};const n=l();let r,o;const i=new Promise((function(e,t){r=e,o=t}));return Ae[n]={id:n,stepFn:e,frameValues:t,resolved:!1,started:(new Date).getTime(),cancel:function(){return Ne(Ae[n])},then:function(e){return i.then(e)},catch:function(e){return i.catch(e)},promise:i,resolve:r,reject:o},Te||Se(),Ae[n]};function qe(e,t,n=4){return function(e,t,n,r){const o=[];let i=0;for(;i<t-1;){const s=Math.round(1e3*(((c=e)[1]-c[0])*r(i,t,n)))/1e3;o.push(e[0]+s),i+=1}var c;return o.push(e[1]),o}(e,t,n,(function(e,t,n){return function(e,t){return t=void 0===t?4:t,1-Math.pow(1-e,t)}(e/t*(e/t),n)}))}function Le(e,t){function n(t){return j(t,b(()=>Array.from(e).indexOf(t)>-1))}return 1===arguments.length?n:n(t)}function De(e,t){function n(t){const n=!w(t);return j(n?e:t,!0)}return 1===arguments.length?n:n(t)}function Be(e){const t=Number(e),n=!isNaN(t);return j(n?t:e,n)}const $e=["center","left","right","top","bottom","center center","center top","center bottom","left center","left top","left bottom","right center","right top","right bottom"],Fe=["content","parent"];function Ie(e,t,{align:n,speed:r,widthbasis:o}={align:"center",speed:100,widthbasis:"content"}){t.classList.add("overlay-content-target");const i={parent:e,target:t,showing:!1,align:pe(Le($e),De("center"))(n),speed:pe(Be,De(100))(r),widthbasis:pe(Le(Fe),De("content"))(o),positionTimer1:null,positionTimer2:null,get position(){return i.getPositions()},getPositions:()=>new Promise(n=>requestAnimationFrame(()=>{const r=e.getBoundingClientRect(),o=t.getBoundingClientRect(),i=window.innerWidth,c=window.innerHeight,a=r.top>c-(r.top+r.height),u=r.top-10>c||r.bottom+10<0,l=s(t,"offsetLeft",0);return n({parent:e,parentBox:r,target:t,targetBox:o,windowHeight:c,windowWidth:i,isOnTop:a,outOfView:u,targetLeft:l,targetTop:s(t,"offsetTop",0),leftShift:l-Math.round(o.left)})})),scrollContent:(e,n)=>{t.scrollTop=n,t.scrollLeft=e},show:()=>i.showing?Promise.resolve():(i.showing=!0,function e(t){clearTimeout(t.positionTimer1),cancelAnimationFrame(t.positionTimer2);const n=t.parent;t.showing&&n&&t.getPositions().then((function(n){if(clearTimeout(t.positionTimer1),cancelAnimationFrame(t.positionTimer2),n.outOfView)return t.hide();n.isOnTop?(n.target.style.transformOrigin="50% 100%",n.target.style.top=n.parentBox.top-n.targetBox.height+"px"):(n.target.style.transformOrigin="50% 0%",n.target.style.top=n.parentBox.bottom+"px"),n.parentBox.left+n.targetBox.width>n.windowWidth?n.parentBox.right>n.windowWidth?n.target.style.left=n.windowWidth-n.targetBox.width+n.leftShift+"px":n.target.style.left=n.parentBox.right-n.targetBox.width+n.leftShift+"px":n.target.style.left=n.parentBox.left+n.leftShift+"px",t.positionTimer1=setTimeout(()=>{t.positionTimer2=requestAnimationFrame(()=>e(t))},33)}))}(i),M(t,"style.pointerEvents","all"),M(t,"style.zIndex","999"),function(e,t,n){return Pe(n,qe(e,t))}([0,1],i.speed,(function(e){M(t,"style.transform",`scale(1, ${e})`),M(t,"style.opacity",e)})).then((function(){M(t,"style.transform","scale(1, 1)"),M(t,"style.opacity",1),se(t,"shown",i)}))),hide:()=>i.showing?(M(t,"style.pointerEvents","none"),M(t,"style.zIndex",-1),new Promise(e=>{i.showing=!1,M(t,"style.transform","scale(1, 0)"),M(t,"style.opacity",0),e(se(t,"hidden",i))})):Promise.resolve()};return i}const Me={tag:"projects-list",template:n(0),style:n(1).toString(),elements:{root:{selector:".projects-list-container"},itemsContainer:{selector:".projects-list-items"},items:{selector:".project-link",onChange(e,t){console.log(e)}},overlay:{selector:"projects-links-overlay"},newProjectBtn:{selector:".new-project-btn",onChange(e,t){e.overlay=Ie(t.elements.root,e),console.log(e.overlay);const n=U(e,"click");e.events={click:n?n.subscribe(()=>{console.log("click"),e.overlay.show()}):()=>{}}}}},properties:{list:{initialValue:[],nextOnNew:!0,matchType:!0,format:pe(function(e,t){function n(t){const n=Array.isArray(t);return j(n?t.filter(e):t,n)}function r(e){return n(ve(e))}return 1===arguments.length?r:r(ve(t))}(e=>"object"==d(e)&&!!e.name)),onChange(e,t){F(t.elements.itemsContainer.children||[]).forEach(I),e.forEach(e=>{const n=document.createElement("a");n.className="project-link",n.href="javascript:void(0)",n.textContent=e.name,t.elements.itemsContainer.appendChild(n)}),t.elements.items=t.querySelectorAll(".project-link")}}}};ge().then(()=>fe(Me));function Ve(e){e&&e.content&&Object.keys(e.content).forEach(t=>{const n=document.getElementById(t);n&&(F(n.children).forEach(I),e.content[t].forEach(e=>{const t=function({tag:e="",properties:t={},evaluatedProperties:n={},attributes:r={}}){if(!e)return;const o=document.createElement(e);return Object.keys(t).forEach(e=>M(o,e,t[e])),Object.keys(n).forEach(e=>M(o,e,n[e]())),Object.keys(r).forEach(e=>o.setAttribute(e,r[e])),o}(e);t&&n.appendChild(t)}))})}var Re=function(){const e={router:ee(D)};return e.router.subscribeToRoute(Ve),{services:e}};ge().then(()=>Re())}]);
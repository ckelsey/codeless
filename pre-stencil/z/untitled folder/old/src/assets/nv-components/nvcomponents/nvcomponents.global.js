/*! Built with http://stenciljs.com */
(function(namespace,resourcesUrl){"use strict";
(function(resourcesUrl){var t=function(){const t={size:(t,e,a,s,n)=>{let r=(a=a||1e3)/60;const o=(t=>{const e=(e=>{const a=(window.getComputedStyle(t).getPropertyValue("transform")||t.style.transform).match(/(-?[0-9\.]+)/g);return a?a.map(t=>parseFloat(t)):[]})();return e&&0!==e.length?{scale:Math.sqrt(e[0]*e[0]+e[1]*e[1]),rotate:Math.round(Math.atan2(e[1],e[0])*(180/Math.PI)),translateX:e[4]/t.offsetWidth*100,translateY:e[5]/t.offsetHeight*100}:{scale:1,rotate:0,translateX:0,translateY:0}})(t),l=((s?o.scale/e:o.scale*e)-o.scale)/r;r=Math.round(r);const c=()=>{if(r){r-=1,o.scale+=l;const e=`translateX(${o.translateX}) translateY(${o.translateY}) scale(${o.scale}) rotate(${o.rotate})`;console.log(e,r),t.style.transform=e,setTimeout(()=>{c()},a/60)}else n&&n()};c()},pulse:(e,a,s)=>{s=s||1e3,t.size(e,a,.5*s,!1,()=>{t.size(e,a,.5*s,!0)})}};return t}();Context.globalVar="",Context.Animations=t;
})(resourcesUrl);
})("nvcomponents");
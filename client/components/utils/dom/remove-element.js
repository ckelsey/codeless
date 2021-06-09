import ArrayFrom from '../conversion/array-from';
import Get from "../objects/get";
export default function RemoveElement(el) {
  if (!el) {
    return el;
  }
  el.style.display = 'none';
  ArrayFrom(el.children || []).forEach(RemoveElement);
  Get(el, 'events.dispose()');
  if (el.parentElement) {
    el.parentElement.removeChild(el);
  }
}

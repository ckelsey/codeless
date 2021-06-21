import ArrayFrom from "../conversion/array-from.js";
import Get from "../objects/get.js";
import Try from "../try.js";
export default function RemoveElement(el) {
    if (!el) {
        return el;
    }
    Try(() => el.style.display = 'none');
    ArrayFrom(el.children || []).forEach(RemoveElement);
    Get(el, 'events.dispose()');
    if (el.parentElement) {
        el.parentElement.removeChild(el);
    }
}

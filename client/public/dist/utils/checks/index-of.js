import SetValid from "../conversion/set-valid.js";
import Try from "../try.js";
export default function IndexOf(array, value) {
    function IndexOfPartial(v) {
        return SetValid(v, Try(() => Array.from(array).indexOf(v) > -1));
    }
    if (arguments.length === 1) {
        return IndexOfPartial;
    }
    return IndexOfPartial(value);
}

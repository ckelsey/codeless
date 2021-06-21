import Try from "../try.js";
import SetValid from "./set-valid.js";
function ToJSONInternal(json, value) {
    return SetValid(json || value, !!json);
}
export default function ToJSON(value) {
    return ToJSONInternal(Try(() => JSON.stringify(value)), value);
}

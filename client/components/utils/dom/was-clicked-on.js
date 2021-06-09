import ArrayFrom from "../conversion/array-from";
import GetEventTarget from "./get-event-target";
export default function WasClickedOn(element, event) {
  if (!element) {
    return false;
  }
  const target = GetEventTarget(event);
  if (!target) {
    return;
  }
  function isIt(el) {
    const isEqual = el === target;
    const isContained = target instanceof Node && el.contains(target);
    if (isEqual || isContained) {
      return true;
    }
    return false;
  }
  const clickedOnElement = ArrayFrom(element)
    .map(current => isIt(current) ? current : false)
    .filter(current => !!current);
  return clickedOnElement ?
    clickedOnElement.length && clickedOnElement.length == 1 ?
      clickedOnElement[0] :
      clickedOnElement :
    undefined;
}

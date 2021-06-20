import Try from "../try";
import EventObserver from '../observe/event-observer';
const RenderLightDom = (host, selector, attributes = {}, events = {}) => {
  let element = host.querySelector(selector);
  const exists = !!element;
  if (!exists) {
    element = host.ownerDocument.createElement(attributes['tagName']);
  }
  Object.keys(attributes).forEach((key) => {
    if (key === 'tagName' || !key) {
      return;
    }
    if (['class'].indexOf(key) > -1) {
      return element.setAttribute(key, attributes[key]);
    }
    element[key] = attributes[key];
  });
  if (!element['events']) {
    element['events'] = {};
  }
  Object.keys(events).forEach((key) => {
    Try(element['events'][key]);
    element['events'][key] = EventObserver(element, key).subscribe(e => events[key](e));
  });
  if (!exists) {
    host.appendChild(element);
  }
  return element;
};
export default RenderLightDom;

export default function SetAttribute(el, key, value) {
  if (!el) {
    return el;
  }
  el.setAttribute(key, value);
  return el;
}

import SetStyleRules from './set-style-rules';
export default function AppendStyleElement(rulesString, parent = document.head, name) {
  if (!parent) {
    return;
  }
  rulesString = rulesString ? rulesString : '';
  const style = document.createElement('style');
  style.type = 'text/css';
  style.style.display = 'none';
  if (name) {
    style.setAttribute('name', name);
  }
  parent.appendChild(style);
  /** Then set the rules */
  SetStyleRules(style, rulesString);
  return style;
}

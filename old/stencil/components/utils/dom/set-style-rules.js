export default function SetStyleRules(styleElement, ruleString) {
  if (!styleElement || ruleString === undefined || ruleString === null || ruleString === 'undefined' || ruleString === 'null') {
    return;
  }
  styleElement.innerHTML = '';
  var tt1 = document.createTextNode(ruleString);
  styleElement.appendChild(tt1);
}

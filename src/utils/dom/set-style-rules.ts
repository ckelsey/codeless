export default function SetStyleRules(styleElement: Element, ruleString: string) {
    if (!styleElement || ruleString === undefined || ruleString === null || ruleString === 'undefined' || ruleString === 'null') { return }

    styleElement.innerHTML = ''
    var tt1 = document.createTextNode(ruleString)
    styleElement.appendChild(tt1)
}
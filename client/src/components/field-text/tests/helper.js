import ID from '../../../../public/dist/utils/id.js'

export default function FieldTextHelper(chrome) {
    return {
        async slotElementsProperty(slotName, property) {
            const result = await chrome.evaluate(`JSON.stringify(Array.from(document.body.querySelectorAll('field-text [slot="${slotName}"]')).map(e=>e['${property}']))`)
            return JSON.parse(result.result.value)
        },

        async slotElementsAttribute(slotName, attribute) {
            const result = await chrome.evaluate(`JSON.stringify(Array.from(document.body.querySelectorAll('field-text [slot="${slotName}"]')).map(e=>e.getAttribute('${attribute}')))`)
            return JSON.parse(result.result.value)
        },

        async setAttribute(attribute, value) {
            return await chrome.evaluate(`document.body.querySelector('field-text').setAttribute(\`${attribute}\`, \`${value}\`)`)
        },

        async setProperty(property, value) {
            return await chrome.evaluate(`document.body.querySelector('field-text')[\`${property}\`] = \`${value}\``)
        },

        async elementDimensions(selector, shadow = false) {
            return await chrome.evaluate(`JSON.stringify(Array.from(document.body.querySelector('field-text').${shadow ? 'shadowRoot.' : ''}querySelectorAll('${selector}')).map(el => el.getBoundingClientRect()))`)
        },

        async focus() {
            await chrome.page.bringToFront()
            const { root } = await chrome.dom.getDocument()
            const { nodeId } = await chrome.dom.querySelector({ nodeId: root.nodeId, selector: 'field-text input' })
            await chrome.dom.focus({ nodeId })
        },

        async blur() {
            const id = ID()
            await chrome.page.bringToFront()
            await chrome.evaluate(`(function(){let tmpInput = document.createElement('input'); tmpInput.id = '${id}'; document.body.appendChild(tmpInput); tmpInput.focus(); document.body.removeChild(document.getElementById('${id}'));})()`)
        },

        async click(selector, timeout = 100, shadow = false) {
            return new Promise(async (resolve) => {
                const box = JSON.parse((await chrome.evaluate(`JSON.stringify(document.body.querySelector('field-text').${shadow ? 'shadowRoot.' : ''}querySelector(\`${selector}\`).getBoundingClientRect())`)).result.value)
                let clicked = false
                const timer = setTimeout(() => {
                    return resolve(clicked)
                }, timeout)

                chrome.runtime.evaluate({
                    awaitPromise: true,
                    expression: `new Promise(resolve=>{
                        const el = document.body.querySelector('field-text').${shadow ? 'shadowRoot.' : ''}querySelector(\`${selector}\`)
                        function clickHandler(){ 
                            el.removeEventListener('click', clickHandler);
                            resolve(true); 
                        }
                        el.addEventListener('click', clickHandler);
                    })`
                }).then(() => {
                    clicked = true
                    clearTimeout(timer)
                    resolve(clicked)
                }).catch(() => {
                    clicked = false
                    clearTimeout(timer)
                    resolve(clicked)
                })

                await chrome.input.dispatchMouseEvent({
                    type: 'mousePressed',
                    x: box.x + (box.width / 2),
                    y: box.y + (box.height / 2),
                    button: 'left',
                    clickCount: 1
                })

                await chrome.input.dispatchMouseEvent({
                    type: 'mouseReleased',
                    x: box.x + (box.width / 2),
                    y: box.y + (box.height / 2),
                    button: 'left',
                    clickCount: 1
                })
            })
            // return (await chrome.runtime.evaluate({
            //     timeout,
            //     awaitPromise: true,
            //     expression: `(async function(){
            //         return new Promise(resolve=>{
            //             function clickHandler(){ resolve(true) }
            //             const el = document.body.querySelector('field-text').${shadow ? 'shadowRoot.' : ''}querySelector(\`${selector}\`)
            //             el.addEventListener('click', clickHandler)
            //             el.click()
            //             el.removeEventListener('click', clickHandler)
            //         })
            //     })()`
            // })).result.value
        },

        async pause(ms) {
            return new Promise(resolve => {
                setTimeout(resolve, ms)
            })
        },

        randomString() {
            return ID()
        }
    }
}



// const { root } = rootObj
// const objectId = (await chrome.evaluate('document.body.querySelector("field-text input")')).result.objectId
// console.log('focus dom')
// await chrome.dom.focus({ objectId })
// console.log('done focus dom')
// console.log(nodeId, objectId, rootObj, node)
// const _focused = await chrome.dom.focus({ nodeId })
// const focused = await chrome.dom.focus({ nodeId, objectId })
// return await chrome.evaluate(`document.body.querySelector('field-text input').focus()`)
// console.log('focused', focused)
// return focused
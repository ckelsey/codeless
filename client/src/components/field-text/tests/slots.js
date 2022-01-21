/**
 * TODO test initial slot values
 */

import { test } from 'codelessdev/dist/index.js'
import assert from 'assert/strict'
import documentHTML from './document.js'
import FieldTextHelper from './helper.js'

const slotsToTest = ['input', 'label', 'error', 'help', 'iconleft', 'iconright']

slotsToTest.forEach(slot => {
    test(`FIELD-TEXT slots: ${slot} element has a createdOn property`, async (chrome) => {
        const helper = FieldTextHelper(chrome)
        const createdOn = await helper.slotElementsProperty(slot, 'createdOn')
        assert(!!createdOn[0])
    }, { document: documentHTML })
})



slotsToTest.forEach(slot => {
    test(`FIELD-TEXT slots: there is only one ${slot} element`, async (chrome) => {
        const helper = FieldTextHelper(chrome)
        const createdOn = await helper.slotElementsProperty(slot, 'createdOn')
        assert.equal(createdOn.length, 1)
    }, { document: documentHTML })
})



slotsToTest.forEach(slot => {
    test(`FIELD-TEXT slots: setting ${slot} attribute, creates a new element and deletes the previous`, async (chrome) => {
        const helper = FieldTextHelper(chrome)
        const initialCreatedOn = await helper.slotElementsProperty(slot, 'createdOn')

        const newVal = helper.randomString()

        await helper.setAttribute(slot, newVal)

        const newCreatedOn = await helper.slotElementsProperty(slot, 'createdOn')

        assert.equal(newCreatedOn.length, 1)
        assert.notEqual(newCreatedOn, initialCreatedOn)
    }, { document: documentHTML })
})



slotsToTest.slice(1).forEach(slot => {
    test(`FIELD-TEXT slots: setting ${slot} attribute with text updates the text of the slot`, async (chrome) => {
        const helper = FieldTextHelper(chrome)
        const text = helper.randomString()

        await helper.setAttribute(slot, text)

        const textContent = await helper.slotElementsProperty(slot, 'textContent')

        assert.equal(textContent[0], text)
    }, { document: documentHTML })
})



slotsToTest.slice(1).forEach(slot => {
    test(`FIELD-TEXT slots: setting ${slot} property with text updates the text of the slot`, async (chrome) => {
        const helper = FieldTextHelper(chrome)
        const text = helper.randomString()

        await helper.setProperty(slot, text)

        const textContent = await helper.slotElementsProperty(slot, 'textContent')

        assert.equal(textContent[0], text)
    }, { document: documentHTML })
})



slotsToTest.forEach(slot => {
    test(`FIELD-TEXT slots: setting ${slot} attribute with a css selector appends the found element to the slot`, async (chrome) => {
        const helper = FieldTextHelper(chrome)
        const classToAdd = `slot-element-class-${helper.randomString()}`
        await chrome.evaluate(`const el = document.createElement('${slot === 'input' ? 'input' : 'div'}'); document.body.appendChild(el); el.className = '${classToAdd}';`)
        const bodyHasElement = await chrome.evaluate(`!!document.body.querySelector('.${classToAdd}')`)

        assert.equal(bodyHasElement.result.value, true)

        await helper.setAttribute(slot, `.${classToAdd}`)

        const hasSlotElement = await chrome.evaluate(`!!document.body.querySelector('field-text [slot="${slot}"].${classToAdd}')`)

        assert.equal(hasSlotElement.result.value, true)

    }, { document: documentHTML })
})



slotsToTest.forEach(slot => {
    test(`FIELD-TEXT slots: setting ${slot} property with a css selector appends the found element to the slot`, async (chrome) => {
        const helper = FieldTextHelper(chrome)
        const classToAdd = `slot-element-class-${helper.randomString()}`
        await chrome.evaluate(`const el = document.createElement('${slot === 'input' ? 'input' : 'div'}'); document.body.appendChild(el); el.className = '${classToAdd}';`)
        const bodyHasElement = await chrome.evaluate(`!!document.body.querySelector('.${classToAdd}')`)

        assert.equal(bodyHasElement.result.value, true)

        await helper.setProperty(slot, `.${classToAdd}`)

        const hasSlotElement = await chrome.evaluate(`!!document.body.querySelector('field-text [slot="${slot}"].${classToAdd}')`)

        assert.equal(hasSlotElement.result.value, true)

    }, { document: documentHTML })
})



slotsToTest.forEach(slot => {
    test(`FIELD-TEXT slots: setting ${slot} property with a dom appends the element to the slot`, async (chrome) => {
        const helper = FieldTextHelper(chrome)
        const classToAdd = `slot-element-class-${helper.randomString()}`
        await chrome.evaluate(`
            const el = document.createElement('${slot === 'input' ? 'input' : 'div'}');
            document.body.appendChild(el); 
            el.className = '${classToAdd}';
            document.body.querySelector('field-text')['${slot}'] = el;`
        )

        const hasSlotElement = await chrome.evaluate(`!!document.body.querySelector('field-text [slot="${slot}"].${classToAdd}')`)

        assert.equal(hasSlotElement.result.value, true)

    }, { document: documentHTML })
})



slotsToTest.forEach(slot => {
    test(`FIELD-TEXT slots: setting ${slot} property with a html string renders the html in the slot`, async (chrome) => {
        const helper = FieldTextHelper(chrome)
        const classToAdd = `slot-element-class-${helper.randomString()}`
        const htmlString = `<${slot === 'input' ? 'input' : 'div'} class='${classToAdd}'>${slot === 'input' ? '' : '</div>'}`

        await helper.setProperty(slot, htmlString)

        const hasSlotElement = await chrome.evaluate(`!!document.body.querySelector('field-text [slot="${slot}"] .${classToAdd}')`)

        assert.equal(hasSlotElement.result.value, true)

    }, { document: documentHTML })
})



slotsToTest.forEach(slot => {
    test(`FIELD-TEXT slots: setting ${slot} property with a html string renders the html in the slot, but strips out script tags`, async (chrome) => {
        const helper = FieldTextHelper(chrome)
        const classToAdd = `slot-element-class-${helper.randomString()}`
        const htmlString = `<${slot === 'input' ? 'input' : 'div'} class='${classToAdd}'>${slot === 'input' ? '' : '</div>'}<script>var f = document.body.querySelector("field-text");\nf.parentElement.removeChild(f);</script>`

        await helper.setProperty(slot, htmlString)

        const hasSlotElement = await chrome.evaluate(`!!document.body.querySelector('field-text [slot="${slot}"] .${classToAdd}')`)

        assert.equal(hasSlotElement.result.value, true)

        const hasScriptElement = await chrome.evaluate(`!!document.body.querySelector('field-text [slot="${slot}"] script')`)

        assert.equal(hasScriptElement.result.value, false)

    }, { document: documentHTML })
})



slotsToTest.forEach(slot => {
    test(`FIELD-TEXT slots: ${slot} can be set by field-text.appendChild with an element with slot="${slot}" attribute`, async (chrome) => {
        const helper = FieldTextHelper(chrome)
        const classToAdd = `slot-element-class-${helper.randomString()}`
        const createdOn = await helper.slotElementsProperty(slot, 'createdOn')

        assert.equal(createdOn.length, 1)

        await chrome.evaluate(`
            const el = document.createElement('${slot === 'input' ? 'input' : 'div'}');
            el.slot = '${slot}';
            el.className = '${classToAdd}';
            document.body.querySelector('field-text').appendChild(el);`
        )

        const hasSlotElement = await chrome.evaluate(`!!document.body.querySelector('field-text [slot="${slot}"].${classToAdd}')`)

        assert.equal(hasSlotElement.result.value, true)

        const newCreatedOn = await helper.slotElementsProperty(slot, 'createdOn')

        assert.equal(newCreatedOn.length, 1)
        assert.notEqual(newCreatedOn[0], createdOn[0])

    }, { document: documentHTML })
})



slotsToTest.forEach(slot => {
    test(`FIELD-TEXT slots: ${slot} can be set by field-text.insertBefore with an element with slot="${slot}" attribute`, async (chrome) => {
        const helper = FieldTextHelper(chrome)
        const classToAdd = `slot-element-class-${helper.randomString()}`
        const createdOn = await helper.slotElementsProperty(slot, 'createdOn')

        assert.equal(createdOn.length, 1)

        await chrome.evaluate(`
            const el = document.createElement('${slot === 'input' ? 'input' : 'div'}');
            el.slot = '${slot}';
            el.className = '${classToAdd}';
            const component = document.body.querySelector('field-text')
            component.insertBefore(el, component.firstChild);`
        )

        const hasSlotElement = await chrome.evaluate(`!!document.body.querySelector('field-text [slot="${slot}"].${classToAdd}')`)

        assert.equal(hasSlotElement.result.value, true)

        const newCreatedOn = await helper.slotElementsProperty(slot, 'createdOn')

        assert.equal(newCreatedOn.length, 1)
        assert.notEqual(newCreatedOn[0], createdOn[0])

    }, { document: documentHTML })
})
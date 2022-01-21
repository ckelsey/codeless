/**
 * TODO
 * - browser autocomplete
 */

import { test } from 'codelessdev/dist/index.js'
import assert from 'assert/strict'
import documentHTML from './document.js'
import FieldTextHelper from './helper.js'


test(`FIELD-TEXT label: is not clickable`, async (chrome) => {
    const helper = FieldTextHelper(chrome)

    await helper.setProperty('label', 'A label')

    const wasClicked = await helper.click('[slot="label"]')

    assert.equal(wasClicked, false)

}, { document: documentHTML })



test(`FIELD-TEXT label: changes size if focused`, async (chrome) => {
    const helper = FieldTextHelper(chrome)

    await helper.setProperty('label', 'A label')

    const noFocusHeight = JSON.parse((await helper.elementDimensions('label')).result.value)[0].height

    await helper.focus()
    await helper.pause(300)

    const focusHeight = JSON.parse((await helper.elementDimensions('label')).result.value)[0].height

    await helper.blur()
    await helper.pause(300)

    const noFocusHeightAgain = JSON.parse((await helper.elementDimensions('label')).result.value)[0].height

    assert(noFocusHeight === noFocusHeightAgain)
    assert(noFocusHeight > focusHeight)

}, { document: documentHTML })



test(`FIELD-TEXT label: changes size if value`, async (chrome) => {
    const helper = FieldTextHelper(chrome)

    await helper.setProperty('label', 'A label')

    const _noValueHeight = await helper.elementDimensions('label')
    const noValueHeight = JSON.parse(_noValueHeight.result.value)[0].height

    await helper.setProperty('value', 'A value')
    await helper.pause(500)

    const _valueHeight = await helper.elementDimensions('label')
    const valueHeight = JSON.parse(_valueHeight.result.value)[0].height

    await helper.setProperty('value', '')
    await helper.pause(500)

    const _emptyValueHeight = await helper.elementDimensions('label')
    const emptyValueHeight = JSON.parse(_emptyValueHeight.result.value)[0].height

    assert(noValueHeight === emptyValueHeight)
    assert(noValueHeight > valueHeight)

}, { document: documentHTML })



test(`FIELD-TEXT label: inherits font size`, async (chrome) => {
    const helper = FieldTextHelper(chrome)

    await helper.setProperty('label', 'A label')

    const initialSize = (await chrome.evaluate(`window.getComputedStyle(document.body.querySelector('field-text [slot="label"]')).getPropertyValue('font-size')`)).result.value

    await chrome.evaluate(`
        const el = document.createElement('div'); 
        el.style="font-size:8px;"; 
        document.body.appendChild(el); 
        el.appendChild(document.body.querySelector('field-text'))
    `)

    const updatedSize = (await chrome.evaluate(`window.getComputedStyle(document.body.querySelector('field-text [slot="label"]')).getPropertyValue('font-size')`)).result.value

    assert.notStrictEqual(initialSize, updatedSize)
    assert.equal(updatedSize, '8px')

}, { document: documentHTML })



test(`FIELD-TEXT label: after inputId update, for attribute is updated as well`, async (chrome) => {
    const helper = FieldTextHelper(chrome)
    const id = 'anewid'

    await helper.setProperty('label', 'A label')
    await helper.setProperty('inputid', id)

    const inputId = (await helper.slotElementsProperty('input', 'id'))[0]
    const forValue = (await helper.slotElementsAttribute('label', 'for'))[0]

    assert(!!forValue)
    assert.equal(inputId, forValue)
    assert.equal(id, forValue)

}, { document: documentHTML })

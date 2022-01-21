// import { test } from 'codelessdev/dist/index.js'
// import assert from 'assert/strict'
// import documentHTML from './document.js'
// import FieldTextHelper from './helper.js'

// test('FIELD-TEXT input has createdOn property', async (chrome) => {
//     const helper = FieldTextHelper(chrome)
//     const createdOn = await helper.slotElementsProperty('input','createdOn')
//     assert(!!createdOn.result.value)
// }, { document: documentHTML })

// test('field-text slots: input can be set by attribute as a string, creates a new input', async (chrome) => {
//     const helper = FieldTextHelper(chrome)
//     const input = await helper.getInput()
//     console.log(input)
//     assert(1 === 2)
//     // return resolve()
//     // const helper = FieldTextHelper(chrome)
//     // const createdOn = await helper.inputElementProperty('createdOn')
//     // assert(createdOn)
//     // // await chrome.runtime.evaluate({ expression: `const input = document.body.querySelector('field-text'); input.setAttribute('label', 'Hi'); ` })
//     // return resolve(assert(createdOn))
//     return true
// }, { document: documentHTML })

// test('field-text number trois', async (chrome) => {
//     assert(1 === 2)
//     // return resolve()
//     // const helper = FieldTextHelper(chrome)
//     // const createdOn = await helper.inputElementProperty('createdOn')
//     // assert(createdOn)
//     // // await chrome.runtime.evaluate({ expression: `const input = document.body.querySelector('field-text'); input.setAttribute('label', 'Hi'); ` })
//     // return resolve(assert(createdOn))
//     return true
// }, { document: documentHTML })
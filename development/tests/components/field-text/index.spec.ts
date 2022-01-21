/* eslint-disable no-unused-vars */
/* tslint-disable no-unused-vars */
import { test, expect, Page, Browser, chromium } from '@playwright/test'
import { serverBaseUrl } from '../../../development/server'
import Cover, { CoverPage, scoreCoverage, TestCoverageResult } from '../../coverage'
import { FieldTextHelper } from './helper'
import fs from 'fs'
import path from 'path'

const componentName = 'field-text'
const url = `${serverBaseUrl}/tests/components/${componentName}/`
const componentPath = `/dist/components/${componentName}/index.js`
const slotsToTest = ['label', 'error', 'help', 'iconleft', 'iconright']

test.describe(componentName, () => {
    const coverageResults: TestCoverageResult = {
        source: '',
        path: componentPath,
        baseStatements: {},
        coverage: {},
        totalLines: 0
    }
    let b: Browser
    let page: Page
    let coverage: CoverPage
    let helper: FieldTextHelper

    async function report(title: string) {
        const result = await coverage.report(page, coverageResults.baseStatements)
        coverageResults.coverage[title] = result.statements
        await page.close()
        await b.close()
    }

    async function close() {
        console.log('closing')
        fs.writeFileSync(path.join(path.resolve(''), 'coverage.json'), JSON.stringify(scoreCoverage(coverageResults)))
    }

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage()
        coverage = await Cover(componentPath)
        const baseStart = await coverage.start(page, url)
        await coverage.report(page)
        coverageResults.source = baseStart.source
        coverageResults.baseStatements = baseStart.baseStatements
        coverageResults.totalLines = baseStart.totalLines
        await browser.close()

        // page.on('console', async msg => {
        //     for (let i = 0; i < msg.args().length; ++i) {
        //         console.log(`${i}: ${await msg.args()[i].jsonValue()}`);
        //     }

        // })
    })

    test.afterAll(async () => await close())

    test.beforeEach(async () => {
        b = await chromium.launch()
        page = await b.newPage()
        helper = new FieldTextHelper(page)
        await coverage.start(page, url)
    })

    test.afterEach(async ({ }, testInfo) => await report(testInfo.title))




    /** SLOTS ================================================================ */

    test.describe('slots:', () => {
        test.only('input can be set by attribute as a string, creates a new input', async () => {
            const createdOnInitial = await helper.getCreatedOn('input')
            const result = await helper.slotAttributeString('input', '')
            const createdOnNext = await helper.getCreatedOn('input')
            expect(result.slotCount).toBe(1)
            expect(createdOnInitial).toBeTruthy()
            expect(createdOnNext).toBeTruthy()
            expect(createdOnNext !== createdOnInitial).toBe(true)
        })

        test.only('carl', async () => {
            await page.$eval(`field-text`, (node: any) => node.carl())
            expect(true).toBeTruthy()
        })

        test.only('input can be set by attrbute using a selector', async () => {
            const createdOnInitial = await helper.getCreatedOn('input')
            const result = await helper.slotAttributeSelector('input', '', true, 'input')
            const createdOnNext = await helper.getCreatedOn('input')
            expect(result.slotCount).toBe(1)
            expect(createdOnInitial).toBeTruthy()
            expect(createdOnNext).toBeTruthy()
            expect(createdOnNext !== createdOnInitial).toBe(true)
        })

        test('input can be set by attrbute using a selector without slot attribute', async () => {
            const createdOnInitial = await helper.getCreatedOn('input')
            const result = await helper.slotAttributeSelector('input', '', false, 'input')
            const createdOnNext = await helper.getCreatedOn('input')
            expect(result.slotCount).toBe(1)
            expect(createdOnInitial).toBeTruthy()
            expect(createdOnNext).toBeTruthy()
            expect(createdOnNext !== createdOnInitial).toBe(true)
        })

        test('input can be set by property as a string, creates a new input', async () => {
            const createdOnInitial = await helper.getCreatedOn('input')
            const result = await helper.slotPropertyString('input', '',)
            const createdOnNext = await helper.getCreatedOn('input')
            expect(result.slotCount).toBe(1)
            expect(createdOnInitial).toBeTruthy()
            expect(createdOnNext).toBeTruthy()
            expect(createdOnNext !== createdOnInitial).toBe(true)
        })

        test('input can be set by attrbute using a selector', async () => {
            const createdOnInitial = await helper.getCreatedOn('input')
            const result = await helper.slotPropertySelector('input', '', true, 'input')
            const createdOnNext = await helper.getCreatedOn('input')
            expect(result.slotCount).toBe(1)
            expect(createdOnInitial).toBeTruthy()
            expect(createdOnNext).toBeTruthy()
            expect(createdOnNext !== createdOnInitial).toBe(true)
        })

        test('input can be set by attrbute using a selector without slot attribute', async () => {
            const createdOnInitial = await helper.getCreatedOn('input')
            const result = await helper.slotPropertySelector('input', '', false, 'input')
            const createdOnNext = await helper.getCreatedOn('input')
            expect(result.slotCount).toBe(1)
            expect(createdOnInitial).toBeTruthy()
            expect(createdOnNext).toBeTruthy()
            expect(createdOnNext !== createdOnInitial).toBe(true)
        })

        test('input can be set by property using dom element', async () => {
            const createdOnInitial = await helper.getCreatedOn('input')
            const result = await helper.slotPropertyDom('input', '', true, 'input')
            const createdOnNext = await helper.getCreatedOn('input')
            expect(result.slotCount).toBe(1)
            expect(createdOnInitial).toBeTruthy()
            expect(createdOnNext).toBeTruthy()
            expect(createdOnNext !== createdOnInitial).toBe(true)
        })

        test('input can be set by property using dom element without slot attribute', async () => {
            const createdOnInitial = await helper.getCreatedOn('input')
            const result = await helper.slotPropertyDom('input', '', false, 'input')
            const createdOnNext = await helper.getCreatedOn('input')
            expect(result.slotCount).toBe(1)
            expect(createdOnInitial).toBeTruthy()
            expect(createdOnNext).toBeTruthy()
            expect(createdOnNext !== createdOnInitial).toBe(true)
        })

        // test('input can be set by property using HTML string', async () => {
        //     const createdOnInitial = await helper.getCreatedOn('input')
        //     const inputType = await helper.componentEval((node: any) => {
        //         node.input = `<input type="email">`
        //         return node.input.type
        //     })
        //     const createdOnNext = await helper.getCreatedOn('input')
        //     expect(createdOnInitial).toBeTruthy()
        //     expect(createdOnNext).toBeTruthy()
        //     expect(createdOnNext !== createdOnInitial).toBe(true)
        //     expect(inputType).toBe('email')
        // })

        test('input can be set by field-text.appendChild with an element with the right slot attribute', async () => {
            const createdOnInitial = await helper.getCreatedOn('input')
            const result = await helper.slotInsertElement('input', '', true, 'input')
            const createdOnNext = await helper.getCreatedOn('input')
            expect(result.slotCount).toBe(1)
            expect(createdOnInitial).toBeTruthy()
            expect(createdOnNext).toBeTruthy()
            expect(createdOnNext !== createdOnInitial).toBe(true)
        })

        test('input can be set by field-text.insertBefore with an element with the right slot attribute', async () => {
            const createdOnInitial = await helper.getCreatedOn('input')
            const result = await helper.slotInsertElement('input', '', false, 'input')
            const createdOnNext = await helper.getCreatedOn('input')
            expect(result.slotCount).toBe(1)
            expect(createdOnInitial).toBeTruthy()
            expect(createdOnNext).toBeTruthy()
            expect(createdOnNext !== createdOnInitial).toBe(true)
        })

        test(`${slotsToTest.join(", ")} by default is empty and has only 1 slot element`, async () => {
            async function mapper(key: string) {
                const text = await (await helper.component())?.$eval(`[slot="${key}"]`, node => node.textContent)
                const count = (await (await helper.component())?.$$(`[slot="${key}"]`))?.length
                return { text, count }
            }

            await (await Promise.all(slotsToTest.map(mapper))).forEach(result => {
                expect(result.count).toBe(1)
                expect(result.text).toBe('')
            })
        })

        test(`${slotsToTest.join(", ")} can be set by attribute value`, async () => {
            async function mapper(key: string) {
                const value = `${key} set by attribute`
                const result = await helper.slotAttributeString(key, value)
                return { result, value }
            }

            await (await Promise.all(slotsToTest.map(mapper))).forEach(result => {
                expect(result.result.slotCount).toBe(1)
                expect(result.result.text).toBe(result.value)
            })
        })

        test(`${slotsToTest.join(", ")} can be set by attrbute using a selector`, async () => {
            async function mapper(key: string) {
                const value = `${key} set by attribute->selector`
                const result = await helper.slotAttributeSelector(key, value)
                return { result, value }
            }

            await (await Promise.all(slotsToTest.map(mapper))).forEach(result => {
                expect(result.result.slotCount).toBe(1)
                expect(result.result.text).toBe(result.value)
            })
        })

        test(`${slotsToTest.join(", ")} can be set by attrbute using a selector without slot attribute filled`, async () => {
            async function mapper(key: string) {
                const value = `${key} set by attribute->selector->no-slot`
                const result = await helper.slotAttributeSelector(key, value, false)
                return { result, value }
            }

            await (await Promise.all(slotsToTest.map(mapper))).forEach(result => {
                expect(result.result.slotCount).toBe(1)
                expect(result.result.text).toBe(result.value)
            })
        })

        test(`${slotsToTest.join(", ")} can be set by property value`, async () => {
            async function mapper(key: string) {
                const value = `${key} set by property`
                const result = await helper.slotPropertyString(key, value)
                return { result, value }
            }

            await (await Promise.all(slotsToTest.map(mapper))).forEach(result => {
                expect(result.result.slotCount).toBe(1)
                expect(result.result.text).toBe(result.value)
            })
        })

        test(`${slotsToTest.join(", ")} can be set by property value using a selector`, async () => {
            async function mapper(key: string) {
                const value = `${key} set by property->selector`
                const result = await helper.slotPropertySelector(key, value)
                return { result, value }
            }

            await (await Promise.all(slotsToTest.map(mapper))).forEach(result => {
                expect(result.result.slotCount).toBe(1)
                expect(result.result.text).toBe(result.value)
            })
        })

        test(`${slotsToTest.join(", ")} can be set by property value using a selector without slot attribute filled`, async () => {
            async function mapper(key: string) {
                const value = `${key} set by property->selector`
                const result = await helper.slotPropertySelector(key, value, false)
                return { result, value }
            }

            await (await Promise.all(slotsToTest.map(mapper))).forEach(result => {
                expect(result.result.slotCount).toBe(1)
                expect(result.result.text).toBe(result.value)
            })
        })

        test(`${slotsToTest.join(", ")} can be set by property using dom element`, async () => {
            async function mapper(key: string) {
                const value = `${key} set by property->dom`
                const result = await helper.slotPropertyDom(key, value, true)
                return { result, value }
            }

            await (await Promise.all(slotsToTest.map(mapper))).forEach(result => {
                expect(result.result.slotCount).toBe(1)
                expect(result.result.text).toBe(result.value)
            })
        })

        test(`${slotsToTest.join(", ")} can be set by property using dom element without slot attribute filled`, async () => {
            async function mapper(key: string) {
                const value = `${key} set by property->dom`
                const result = await helper.slotPropertyDom(key, value, false)
                return { result, value }
            }

            await (await Promise.all(slotsToTest.map(mapper))).forEach(result => {
                expect(result.result.slotCount).toBe(1)
                expect(result.result.text).toBe(result.value)
            })
        })

        test(`${slotsToTest.join(", ")} can take an HTML string`, async () => {
            const src = 'http://localhost:3000/favicon.png'

            async function mapper(key: string) {
                return await helper.slotPropertyHTML(key, `<img src="${src}">`)
            }

            await (await Promise.all(slotsToTest.map(mapper))).forEach(result => {
                expect(result.slotCount).toBe(1)
                expect(result.src).toBe(src)
            })
        })

        test(`${slotsToTest.join(", ")} can take an HTML string but strip out script tags`, async () => {
            const src = 'http://localhost:3000/favicon.png'
            const html = `<img src="${src}">`

            async function mapper(key: string) {
                return await helper.slotPropertyHTML(key, html, true)
            }

            await (await Promise.all(slotsToTest.map(mapper))).forEach(result => {
                expect(result.slotCount).toBe(1)
                expect(result.src).toBe(src)
                expect(result.script).toBe(null)
            })
        })

        test(`${slotsToTest.join(", ")} can be set by field-text.appendChild with an element with the right slot attribute`, async () => {
            async function mapper(key: string) {
                const value = `${key} set by appendChild`
                const result = await helper.slotInsertElement(key, value)
                return { result, value }
            }

            await (await Promise.all(slotsToTest.map(mapper))).forEach(result => {
                expect(result.result.slotCount).toBe(1)
                expect(result.result.text).toBe(result.value)
            })
        })

        test(`${slotsToTest.join(", ")} can be set by field-text.insertBefore with an element with the right slot attribute`, async () => {
            async function mapper(key: string) {
                const value = `${key} set by insertBefore`
                const result = await helper.slotInsertElement(key, value, false)
                return { result, value }
            }

            await (await Promise.all(slotsToTest.map(mapper))).forEach(result => {
                expect(result.result.slotCount).toBe(1)
                expect(result.result.text).toBe(result.value)
            })
        })
    })




    /** INPUT ================================================================ */

    test.describe('input', () => {
        test('by default has 1', async () => {
            expect(await (await (await helper.component())?.$('input'))?.isVisible()).toBe(true)
            expect(await (await (await helper.component())?.$$('input'))?.length).toBe(1)
        })
    })



    /** LABEL ================================================================ */

    test.describe('label', () => {
        test('changes size if value', async () => {
            const size1: any = await helper.componentEval((node: any) => {
                node.label = 'A label'
                return node.label.getBoundingClientRect().height
            })

            const size2: any = await helper.componentEval((node: any) => new Promise((resolve) => {
                node.value = 'A value'
                setTimeout(() => resolve(node.label.getBoundingClientRect().height), 500)
            }))

            const size3: any = await helper.componentEval((node: any) => new Promise((resolve) => {
                node.value = ''
                setTimeout(() => resolve(node.label.getBoundingClientRect().height), 500)
            }))

            expect(size1).toBeGreaterThan(size2)
            expect(size1).toEqual(size3)
        })

        test('label is not clickable', async () => {
            await helper.componentEval((node: any) => node.label = 'A label')
            let wasClicked

            try {
                await page.click('field-text label', { timeout: 500 })
                wasClicked = true
            } catch (error) {
                wasClicked = false
            }

            expect(wasClicked).toBe(false)
        })

        test('label inherits font size', async () => {
            const sizes: any = await helper.componentEval((node: any) => {
                node.label = 'A label'
                return {
                    bodySize: window.getComputedStyle(document.body, null).getPropertyValue('font-size'),
                    labelSize: window.getComputedStyle(node.label, null).getPropertyValue('font-size')
                }
            })
            expect(sizes.bodySize).toEqual(sizes.labelSize)
        })

        test('label has "for" attribute', async () => {
            const ids: any = await helper.componentEval((node: any) => {
                node.label = 'A label'
                return {
                    label: node.label.getAttribute('for'),
                    id: node.inputid
                }
            })
            expect(ids.label).toEqual(ids.id)
        })

        test('label has for attribute after inputid update', async () => {
            const id: any = await helper.componentEval((node: any) => {
                node.label = 'A label'
                node.inputid = 'aninputid'
                return node.label.getAttribute('for')
            })
            expect(id).toEqual('aninputid')
        })

        test('label changes size if value', async () => {
            const size1: any = await helper.componentEval((node: any) => {
                node.label = 'A label'
                return node.label.getBoundingClientRect().height
            })

            const size2: any = await helper.componentEval((node: any) => new Promise((resolve) => {
                node.value = 'A value'
                setTimeout(() => resolve(node.label.getBoundingClientRect().height), 500)
            }))

            const size3: any = await helper.componentEval((node: any) => new Promise((resolve) => {
                node.value = ''
                setTimeout(() => resolve(node.label.getBoundingClientRect().height), 500)
            }))

            expect(size1).toBeGreaterThan(size2)
            expect(size1).toEqual(size3)
        })

        test('label changes size if focused', async () => {
            const size1: any = await helper.componentEval((node: any) => {
                node.label = 'A label'
                return node.label.getBoundingClientRect().height
            })

            page.focus('field-text input')
            const size2: any = await helper.componentEval((node: any) => new Promise((resolve) => setTimeout(() => resolve(node.label.getBoundingClientRect().height), 500)))
            page.focus('button')
            const size3: any = await helper.componentEval((node: any) => new Promise((resolve) => setTimeout(() => resolve(node.label.getBoundingClientRect().height), 500)))
            expect(size1).toBeGreaterThan(size2)
            expect(size1).toEqual(size3)
        })
    })




    /** ERROR ================================================================ */

    test.describe('error', async () => {

        test('inherits font size but 70%', async () => {
            const sizes: any = await helper.componentEval((node: any) => {
                node.error = 'A error'
                return {
                    bodySize: parseFloat(window.getComputedStyle(document.body, null).getPropertyValue('font-size')),
                    errorSize: parseFloat(window.getComputedStyle(node.error, null).getPropertyValue('font-size'))
                }
            })
            expect(sizes.errorSize).toEqual(sizes.bodySize * 0.7)
        })

        test('is displayed when validation error', async () => {
            await helper.validationError()
            const text = await (await (await helper.component())?.$('[slot="error"]'))?.innerText()
            const errorLength = text?.length
            expect(errorLength).toBeGreaterThan(0)
            await helper.clearError()
        })

        test('x icon is displayed when validation error', async () => {
            await helper.validationError()
            await page.evaluate(() => new Promise((resolve) => setTimeout(() => resolve(undefined), 500)))
            const dimensions = await (await (await (await helper.component())?.$('.icon-container.error-icon')))?.boundingBox()
            const visible = await page.isVisible('field-text .error-icon')
            expect(visible).toBe(true)
            expect(dimensions?.width).toBeGreaterThan(0)
            expect(dimensions?.height).toBeGreaterThan(0)
            await helper.clearError()
        })

        test('border is displayed when validation error', async () => {
            const borderInitial = await helper.componentEval((node: any) => window.getComputedStyle(node.shadowRoot.querySelector('.field-element-container-inner'), null).getPropertyValue('box-shadow'))
            expect(borderInitial === 'none').toBe(true)
            await helper.validationError()
            const borderError = await helper.componentEval((node: any) => window.getComputedStyle(node.shadowRoot.querySelector('.field-element-container-inner'), null).getPropertyValue('box-shadow'))
            expect(borderError !== 'none').toBe(true)
            await helper.clearError()
        })

        test('error-message attribute is set when validation error', async () => {
            expect(await (await helper.component())?.getAttribute('error-message')).toBeFalsy()
            await helper.validationError()
            expect(await (await helper.component())?.getAttribute('error-message')).toBeTruthy()
            await helper.clearError()
        })

        test('clears after validity is ok', async () => {
            await helper.validationError()
            await page.fill('field-text input', 'test@t')
            expect(await (await helper.component())?.getAttribute('error-message')).toBeFalsy()
            await helper.clearError()
        })
    })

    test.describe('property', async () => {
        /** INPUT ================================================================ */

        test('user input updates component value', async () => {
            const value = 'test@t'
            await page.fill('field-text input', value)
            expect(await (await helper.componentEval((node: any) => node.value))).toBe(value)
        })




        /** AUTOCOMPLETE ================================================================ */

        test('autocomplete updates input attribute', async () => {

            expect(await helper.componentEval((node: any) => {
                node.setAttribute('autocomplete', 'true')
                return node.input.getAttribute('autocomplete')
            })).toBe('on')

            expect(await helper.componentEval((node: any) => {
                node.setAttribute('autocomplete', 'false')
                return node.input.getAttribute('autocomplete')
            })).toBe('off')

            expect(await helper.componentEval((node: any) => {
                node.setAttribute('autocomplete', 'on')
                return node.input.getAttribute('autocomplete')
            })).toBe('on')

            expect(await helper.componentEval((node: any) => {
                node.setAttribute('autocomplete', 'off')
                return node.input.getAttribute('autocomplete')
            })).toBe('off')

            expect(await helper.componentEval((node: any) => {
                node.setAttribute('autocomplete', 'email')
                return node.input.getAttribute('autocomplete')
            })).toBe('email')

            expect(await helper.componentEval((node: any) => {
                node.removeAttribute('autocomplete')
                return node.input.getAttribute('autocomplete')
            })).toBe(null)

            expect(await helper.componentEval((node: any) => {
                node.autocomplete = true
                return node.input.getAttribute('autocomplete')
            })).toBe('on')

            expect(await helper.componentEval((node: any) => {
                node.autocomplete = false
                return node.input.getAttribute('autocomplete')
            })).toBe('off')

            expect(await helper.componentEval((node: any) => {
                node.autocomplete = 'on'
                return node.input.getAttribute('autocomplete')
            })).toBe('on')

            expect(await helper.componentEval((node: any) => {
                node.autocomplete = 'off'
                return node.input.getAttribute('autocomplete')
            })).toBe('off')

            expect(await helper.componentEval((node: any) => {
                node.autocomplete = 'email'
                return node.input.getAttribute('autocomplete')
            })).toBe('email')

            expect(await helper.componentEval((node: any) => {
                node.autocomplete = {}
                return node.input.getAttribute('autocomplete')
            })).toBe(null)
        })




        /** AUTOFOCUS ================================================================ */

        test('autofocus updates input attribute', async () => {

            expect(await helper.componentEval((node: any) => {
                node.setAttribute('autofocus', 'true')
                return node.input.getAttribute('autofocus')
            })).toBe('true')

            expect(await helper.componentEval((node: any) => {
                node.setAttribute('autofocus', 'false')
                return node.input.getAttribute('autofocus')
            })).toBe(null)

            expect(await helper.componentEval((node: any) => {
                node.removeAttribute('autofocus')
                return node.input.getAttribute('autofocus')
            })).toBe(null)

            expect(await helper.componentEval((node: any) => {
                node.autofocus = true
                return node.input.getAttribute('autofocus')
            })).toBe('true')

            expect(await helper.componentEval((node: any) => {
                node.autofocus = false
                return node.input.getAttribute('autofocus')
            })).toBe(null)

            expect(await helper.componentEval((node: any) => {
                node.autofocus = true
                return node.input.getAttribute('autofocus')
            })).toBe('true')

            expect(await helper.componentEval((node: any) => {
                node.autofocus = 'email'
                return node.input.getAttribute('autofocus')
            })).toBe(null)
        })

        test('autofocus sets or removes focus to the input', async () => {

            expect(await helper.componentEval((node: any) => {
                node.setAttribute('autofocus', 'true')
                return node.input === document.activeElement
            })).toBe(true)

            expect(await helper.componentEval((node: any) => {
                node.removeAttribute('autofocus')
                return node.input === document.activeElement
            })).toBe(false)

            expect(await helper.componentEval((node: any) => {
                node.autofocus = true
                return node.input === document.activeElement
            })).toBe(true)

            expect(await helper.componentEval((node: any) => {
                node.autofocus = false
                return node.input === document.activeElement
            })).toBe(false)
        })




        /** COUNT ================================================================ */

        test('count when set to true displays the value character count', async () => {
            const value = '1234'

            await helper.componentEval((node: any) => node.setAttribute('value', ''))

            await helper.componentEval((node: any) => node.setAttribute('count', 'true'))
            expect(await (await (await helper.component())?.$('.field-count-text'))?.innerText()).toBe('0')

            await page.fill('field-text input', value)
            expect(await (await (await helper.component())?.$('.field-count-text'))?.isVisible()).toBe(true)
            expect(await (await (await helper.component())?.$('.field-count-text'))?.innerText()).toBe('4')

            await helper.componentEval((node: any) => node.setAttribute('count', 'false'))
            expect(await (await (await helper.component())?.$('.field-count-text'))?.isVisible()).toBe(false)

            await helper.componentEval((node: any) => node.count = true)
            expect(await (await (await helper.component())?.$('.field-count-text'))?.isVisible()).toBe(true)

            await helper.componentEval((node: any) => node.count = false)
            expect(await (await (await helper.component())?.$('.field-count-text'))?.isVisible()).toBe(false)

            await helper.componentEval((node: any) => node.count = 'true')
            expect(await (await (await helper.component())?.$('.field-count-text'))?.isVisible()).toBe(true)

            await helper.componentEval((node: any) => node.count = 'false')
            expect(await (await (await helper.component())?.$('.field-count-text'))?.isVisible()).toBe(false)

            await helper.componentEval((node: any) => node.count = true)
            expect(await (await (await helper.component())?.$('.field-count-text'))?.isVisible()).toBe(true)

            await helper.componentEval((node: any) => node.count = 'ffdfdf')
            expect(await (await (await helper.component())?.$('.field-count-text'))?.isVisible()).toBe(false)
        })




        /** DISABLED ================================================================ */

        test('disabled updates the input disabled attribute', async () => {
            const value = 'dssdsd'
            await page.fill('field-text input', value)
            expect(await helper.componentEval((node: any) => node.value)).toBe(value)

            await helper.componentEval((node: any) => node.setAttribute('disabled', 'true'))
            expect(await (await (await helper.component())?.$('input'))?.isDisabled()).toBe(true)

            await helper.componentEval((node: any) => node.value = 'true')
            expect(await helper.componentEval((node: any) => node.value)).toBe(value)

            await helper.componentEval((node: any) => node.setAttribute('disabled', 'false'))
            expect(await (await (await helper.component())?.$('input'))?.isDisabled()).toBe(false)

            await helper.componentEval((node: any) => node.disabled = true)
            expect(await (await (await helper.component())?.$('input'))?.isDisabled()).toBe(true)

            await helper.componentEval((node: any) => node.disabled = false)
            expect(await (await (await helper.component())?.$('input'))?.isDisabled()).toBe(false)

            await helper.componentEval((node: any) => node.disabled = 'true')
            expect(await (await (await helper.component())?.$('input'))?.isDisabled()).toBe(true)

            await helper.componentEval((node: any) => node.disabled = 'false')
            expect(await (await (await helper.component())?.$('input'))?.isDisabled()).toBe(false)

            await helper.componentEval((node: any) => node.disabled = true)
            expect(await (await (await helper.component())?.$('input'))?.isDisabled()).toBe(true)

            await helper.componentEval((node: any) => node.disabled = 'ffdfdf')
            expect(await (await (await helper.component())?.$('input'))?.isDisabled()).toBe(false)
        })




        /** INPUTID ================================================================ */

        test('inputid updates the input id', async () => {
            const id = await helper.componentEval((node: any) => node.inputid)
            expect(await (await (await helper.component())?.$('input'))?.getAttribute('id')).toBe(id)
            expect(await (await (await helper.component())?.$('label'))?.getAttribute('for')).toBe(id)

            await helper.componentEval((node: any) => node.setAttribute('inputid', '1234'))
            expect(await (await (await helper.component())?.$('input'))?.getAttribute('id')).toBe('1234')
            expect(await (await (await helper.component())?.$('label'))?.getAttribute('for')).toBe('1234')

            await helper.componentEval((node: any) => node.inputid = '123456')
            expect(await (await (await helper.component())?.$('input'))?.getAttribute('id')).toBe('123456')
            expect(await (await (await helper.component())?.$('label'))?.getAttribute('for')).toBe('123456')

            await helper.componentEval((node: any) => node.inputid = '')
            expect(await (await (await helper.component())?.$('input'))?.getAttribute('id')).toBe('123456')
            expect(await (await (await helper.component())?.$('label'))?.getAttribute('for')).toBe('123456')

            await helper.componentEval((node: any) => node.inputid = null)
            expect(await (await (await helper.component())?.$('input'))?.getAttribute('id')).toBe('123456')
            expect(await (await (await helper.component())?.$('label'))?.getAttribute('for')).toBe('123456')

            await helper.componentEval((node: any) => node.inputid = false)
            expect(await (await (await helper.component())?.$('input'))?.getAttribute('id')).toBe('123456')
            expect(await (await (await helper.component())?.$('label'))?.getAttribute('for')).toBe('123456')
        })




        /** MAX ================================================================ */
        test('max updates the input maxlength', async () => {
            expect(await helper.componentEval((node: any) => node.max)).toBe(null)

            await helper.componentEval((node: any) => node.setAttribute('max', '10'))
            expect(await (await (await helper.component())?.$('input'))?.getAttribute('maxlength')).toBe('10')

            await helper.componentEval((node: any) => node.removeAttribute('max'))
            expect(await (await (await helper.component())?.$('input'))?.getAttribute('maxlength')).toBe(null)

            await helper.componentEval((node: any) => node.max = 20)
            expect(await (await (await helper.component())?.$('input'))?.getAttribute('maxlength')).toBe('20')

            await helper.componentEval((node: any) => node.max = false)
            expect(await (await (await helper.component())?.$('input'))?.getAttribute('maxlength')).toBe(null)

            await helper.componentEval((node: any) => node.max = '30')
            expect(await (await (await helper.component())?.$('input'))?.getAttribute('maxlength')).toBe("30")

            await helper.componentEval((node: any) => node.max = 'true')
            expect(await (await (await helper.component())?.$('input'))?.getAttribute('maxlength')).toBe(null)
        })

        test('max will be displayed if count is enabled', async () => {
            const value = '1234'
            await page.fill('field-text input', '')
            await helper.componentEval((node: any) => node.max = false)
            await helper.componentEval((node: any) => node.count = false)
            expect(await helper.componentEval((node: any) => node.max)).toBe(null)
            expect(await (await (await helper.component())?.$('.field-count-text'))?.isVisible()).toBe(false)


            await helper.componentEval((node: any) => node.setAttribute('count', 'true'))
            expect(await (await (await helper.component())?.$('.field-count-text'))?.innerText()).toBe('0')

            await helper.componentEval((node: any) => node.setAttribute('max', '10'))
            await page.fill('field-text input', value)
            expect(await (await (await helper.component())?.$('.field-count-text'))?.innerText()).toBe('4/10')


            await helper.componentEval((node: any) => node.removeAttribute('max'))
            expect(await (await (await helper.component())?.$('.field-count-text'))?.innerText()).toBe('4')

            await helper.componentEval((node: any) => node.max = 20)
            expect(await (await (await helper.component())?.$('.field-count-text'))?.innerText()).toBe('4/20')
        })



        /** MIN ================================================================ */

        test('min updates the input minlength', async () => {
            expect(await helper.componentEval((node: any) => node.min)).toBe(null)

            await helper.componentEval((node: any) => node.setAttribute('min', '10'))
            expect(await (await (await helper.component())?.$('input'))?.getAttribute('minlength')).toBe('10')

            await helper.componentEval((node: any) => node.removeAttribute('min'))
            expect(await (await (await helper.component())?.$('input'))?.getAttribute('minlength')).toBe(null)

            await helper.componentEval((node: any) => node.min = 20)
            expect(await (await (await helper.component())?.$('input'))?.getAttribute('minlength')).toBe('20')

            await helper.componentEval((node: any) => node.min = false)
            expect(await (await (await helper.component())?.$('input'))?.getAttribute('minlength')).toBe(null)

            await helper.componentEval((node: any) => node.min = '30')
            expect(await (await (await helper.component())?.$('input'))?.getAttribute('minlength')).toBe("30")

            await helper.componentEval((node: any) => node.min = 'true')
            expect(await (await (await helper.component())?.$('input'))?.getAttribute('minlength')).toBe(null)
        })



        /** NAME ================================================================ */

        test('name updates the input name', async () => {
            expect(await helper.componentEval((node: any) => node.name)).toBe(null)

            await helper.componentEval((node: any) => node.setAttribute('name', 'an-input'))
            expect(await (await (await helper.component())?.$('input'))?.getAttribute('name')).toBe('an-input')

            await helper.componentEval((node: any) => node.removeAttribute('name'))
            expect(await (await (await helper.component())?.$('input'))?.getAttribute('name')).toBe(null)

            await helper.componentEval((node: any) => node.name = 'an-input2')
            expect(await (await (await helper.component())?.$('input'))?.getAttribute('name')).toBe('an-input2')

            await helper.componentEval((node: any) => node.name = false)
            expect(await (await (await helper.component())?.$('input'))?.getAttribute('name')).toBe(null)
        })



        /** PATTERN ================================================================ */

        test('pattern updates the input pattern', async () => {
            expect(await helper.componentEval((node: any) => node.pattern)).toBe(null)

            await helper.componentEval((node: any) => node.setAttribute('pattern', 'apttern'))
            expect(await (await (await helper.component())?.$('input'))?.getAttribute('pattern')).toBe('apttern')

            await helper.componentEval((node: any) => node.removeAttribute('pattern'))
            expect(await (await (await helper.component())?.$('input'))?.getAttribute('pattern')).toBe(null)

            await helper.componentEval((node: any) => node.pattern = 'apttern2')
            expect(await (await (await helper.component())?.$('input'))?.getAttribute('pattern')).toBe('apttern2')

            await helper.componentEval((node: any) => node.pattern = false)
            expect(await (await (await helper.component())?.$('input'))?.getAttribute('pattern')).toBe(null)
        })



        /** REQUIRED ================================================================ */

        test('required updates the input required attribute', async () => {
            await helper.componentEval((node: any) => node.setAttribute('required', 'true'))
            expect(await (await (await helper.component())?.$('input'))?.getAttribute('required')).toBe('true')

            await helper.componentEval((node: any) => node.setAttribute('required', 'false'))
            expect(await (await (await helper.component())?.$('input'))?.getAttribute('required')).toBe(null)

            await helper.componentEval((node: any) => node.required = true)
            expect(await (await (await helper.component())?.$('input'))?.getAttribute('required')).toBe('true')

            await helper.componentEval((node: any) => node.required = false)
            expect(await (await (await helper.component())?.$('input'))?.getAttribute('required')).toBe(null)

            await helper.componentEval((node: any) => node.required = 'true')
            expect(await (await (await helper.component())?.$('input'))?.getAttribute('required')).toBe('true')

            await helper.componentEval((node: any) => node.required = 'false')
            expect(await (await (await helper.component())?.$('input'))?.getAttribute('required')).toBe(null)

            await helper.componentEval((node: any) => node.required = true)
            expect(await (await (await helper.component())?.$('input'))?.getAttribute('required')).toBe('true')

            await helper.componentEval((node: any) => node.required = 'ffdfdf')
            expect(await (await (await helper.component())?.$('input'))?.getAttribute('required')).toBe(null)
        })


        // /** TYPE ================================================================ */




        // /** VALUE ================================================================ */




        // /** COUNTELEMENT ================================================================ */




        // /** FOCUSED ================================================================ */




        // /** FORM ================================================================ */




        // /** ISEMPTY ================================================================ */




        // /** VALIDITY ================================================================ */




        // /** VALIDATIONMESSAGE ================================================================ */
    })
})















// /** ICONLEFT ================================================================ */
// /**
//  * take svg path
//  * is aligned correctly
//  * if svg, color is correct
//  */
// /** ICONRIGHT ================================================================ */




// /** CSS ================================================================ */
// /**
//  * ::part
//  */



// /** STATE OBJECT ================================================================ */




// /** EVENTS OBJECT ================================================================ */




// /** EVENTS ================================================================ */
// /**
//  * formsubmit
//  */
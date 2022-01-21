import { Page } from 'playwright';
import { test as baseTest } from '@playwright/test'
// import { serverBaseUrl } from '../../../development/server'
// import { FieldTextHelper } from './helper'

// async function goToPageAndGetHelper(page: Page) {
//     await page.goto(`${serverBaseUrl}/tests/components/field-text/`)
//     return new FieldTextHelper(page)
// }

// const slotsToTest = ['label', 'error', 'help', 'iconleft', 'iconright']

const test = baseTest.extend<{ letcodeInPage: Page }>({
    letcodeInPage: async ({ page }, use) => {
        await page.goto("https://letcode.in")
        // await use(letcodeInPage);
    }
})

export const it = test;
export const expect = test.expect;
import { Page } from '@playwright/test'

const elementName = 'field-text'

export class FieldTextHelper {
    page: Page

    constructor(page: Page) { this.page = page }

    async component() { return await this.page.$(elementName) }
    async componentEval(fn: any) { return await (await this.component())?.evaluate(fn) }

    async validationError() {
        await this.page.focus(`${elementName} input`)
        await this.componentEval((node: any) => {
            node.type = 'email'
            node.value = '1234'
            return node.error.textContent
        })
        await this.page.focus('button')
    }

    async clearError() {
        await this.componentEval((node: any) => {
            node.type = 'text'
            node.value = ''
            return node.error.textContent
        })
        await this.page.focus(`${elementName} input`)
        await this.page.focus('button')
    }

    async getCreatedOn(key: string) {
        return await this.page.$eval(`${elementName}`, (node: any, key: string) => node[key].createdOn, key)
    }

    async getSlotCountAndText(key: string) {
        return await {
            text: await (await this.page.$(`${elementName} [slot="${key}"]`))?.innerText(),
            slotCount: (await this.page.$$(`${elementName} [slot="${key}"]`)).length
        }
    }

    async slotAttributeString(key: string, value: string) {
        const args = { key, value }
        await this.page.$eval(elementName, (node, args) => node.setAttribute(args.key, args.value), args)
        return await this.getSlotCountAndText(key)
    }

    async slotAttributeSelector(key: string, value: string, setSlot: boolean = true, tag = 'div') {
        const args = { key, value, tag, id: `${key}attributeselector${setSlot ? 'slotted' : 'noslot'}`, setSlot }
        await this.page.$eval(elementName, (node, args) => {
            const el = document.createElement(args.tag)
            if (args.setSlot) { el.slot = args.key }
            el.textContent = args.value
            el.id = args.id
            document.body.appendChild(el)
            node.setAttribute(args.key, `#${args.id}`)
        }, args)

        const textAndCount = await this.getSlotCountAndText(key)

        return Object.assign({ id: args.id }, textAndCount)
    }

    async slotPropertyString(key: string, value: string) {
        const args = { key, value }
        await this.page.$eval(elementName, (node, args) => (node as any)[args.key] = args.value, args)
        return await this.getSlotCountAndText(key)
    }

    async slotPropertySelector(key: string, value: string, setSlot: boolean = true, tag = 'div') {
        const args = { key, value, tag, id: `${key}propertyselector${setSlot ? 'slotted' : 'noslot'}`, setSlot }
        await this.page.$eval(elementName, (node, args) => {
            const el = document.createElement(args.tag)
            const _node = node as any
            if (args.setSlot) { el.slot = args.key }
            el.textContent = args.value
            el.id = args.id
            document.body.appendChild(el)
            _node[args.key] = `#${args.id}`
        }, args)

        const textAndCount = await this.getSlotCountAndText(key)

        return Object.assign({ id: args.id }, textAndCount)
    }

    async slotPropertyDom(key: string, value: string, setSlot: boolean = true, tag = 'div') {
        const args = { key, value, tag, id: `${key}propertydom${setSlot ? 'slotted' : 'noslot'}`, setSlot }
        await this.page.$eval(elementName, (node, args) => {
            const _node = node as any
            const el = document.createElement(args.tag)
            if (args.setSlot) { el.slot = args.key }
            el.textContent = args.value
            _node[args.key] = el
        }, args)

        return await this.getSlotCountAndText(key)
    }

    async slotPropertyHTML(key: string, value: string, setScript = false) {
        const args = { key, value, setScript }
        await this.page.$eval(elementName, (node, args) => (node as any)[args.key] = args.setScript ? `<div>${args.value}<script type="text/javascript">var f = document.body.querySelector("field-text");\nf.parentElement.removeChild(f);</script></div>` : args.value, args)

        return await {
            script: await (await this.component())?.$('script'),
            src: await (await (await this.component())?.$(`[slot="${key}"] img`))?.getAttribute('src'),
            slotCount: (await this.page.$$(`${elementName} [slot="${key}"]`)).length
        }
    }

    async slotInsertElement(key: string, value: string, append = true, tag = 'div') {
        const args = { key, value, tag, append }
        await this.page.$eval(elementName, (node, args) => {
            const el = document.createElement(args.tag)
            el.slot = args.key
            el.textContent = args.value

            if (args.append) {
                node.appendChild(el)
            } else {
                node.insertBefore(el, node.firstChild)
            }
        }, args)

        return await this.getSlotCountAndText(key)
    }
}
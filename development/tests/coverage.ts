// import { Browser } from 'playwright'
import v8toIstanbul from 'v8-to-istanbul'
import { serverBaseUrl } from '../development/server'
import Get from '../src/utils/objects/get'
import Clone from '../src/utils/objects/clone'
import { Page } from '@playwright/test'

interface CoverStatement {
    start: number
    end: number
    count: number
}

interface CoverStatements {
    [key: string]: CoverStatement;
}

interface CoverReport {
    page: Page
    statements: CoverStatements
    totalLines: number
}

export interface StartCoverage {
    page: Page
    source: string
    baseStatements: CoverStatements
    totalLines: number
}

export interface CoverPage {
    report: (page: Page, baseStatements?: CoverStatements) => Promise<CoverReport>
    start: (page: Page, url: string) => Promise<StartCoverage>
    // report: () => Promise<CoverResult>
    // close: () => Promise<void>
    // start: () => Promise<void>
    // baseStatements: { [key: string]: CoverStatement }
    // source: string
    // totalLines: number
    // baseCoverage: {
    //     url: string;
    //     scriptId: string;
    //     source?: string | undefined;
    //     functions: {
    //         functionName: string;
    //         isBlockCoverage: boolean;
    //         ranges: {
    //             count: number;
    //             startOffset: number;
    //             endOffset: number;
    //         }[];
    //     }[];
    // }[]
}

export interface TestCoverageResult {
    source: string
    path: string
    baseStatements: CoverStatements
    totalLines: number
    coverage: {
        [key: string]: CoverStatements
    },
    scoring?: {
        percent: number
        percentWithLoad: number
        coverage: CoverStatements
        coverageWithLoad: CoverStatements
    }
}

function getFileUrl(file: string) {
    return file.split(serverBaseUrl).join('')
}

function getCoverage(converter: any) {
    return JSON.parse(JSON.stringify(converter.toIstanbul()))['']
}

async function getEntry(file: string, coverage: any) {
    let result: { [key: string]: any } = {}
    let source = ''

    for (const entry of coverage) {
        if (!entry.source) { continue }

        const fileUrl = getFileUrl(entry.url)

        if (fileUrl !== file) { continue }

        const converter = v8toIstanbul('', 0, { source: entry.source })

        await converter.load()

        converter.applyCoverage(entry.functions)
        source = entry.source.split('\n')
        result = getCoverage(converter)
        break
    }

    return { result, source }
}

function mergeStatements(coverage: any, baseStatements?: CoverStatements): CoverStatements {
    const keys = Object.keys(Get(coverage, 'statementMap', {}))

    return keys.reduce((target: { [key: string]: CoverStatement }, index: string) => {
        const s1 = Get(coverage, `s.${index}`, 0)

        const tmp = {
            start: coverage.statementMap[index].start,
            end: coverage.statementMap[index].end,
            count: s1,
        }

        if (baseStatements) {
            const s2 = Get(baseStatements, `${index}.count`, 0)
            if (s1 && s1 > s2) { target[index] = Object.assign(tmp, { count: s1 - s2 }) }
        } else if (s1) {
            target[index] = tmp
        }
        return target
    }, {})
}

export default async function Cover(file: string): Promise<CoverPage> {
    return {
        async report(page: Page, baseStatements?: CoverStatements) {
            const coverage = await page.coverage.stopJSCoverage()
            const reportCoverage = await getEntry(file, coverage)
            const statements = mergeStatements(reportCoverage.result, baseStatements)
            const totalLines = Object.keys(reportCoverage.result.statementMap || {}).length
            return { page, statements, totalLines }
        },

        async start(page: Page, url: string) {
            await page.coverage.startJSCoverage()

            await page.goto(url)

            const baseCoverage = await page.coverage.stopJSCoverage()
            const base = await getEntry(file, baseCoverage)
            const baseStatements = mergeStatements(base.result)
            const totalLines = Object.keys(base.result.statementMap || {}).length

            await page.coverage.startJSCoverage()

            return {
                page,
                source: base.source,
                baseStatements,
                totalLines
            }
        }
    }
}

export function scoreCoverage(coverage: TestCoverageResult) {
    const cloned: TestCoverageResult = Clone(coverage)
    const testCoverageKeys = Object.keys(cloned.coverage)
    const mergedTest = testCoverageKeys.reduce((target: CoverStatements, key: string) => {
        const testIndexes = Object.keys(cloned.coverage[key])
        testIndexes.forEach(index => {
            if (!target[index]) {
                target[index] = Clone(cloned.coverage[key][index])
            } else {
                target[index].count = target[index].count + cloned.coverage[key][index].count
            }
        })

        return target
    }, {})

    const mergedBase = Object.keys(mergedTest).reduce((target: CoverStatements, index: string) => {
        if (!target[index]) {
            target[index] = Clone(mergedTest[index])
        } else {
            target[index].count = target[index].count + mergedTest[index].count
        }
        return target
    }, Clone(cloned.baseStatements))

    cloned.scoring = {
        percent: (Object.keys(mergedTest).length / cloned.totalLines) * 100,
        percentWithLoad: (Object.keys(mergedBase).length / cloned.totalLines) * 100,
        coverage: mergedTest,
        coverageWithLoad: mergedBase
    }

    return cloned
}


 // // if (!url) { throw Error('A url is required') }

    // // const browser = await chromium.launch()
    // // let page = await browser.newPage()

    // // await page.coverage.startJSCoverage()
    // await page.goto(url)

    // // const baseCoverage = await page.coverage.stopJSCoverage()
    // // const base = await getEntry(file, baseCoverage)
    // // const baseStatements = mergeStatements(base.result)
    // // const totalLines = Object.keys(base.result.statementMap).length
    // let baseCoverage = await page.coverage.stopJSCoverage()
    // let base = await getEntry(file, baseCoverage)
    // let baseStatements = mergeStatements(base.result)
    // let totalLines = Object.keys(base.result.statementMap).length

    // return {
    //     async report() {
    //         const coverage = await page.coverage.stopJSCoverage()
    //         const reportCoverage = await getEntry(file, coverage)
    //         return mergeStatements(reportCoverage.result || {}, base.result || {})
    //     },

    //     async close() {
    //         try { await page.coverage.stopJSCoverage() } catch (error) { }
    //         // await browser.close()
    //     },

    //     async start(newUrl?: string) {
    //         if (newUrl) { await page.goto(newUrl) }
    //         await page.coverage.startJSCoverage()
    //     },

    //     source: base.source,
    //     baseStatements,
    //     totalLines,
    //     baseCoverage,
    //     // page,
    //     // browser
    // }
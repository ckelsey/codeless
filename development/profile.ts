import ChromeLauncher, { LaunchedChrome } from 'chrome-launcher'
import CDP from 'chrome-remote-interface'

async function main(chrome: LaunchedChrome) {
    const client = await CDP({
        // host: chrome.host,
        port: chrome.port,
        // url: chrome.
    })

    const {
        Debugger,
        Network,
        // Target,
        // DOM,
        Page,
        Performance,
        Profiler,
        Runtime
    } = client

    console.log(' ')
    console.log('====================')
    console.log('ENABLE')
    console.log(' ')

    await Promise.all([
        Debugger.enable({}),
        Network.enable({
            maxTotalBufferSize: 10000000,
            maxResourceBufferSize: 5000000
        }),
        Performance.enable({}),
        Page.enable(),
        Profiler.enable(),
        Profiler.enableRuntimeCallStats(),
        Runtime.enable(),
    ])

    console.log(' ')
    console.log('====================')
    console.log('startPreciseCoverage')
    console.log(' ')

    await Profiler.startPreciseCoverage({
        detailed: true,
        callCount: true
    })
    // await Profiler.start()

    // await Profiler.startTypeProfile()

    Page.on('domContentEventFired', async () => {
        // const types = await Profiler.takeTypeProfile()
        // await Profiler.stopTypeProfile()

        // console.log(JSON.stringify(types.result.find(n => n.url === 'http://localhost:3000/dist/components/field-text/index.js')))





        // const stats = await Profiler.getRuntimeCallStats()
        // const profile = await Profiler.stop()
        // console.log(profile)

        // console.log(' ')
        // console.log('====================')
        // console.log('profile.nodes')
        // console.log(JSON.stringify(profile.profile.nodes.filter(n => n.callFrame.url === 'http://localhost:3000/dist/components/field-text/index.js')))
        // console.log(' ')

        // console.log(' ')
        // console.log('====================')
        // console.log('profile.nodes')
        // console.log(profile.profile.nodes.filter(n => n.callFrame.url !== 'http://localhost:3000/browser-sync/browser-sync-client.js?v=2.26.14'))
        // console.log(' ')


        // console.log(' ')
        // console.log('====================')
        // console.log('profile.samples')
        // console.log(profile.profile.samples)
        // console.log(' ')


        // console.log(' ')
        // console.log('====================')
        // console.log('profile.timeDeltas')
        // console.log(profile.profile.timeDeltas)
        // console.log(' ')


        // console.log(' ')
        // console.log('====================')
        // console.log('getRuntimeCallStats')
        // console.log(JSON.stringify(stats))
        // console.log(' ')








        const coverage = await Profiler.takePreciseCoverage()
        await Profiler.stopPreciseCoverage()

        console.log(' ')
        console.log('====================')
        console.log('coverage')
        console.log(JSON.stringify(coverage.result.filter(n => n.url === 'http://localhost:3000/dist/components/field-text/index.js')))
        console.log(' ')

        // const isField = (current: any) => current.url === 'http://localhost:3000/dist/components/field-text/index.js'
        // const isInputId = (current: any) => current.functionName === 'set inputid'
        // const field = coverage.result.find(isField)
        // const initialId = field?.functions.filter(isInputId)

        // console.log(' ')
        // console.log('====================')
        // console.log('field')
        // console.log(field)
        // console.log(' ')

        // console.log(' ')
        // console.log('====================')
        // console.log('initialId')
        // console.log(initialId?.forEach(console.log))
        // console.log(' ')


        // await Profiler.startPreciseCoverage({})
        // await Runtime.evaluate({
        //     expression: `document.body.querySelector('field-text').inputid = 'hello'`
        // })

        // const inputid = await Profiler.takePreciseCoverage()
        // console.log(' ')
        // console.log('====================')
        // console.log('inputid')
        // console.log(inputid)
        // console.log(' ')

        // const field2 = inputid.result.find(isField)
        // console.log(' ')
        // console.log('====================')
        // console.log('field2')
        // console.log(field2)
        // console.log(' ')

        // const afterId = field2?.functions.filter(isInputId)
        // console.log(' ')
        // console.log('====================')
        // console.log('afterId')
        // console.log(afterId?.forEach(console.log))
        // console.log(' ')

        // await Profiler.stopPreciseCoverage()

        // const metrics = await Performance.getMetrics()
        // console.log(' ')
        // console.log('====================')
        // console.log('metrics')
        // console.log(metrics)
        // console.log(' ')

        chrome.kill()
    })


    /**
     * TO INVESTIGATE:
     * Profiler.startPreciseCoverage
     * Profiler.takePreciseCoverage
     * Profiler.preciseCoverageDeltaUpdate
     */







    // Network.((params)=>{
    //     console.log(params.request.url)
    // })
    // enable events then start!
    // await Network.enable()
    // await Page.enable()
    // await Page.navigate({ url: 'https://github.com' });
    // await DOM.enable()
    // // await Page.loadEventFired()

    // await client.Runtime.enable()

    // await client.Runtime.evaluate({ "expression": "console.log('hi')", "includeCommandLineAPI": true })


}

ChromeLauncher.launch({ startingUrl: 'http://localhost:3000' }).then(main)
import { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
    testDir: 'tests',
    use: {
        headless: true,
        ignoreHTTPSErrors: true,
        screenshot: 'off',
        video: 'off'
    },
    // timeout: 0
}

export default config
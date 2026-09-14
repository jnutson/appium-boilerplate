import { config as base } from './wdio.shared.conf.js';

const ios = process.env.MOBILE_OS === 'ios';
if (!process.env.DEVICE_NAME || !process.env.PLATFORM_VERSION) {
    throw new Error('Set DEVICE_NAME and PLATFORM_VERSION to an installed simulator or connected device.');
}

export const config: WebdriverIO.Config = {
    ...base,
    baseUrl: process.env.BASE_URL || 'https://memento-loop.co',
    specs: ['../tests/specs/memento.spec.ts'],
    maxInstances: 1,
    logLevel: 'info',
    connectionRetryCount: 0,
    services: [['appium', { args: { address: '127.0.0.1' } }]],
    capabilities: [{
        platformName: ios ? 'iOS' : 'Android',
        browserName: ios ? 'Safari' : 'Chrome',
        'appium:automationName': ios ? 'XCUITest' : 'UiAutomator2',
        'appium:deviceName': process.env.DEVICE_NAME,
        'appium:platformVersion': process.env.PLATFORM_VERSION,
        ...(process.env.DEVICE_UDID ? { 'appium:udid': process.env.DEVICE_UDID } : {}),
        'appium:orientation': 'PORTRAIT',
        'wdio:enforceWebDriverClassic': true,
    }],
};

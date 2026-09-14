import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const output = `artifacts/${process.env.MOBILE_OS || 'android'}-${Date.now()}`;

describe('Memento mobile smoke checks', () => {
    before(async () => { await mkdir(output, { recursive: true }); });

    for (const path of ['/', '/contact']) {
        it(`renders ${path} without document overflow or broken images`, async () => {
            await browser.url(path);
            await $('body').waitForDisplayed();
            await browser.waitUntil(async () => browser.execute(() =>
                Array.from(document.images).every(image => image.complete)),
            { timeout: 30000, timeoutMsg: 'Images did not finish loading' });
            await browser.saveScreenshot(`${output}/${path === '/' ? 'home' : 'contact'}.png`);
            const result = await browser.execute(() => ({
                overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
                broken: Array.from(document.images).filter(image => image.naturalWidth === 0).map(image => image.src),
            }));
            assert.equal(result.overflow, false, 'Document overflows the mobile viewport');
            assert.deepEqual(result.broken, [], 'Broken images');
        });
    }

    it('captures each home panel for human visual review', async () => {
        await browser.url('/');
        const panels = await $$('[data-panel]');
        const count = await panels.length;
        assert.ok(count > 0, 'Expected homepage panels');
        for (let index = 0; index < count; index++) {
            await panels[index].scrollIntoView();
            await browser.saveScreenshot(`${output}/panel-${index}.png`);
        }
    });

    it('opens the keyboard and validates required contact fields without submitting', async () => {
        await browser.url('/contact');
        const email = await $('input[name="email"]');
        await email.click();
        await email.setValue('invalid-email');
        await browser.saveScreenshot(`${output}/contact-keyboard.png`);
        const validity = await browser.execute(() => {
            const form = document.querySelector('form');
            const field = document.querySelector<HTMLInputElement>('input[name="email"]');
            return { formValid: form?.checkValidity(), emailValid: field?.checkValidity() };
        });
        assert.equal(validity.emailValid, false);
        assert.equal(validity.formValid, false);
        await email.clearValue();
    });
});

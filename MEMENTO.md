# Memento mobile testing

## Setup status

Dependencies installed with lifecycle scripts disabled. Initial npm audit reports 75 findings (7 critical, 42 high); review and remediate before treating this fork as approved infrastructure. No device tests have run: this Mac lacks full Xcode and Android SDK. Some dependencies may require their reviewed installation scripts before device execution.

The upstream full type check and ESLint default command currently fail. Run `npx tsc --noEmit -p tsconfig.memento.json` for a scoped check of the added configuration and tests; this skips third-party declaration checks and is not a runtime test.

Fork of webdriverio/appium-boilerplate (MIT). Production website files are not part of this repository.

## Run

Install dependencies with `npm ci`. Full Xcode plus an installed iOS simulator, or Android SDK plus a running Chrome-equipped emulator/device, is required. Command Line Tools alone cannot run iOS simulators. Real iPhones also require signing and device setup.

Use actual installed device names and OS versions:

```sh
MOBILE_OS=ios DEVICE_NAME='YOUR SIMULATOR NAME' PLATFORM_VERSION='YOUR IOS VERSION' npx wdio run config/wdio.memento.conf.ts
MOBILE_OS=android DEVICE_NAME='YOUR DEVICE NAME' PLATFORM_VERSION='YOUR ANDROID VERSION' npx wdio run config/wdio.memento.conf.ts
```

Set `DEVICE_UDID` when selecting a specific device. Android needs a compatible Chromedriver available to Appium. The server binds only to localhost and does not enable relaxed security. `BASE_URL` overrides the default https://memento-loop.co for preview testing.

Screenshots are saved under `artifacts/`. Tests never click Submit or send a contact inquiry. Existing upstream example scripts still test upstream examples; use the configuration above for Memento.

## Release checks still required

These smoke tests are not visual approval. Review every screenshot for chart readability, excessive section heights, clipping, spacing, and obscured controls. Panel screenshots show only their current viewport, not every part of tall panels.

Run on a small and large iPhone in Safari and an Android phone in Chrome. Manually check portrait/landscape, native swipe scrolling through every section, chart horizontal scrolling, all navigation and CTAs, keyboard open/closed, focus visibility, zoom, and reduced motion. Confirm the contact form remains usable above the keyboard.

Run form success, failure, timeout and duplicate-submission cases against a controlled preview with a mocked endpoint. Real delivery testing requires explicit approval. Do not approve a release on overflow checks alone.

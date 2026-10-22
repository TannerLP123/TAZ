# TAZ for iPad and iPhone

An Expo / React Native prototype for studios where customers pay the business and professionals receive payouts separately. The app uses native views, touch controls, safe areas, and a keyboard-aware checkout panel. iPad gets a workspace sidebar and right-side checkout; iPhone gets a compact layout, a horizontally scrolling schedule, and full-screen appointment details without payment controls.

## Run on an iPhone or iPad

Use Node.js 22 or newer (24 was validated):

```sh
npm ci
npm start -- --go
```

Open the QR code with an SDK-compatible Expo Go app. Your development computer and device must be able to reach one another; for the simplest setup, run Metro on your local computer on the same Wi-Fi network. A cloud terminal's localhost address is not reachable from your phone. If the installed Expo Go version doesn't support this project's SDK, use a compatible Expo Go version or an Expo development build.

On a Mac with Xcode and an installed iOS simulator:

```sh
npm run ios
```

The Linux cloud environment can generate the iOS JavaScript bundle but cannot run Xcode, build a signed iOS binary locally, or run Apple's simulator. A signed development build, TestFlight, and App Store distribution require additional Apple/Expo configuration. No Apple account, bundle identifier, payment provider, or signing credentials have been configured.

## Develop and validate

```sh
npm run web        # Browser version of the React Native app
npm test           # Schedule visibility and checkout arithmetic
npm run test:ui    # Shared-interface tests at tablet and phone dimensions
npm run export:ios # iOS JS/Hermes bundle; not an .ipa or native build
npm run export:web
```

For UI tests, install Chromium with `npx playwright install chromium`, or point `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` at an existing Chromium binary. Browser tests validate the shared interface; native-device testing is still required.

In restricted cloud environments, use:

```sh
export EXPO_HOME=/tmp/taz-expo
export EXPO_NO_TELEMETRY=1
export EXPO_OFFLINE=1
export npm_config_cache=/tmp/taz-npm-cache
npm ci
npm test
npm run export:ios -- --max-workers 2
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:ui
```

`EXPO_OFFLINE` avoids Expo metadata API calls, using the SDK's bundled dependency compatibility information. npm still verifies downloaded packages using its lockfile integrity hashes. The app itself needs no secrets or external services.

## Current scope

- A sample daily time-slot schedule, using the device's current date and local timezone.
- Owner view: all professionals, including those off duty.
- Receptionist view: only professionals working today.
- Professional view: only that professional's appointments.
- Home screen shows appointment and working-professional counts, without a scheduled-services dollar total.
- Every role can add appointments using Add appointment or by tapping an empty half-hour slot. The editor prefills the professional and time for slot bookings, and validates required details, prices, schedule bounds, and overlapping appointments. Professionals can book only themselves; other roles can book staff visible in their schedule view.
- Tap an appointment for an action popup with Edit appointment and Checkout. Checkout is disabled on iPhone. Completed demo appointments cannot be edited.
- Add and edit customer name, optional email, service, price, professional, time, and duration. Changes update the schedule immediately.
- iPad only: demo checkout with optional tip and total calculation.
- iPhone: appointment viewing only, with no tip entry or checkout action. Native iOS uses device type, so rotating an iPhone cannot enable checkout. Web previews use screen width to simulate these experiences.

## Planned terminal integration

The iPad will connect to a PAX A35 credit card terminal using a configured static IP address. This is a future feature, not implemented or connected yet. Terminal configuration, the supported processor/PAX integration, and on-device network testing will be addressed when that work starts. The iPhone will not take payments.

Initial appointments and customer information are fictional. New appointments, edits, checkout completion, and tips stay in memory and reset on reload. The role switcher demonstrates visibility, not authentication or secure authorization. No real payments, persistent appointments, staff management, customizable permissions, or professional payouts exist yet. Tap an empty slot to open the appointment editor; an appointment is created only after Save appointment.

The original browser prototype is retained in `legacy/` and `server.mjs`; run `npm run legacy:web` to use it. `src/schedule.mjs` supplies the sample data and visibility logic shared by both versions. The default app is now Expo.

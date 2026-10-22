# Personal Life OS — Arabic-first offline web app

Personal Life OS is being rebuilt as a real browser-first product rather than a temporary mockup. The new implementation uses React, TypeScript and Vite, with a typed IndexedDB data layer for offline-first personal data. The interface is Arabic-first, RTL, mobile-first, responsive and intentionally quiet rather than a generic dashboard. Capacitor wraps the same `dist` output for Android.

The older Kotlin/Compose/Room implementation remains preserved separately at `/home/ubuntu/personal-life-os`; this project does not overwrite it.

## What is implemented

The current web build includes a designed shell with light/dark themes, Today focus, task create/edit/delete/status/priority/due date, inbox capture and explicit conversion to task/note/commitment, projects with real steps and progress, people and linked commitments, a personal library with note editing, local search, review/progress, browser notifications where supported, validated JSON backup with merge or replace, an optional Gemini assistant, service-worker shell caching, and the Capacitor Android project.

Core storage is local IndexedDB. No Firebase, remote database or mandatory backend is used. The app does not turn every thought into a task and preserves the captured text when an inbox item is converted.

## Run the web app

Requirements: Node.js 20+ and pnpm 10+.

```bash
pnpm install
pnpm dev
```

Open the Vite preview at `http://localhost:3000`. For a production build:

```bash
pnpm typecheck
pnpm build
pnpm preview
```

The production build is in `dist/`. The service worker is registered only in production and caches the shell after the first successful visit. IndexedDB continues to hold the structured personal data locally.

## Optional Gemini setup

Gemini is not required for core functionality. To use it, open **المساعد**, enter a Gemini API key manually, and choose **حفظ محليًا**. The key is stored only in this browser's local IndexedDB; it is not in this repository, not in an environment file, and not passed to any build command. Each request sends only the current question plus a short instruction. The entire local database is never sent.

Important security limit: a key used directly from a browser or Capacitor APK is still exposed to the client and must not be described as secure. Do not use a personal key in a distributed production APK without a backend proxy and provider-side restrictions. No paid billing was enabled by this project. The previously exposed key should be revoked or rotated in Google AI Studio; it was not copied into this project.

## Android APK

Capacitor is already initialized under `android/` and uses the same React build. Requirements are Android SDK 35, Android build tools, JDK 21 for Capacitor 7, and Gradle (the wrapper is committed).

```bash
pnpm install
pnpm build
pnpm exec cap sync android
cd android
./gradlew assembleDebug --no-daemon
```

The debug APK produced in this environment was:

`android/app/build/outputs/apk/debug/app-debug.apk`

To open the native project in Android Studio:

```bash
pnpm exec cap open android
```

A connected device or emulator is required for installation testing. This environment had no connected `adb` device, so installation and runtime behavior inside a real Android WebView were not claimed as tested.

## Verification performed

The following commands were executed successfully in this environment:

```bash
pnpm typecheck
pnpm build
pnpm test:e2e
cd android && ./gradlew clean assembleDebug --no-daemon
cd android && ./gradlew test --no-daemon
```

Playwright Chromium was installed locally and 5 browser tests passed, covering Arabic home/inbox capture, task persistence and editing, projects/library flows, theme persistence, and people/commitment plus missing-Gemini-key handling. Direct Chromium screenshots were captured for mobile Today and Projects as well as the wider home/review surfaces. The Android debug APK build succeeded with JDK 21. No Android UI/device test was run because `adb devices -l` returned no attached device.

## Repository hygiene

Do not commit `node_modules`, `dist`, Android build outputs, local Gradle configuration, test artifacts or `.env` files. Run a secret scan before publishing. The source contains no real API key.

## Capacitor follow-up

The browser and APK currently use the browser Notification adapter. For production Android notifications, replace that adapter with a native Capacitor Local Notifications plugin and request Android notification permission through the native bridge. The web data model and IndexedDB repository can remain unchanged.

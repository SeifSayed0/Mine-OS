# Capacitor packaging path

The browser application is the source of truth. Capacitor should be added only after the web build and browser flows are accepted:

```bash
pnpm add @capacitor/core @capacitor/cli @capacitor/android
pnpm exec cap init "Personal Life OS" "com.personallifeos.app" --web-dir dist
pnpm build
pnpm exec cap add android
pnpm exec cap copy android
pnpm exec cap open android
```

The Android package will use the same React build and IndexedDB-backed local data layer. Notification behavior should be upgraded to a native Capacitor local-notifications adapter during packaging; the browser adapter remains feature-detected for web. An Android SDK, JDK 17+, Gradle/Android Studio and a signing choice are required to produce a distributable APK. Do not add a Gemini key to the frontend or commit it to the repository.

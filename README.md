# Termux Hub Android App

This repository now includes a native Android WebView wrapper for the Termux Hub website. The app packages the existing static Termux Hub website files directly inside the APK and loads them locally from app assets.

## What the app does

- Launches Termux Hub in a full-screen Android WebView
- Loads content from `file:///android_asset/www/index.html` (offline-capable website bundle)
- Preserves internal page navigation across Termux Hub HTML pages
- Supports JavaScript and DOM storage for existing site behavior

## Project structure

- `app/` - Android app module
  - `src/main/java/.../MainActivity.kt` - WebView host activity
  - `src/main/assets/www/` - Bundled static website files
  - `src/main/AndroidManifest.xml` - App manifest and launcher activity
  - `src/main/res/` - App theme, launcher icons, and layout resources
- `build.gradle`, `settings.gradle`, `gradle.properties` - Android Gradle configuration


## Build APK locally

### Prerequisites

- Android Studio (recommended) or Android SDK + Gradle
- JDK 17

### Build in Android Studio

1. Open this repository folder in Android Studio.
2. Let Gradle sync complete.
3. Build debug APK:
   - **Build > Build Bundle(s) / APK(s) > Build APK(s)**
4. Output APK location:
   - `app/build/outputs/apk/debug/app-debug.apk`

### Build from command line

If you have Gradle installed:

```bash
gradle :app:assembleDebug
```

For release builds:

```bash
gradle :app:assembleRelease
```

Release APK output:

- `app/build/outputs/apk/release/app-release.apk`

## F-Droid publishing preparation

F-Droid packages source directly, so include metadata in an `fdroiddata` merge request (or your own metadata repo) using the app ID:

- `io.github.krishsharmacode.termuxhub`

### Recommended metadata fields

- `Categories`: Internet, Education (adjust as needed)
- `License`: MIT
- `WebSite`: `https://krishsharma-code.github.io/termuxhub-website/`
- `SourceCode`: `https://github.com/krishsharma-code/termuxhub-website`
- `IssueTracker`: `https://github.com/krishsharma-code/termuxhub-website/issues`
- `AutoName`: Termux Hub
- `Summary`: Android WebView wrapper for the Termux Hub cybersecurity guides
- `Description`: Explain it bundles Termux Hub static pages and renders them in WebView

### Build config notes for F-Droid metadata

When writing metadata (`io.github.krishsharmacode.termuxhub.yml`), ensure:

- `RepoType: git`
- `Repo: https://github.com/krishsharma-code/termuxhub-website.git`
- `Builds` section uses Gradle target: `assembleRelease`
- `subdir` should remain repository root unless repo layout changes
- Add/update `CurrentVersion` and `CurrentVersionCode` based on `versionName` and `versionCode` in `app/build.gradle`

### Release checklist before submission

1. Create a signed release build.
2. Verify app launch and internal navigation on a physical device/emulator.
3. Confirm license file is present at repository root (`LICENSE`).
4. Ensure no non-free dependencies/assets are introduced.
5. Submit/update F-Droid metadata with current version and commit hash.

## License

This project is licensed under the MIT License. See [`LICENSE`](./LICENSE).

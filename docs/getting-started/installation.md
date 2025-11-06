---
sidebar_position: 1
---

# Installation

Get **react-native-pdf-jsi** up and running in your React Native project in just a few minutes.

## Prerequisites

Before installing, make sure you have:

- **React Native** 0.60 or higher
- **Node.js** 14 or higher
- **npm** or **yarn** package manager

### Platform-Specific Prerequisites

#### Android
- Android SDK 21 or higher
- Android NDK (for JSI acceleration)
- Gradle 7.0 or higher

#### iOS
- iOS 11.0 or higher
- Xcode 12 or higher
- CocoaPods 1.10 or higher

## Installation Steps

### Step 1: Install the Package

Using npm:

```bash
npm install react-native-pdf-jsi react-native-blob-util --save
```

Or using yarn:

```bash
yarn add react-native-pdf-jsi react-native-blob-util
```

:::info
`react-native-blob-util` is required for handling PDF files from various sources (URLs, local files, assets).
:::

### Step 2: Platform-Specific Setup

Select your platform for detailed setup instructions:

## iOS Setup

### Auto-linking (React Native 0.60+)

For React Native 0.60 and above, auto-linking will handle most of the setup:

```bash
cd ios && pod install && cd ..
```

That's it! iOS setup is complete.

### Manual Linking (React Native 0.59 and below)

If you're using an older version of React Native:

```bash
react-native link react-native-blob-util
react-native link react-native-pdf-jsi
```

Then run:

```bash
cd ios && pod install && cd ..
```

### Troubleshooting iOS

If you encounter pod install errors:

```bash
cd ios
pod deintegrate
pod cache clean --all
pod install
cd ..
```

## Android Setup

### React Native 0.60+

Auto-linking handles the basic setup. However, you need to add packaging options to your `android/app/build.gradle`:

```gradle title="android/app/build.gradle"
android {
    // ... other configurations
    
    packagingOptions {
        pickFirst 'lib/x86/libc++_shared.so'
        pickFirst 'lib/x86_64/libjsc.so'
        pickFirst 'lib/arm64-v8a/libjsc.so'
        pickFirst 'lib/arm64-v8a/libc++_shared.so'
        pickFirst 'lib/x86_64/libc++_shared.so'
        pickFirst 'lib/armeabi-v7a/libc++_shared.so'
    }
}
```

### React Native 0.59 and below

Link the packages manually:

```bash
react-native link react-native-blob-util
react-native link react-native-pdf-jsi
```

Then add the packaging options as shown above.

### Android Permissions

Add the following permissions to your `android/app/src/main/AndroidManifest.xml`:

```xml title="android/app/src/main/AndroidManifest.xml"
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- Required for downloading PDFs -->
    <uses-permission android:name="android.permission.INTERNET" />
    
    <!-- Required for file exports (Android 12 and below) -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission 
        android:name="android.permission.WRITE_EXTERNAL_STORAGE" 
        android:maxSdkVersion="28" />
    
    <!-- Required for notifications (Android 13+) -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    
    <!-- Add this to the <application> tag for HTTP URLs -->
    <application
        android:usesCleartextTraffic="true"
        ... >
    </application>
</manifest>
```

:::tip Google Play Compliance
react-native-pdf-jsi is built with NDK r28.2 and fully supports 16KB page sizes required by Google Play for Android 15+ devices. No additional configuration needed!
:::

### Troubleshooting Android

**Build fails with duplicate files:**

Make sure you've added the `packagingOptions` to your `build.gradle` as shown above.

**JSI not working:**

Ensure you have the Android NDK installed. Check in Android Studio: Tools → SDK Manager → SDK Tools → NDK.

**Cleartext traffic error:**

Add `android:usesCleartextTraffic="true"` to your `<application>` tag in AndroidManifest.xml.

## Windows Setup (Optional)

:::info Experimental
Windows support is experimental and uses standard bridge mode (not JSI).
:::

### React Native Windows 0.62+

1. Open your solution in Visual Studio 2019:

```bash
windows\yourapp.sln
```

2. Right-click Solution → Add → Existing Project

3. Add these projects:
   - `node_modules\react-native-pdf-jsi\windows\RCTPdf\RCTPdf.vcxproj`
   - `node_modules\react-native-blob-util\windows\ReactNativeBlobUtil\ReactNativeBlobUtil.vcxproj`

4. Right-click main application project → Add → Reference → Select both projects

5. In `pch.h`, add:

```cpp title="windows/yourapp/pch.h"
#include "winrt/RCTPdf.h"
#include "winrt/ReactNativeBlobUtil.h"
```

6. In `App.cpp`, before `InitializeComponent()`:

```cpp title="windows/yourapp/App.cpp"
PackageProviders().Append(winrt::RCTPdf::ReactPackageProvider());
PackageProviders().Append(winrt::ReactNativeBlobUtil::ReactPackageProvider());
```

## Verify Installation

Test that everything is installed correctly:

```jsx title="App.js"
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Pdf from 'react-native-pdf-jsi';

export default function App() {
  return (
    <View style={styles.container}>
      <Pdf
        source={{ uri: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }}
        style={styles.pdf}
        onLoadComplete={(numberOfPages) => {
          console.log(`PDF loaded with ${numberOfPages} pages`);
        }}
        onError={(error) => {
          console.error('PDF Error:', error);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pdf: {
    flex: 1,
  },
});
```

Run your app:

```bash
# iOS
npx react-native run-ios

# Android
npx react-native run-android
```

If you see a PDF rendered on screen, congratulations! Installation is complete.

## Common Issues

### Metro Bundler Cache

If you see unexpected errors, try clearing the Metro cache:

```bash
npx react-native start --reset-cache
```

### Native Build Issues

Clean and rebuild:

**iOS:**
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
npx react-native run-ios
```

**Android:**
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### Version Conflicts

If you encounter version conflicts with `react-native-blob-util`:

```bash
# Check for duplicate installations
npm ls react-native-blob-util

# Force reinstall
npm install react-native-blob-util@latest --force
```

## Next Steps

Now that you have react-native-pdf-jsi installed:

1. **[Quick Start Guide](/docs/getting-started/quick-start)** - Build your first PDF viewer
2. **[Core Features](/docs/features/core-features)** - Learn about basic features
3. **[Advanced Features](/docs/features/bookmarks)** - Explore bookmarks, export, and more

## Need Help?

- 📦 Check the [GitHub Issues](https://github.com/126punith/react-native-enhanced-pdf/issues)
- 📧 Email: punithm300@gmail.com
- 🐙 GitHub: [126punith/react-native-enhanced-pdf](https://github.com/126punith/react-native-enhanced-pdf)

---

**Installation complete?** Let's move on to [creating your first PDF viewer](/docs/getting-started/quick-start)!








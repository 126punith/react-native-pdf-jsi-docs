---
sidebar_position: 3
---

# Migration Guide

Switching from `react-native-pdf` to `react-native-pdf-jsi` is easy! This guide will help you migrate in minutes.

## Why Migrate?

| Reason | Benefit |
|--------|---------|
| **80x Faster Performance** | JSI acceleration for smoother scrolling |
| **Google Play Compliance** | 16KB page size support for Android 15+ |
| **Advanced Features FREE** | Bookmarks, export, PDF operations, analytics |
| **Better Memory Management** | Smart caching and lazy loading |
| **Future-Proof** | Built with latest NDK and architecture |

## Quick Migration Checklist

- [ ] Update package.json
- [ ] Update imports
- [ ] Review prop changes (minimal)
- [ ] Test on both platforms
- [ ] Enjoy advanced features!

## Step 1: Update Dependencies

### Remove old package

```bash
npm uninstall react-native-pdf
# or
yarn remove react-native-pdf
```

### Install new package

```bash
npm install react-native-pdf-jsi react-native-blob-util
# or
yarn add react-native-pdf-jsi react-native-blob-util
```

### Update native dependencies

**iOS:**
```bash
cd ios && pod install && cd ..
```

**Android:**
Add packaging options to `android/app/build.gradle`:

```gradle
android {
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

## Step 2: Update Imports

This is the easiest part - just change the import statement:

**Before (react-native-pdf):**
```jsx
import Pdf from 'react-native-pdf';
```

**After (react-native-pdf-jsi):**
```jsx
import Pdf from 'react-native-pdf-jsi';
```

That's it! The component API is designed to be compatible.

## Step 3: Review Props

Most props work exactly the same. Here's the compatibility matrix:

### ✅ Fully Compatible Props

These props work identically:

```jsx
<Pdf
  source={{ uri: 'https://example.com/document.pdf' }}
  password="yourpassword"
  page={1}
  scale={1.0}
  horizontal={false}
  fitPolicy={0}
  enableAntialiasing={true}
  enableAnnotationRendering={true}
  trustAllCerts={false}
  
  onLoadComplete={(numberOfPages, filePath) => {}}
  onPageChanged={(page, numberOfPages) => {}}
  onError={(error) => {}}
  onPageSingleTap={(page) => {}}
  onScaleChanged={(scale) => {}}
  
  style={{ flex: 1 }}
/>
```

### ⚡ Enhanced Props

These props are enhanced with JSI acceleration:

- `page` - Instant page changes with JSI
- `scale` - Smoother zoom with direct manipulation
- All event handlers - Near-zero latency

### 🆕 New Props

Additional props available in react-native-pdf-jsi:

```jsx
<Pdf
  // Lazy loading configuration
  preloadRadius={2}  // Preload 2 pages ahead/behind
  
  // Cache control
  cacheEnabled={true}
  
  // Performance monitoring
  enableMetrics={true}
  
  // ... all original props work too
/>
```

### ⚠️ Deprecated Props

Very few props are deprecated, and they have direct replacements:

| Old Prop | New Prop | Notes |
|----------|----------|-------|
| `activityIndicator` | Use custom loading UI | More flexible |
| `activityIndicatorProps` | Custom component | Better control |

## Step 4: Code Examples

### Basic Migration Example

**Before (react-native-pdf):**
```jsx
import React from 'react';
import { View } from 'react-native';
import Pdf from 'react-native-pdf';

export default function MyPDFViewer() {
  return (
    <View style={{ flex: 1 }}>
      <Pdf
        source={{ uri: 'https://example.com/document.pdf' }}
        onLoadComplete={(numberOfPages) => {
          console.log(`Pages: ${numberOfPages}`);
        }}
        style={{ flex: 1 }}
      />
    </View>
  );
}
```

**After (react-native-pdf-jsi):**
```jsx
import React from 'react';
import { View } from 'react-native';
import Pdf from 'react-native-pdf-jsi';  // Only change!

export default function MyPDFViewer() {
  return (
    <View style={{ flex: 1 }}>
      <Pdf
        source={{ uri: 'https://example.com/document.pdf' }}
        onLoadComplete={(numberOfPages) => {
          console.log(`Pages: ${numberOfPages}`);
          // JSI automatically enabled - 80x faster!
        }}
        style={{ flex: 1 }}
      />
    </View>
  );
}
```

### With State Management

**Before & After - Same code!**
```jsx
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import Pdf from 'react-native-pdf-jsi';  // Changed import

export default function MyPDFViewer() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  return (
    <View style={{ flex: 1 }}>
      <Text>Page {page} of {totalPages}</Text>
      <Button title="Next" onPress={() => setPage(p => p + 1)} />
      
      <Pdf
        source={{ uri: 'https://example.com/document.pdf' }}
        page={page}
        onLoadComplete={(pages) => setTotalPages(pages)}
        onPageChanged={(p) => setPage(p)}
        style={{ flex: 1 }}
      />
    </View>
  );
}
```

## Step 5: Test Your App

After migration, test these scenarios:

### Basic Functionality
- [ ] PDF loads from URL
- [ ] PDF loads from local file
- [ ] Page navigation works
- [ ] Zoom and pan work
- [ ] Password-protected PDFs work

### Performance
- [ ] Check console for JSI availability logs
- [ ] Verify smooth scrolling
- [ ] Check memory usage (should be lower)

### Platform-Specific
- [ ] iOS: Smooth rendering
- [ ] Android: Google Play compliance check

## Advanced: Use New Features

Now that you've migrated, take advantage of FREE advanced features:

### Add Bookmarks

```jsx
import { BookmarkManager } from 'react-native-pdf-jsi';

// Create a bookmark
await BookmarkManager.createBookmark(pdfPath, {
  page: 5,
  name: 'Important Section',
  color: '#FF5733',
  notes: 'Review this later'
});

// Load bookmarks
const bookmarks = await BookmarkManager.loadBookmarks(pdfPath);
```

### Export to Images

```jsx
import { ExportManager } from 'react-native-pdf-jsi';

// Export current page
const imagePath = await ExportManager.exportPageToImage(
  pdfPath,
  currentPage,
  { format: 'png', quality: 'high' }
);
```

### Split PDF

```jsx
import { ExportManager } from 'react-native-pdf-jsi';

// Split into two PDFs
const files = await ExportManager.splitPDF(pdfPath, [
  1, 10,   // Part 1: pages 1-10
  11, 20   // Part 2: pages 11-20
]);
```

### Track Reading

```jsx
import { AnalyticsManager } from 'react-native-pdf-jsi';

// Start session
await AnalyticsManager.startSession(pdfPath);

// Get statistics
const stats = await AnalyticsManager.getAnalytics(pdfPath);
console.log(`Total time: ${stats.totalTime}ms`);
console.log(`Pages read: ${stats.pagesRead}`);
```

## Troubleshooting

### Build Errors

**Error: Duplicate files**

Solution: Add packaging options to `android/app/build.gradle` (see Step 1).

**Error: Pod install fails**

Solution:
```bash
cd ios
rm -rf Pods Podfile.lock
pod deintegrate
pod install
cd ..
```

### Runtime Issues

**JSI not working**

Check console for:
```
📱 PDFJSI: JSI availability on android: AVAILABLE
```

If you see `UNAVAILABLE`, ensure Android NDK is installed.

**Performance not improved**

- Clear Metro cache: `npx react-native start --reset-cache`
- Clean build: `cd android && ./gradlew clean && cd ..`
- Reinstall app completely

### Migration Checklist

Use this checklist to ensure a smooth migration:

```markdown
- [ ] Removed react-native-pdf package
- [ ] Installed react-native-pdf-jsi
- [ ] Updated all imports
- [ ] Added Android packaging options
- [ ] Ran pod install on iOS
- [ ] Cleared Metro cache
- [ ] Clean build on both platforms
- [ ] Tested PDF loading
- [ ] Tested page navigation
- [ ] Verified JSI is working
- [ ] Tested on real devices
- [ ] Explored new features
```

## API Comparison

### Props Comparison

| Prop | react-native-pdf | react-native-pdf-jsi | Notes |
|------|------------------|---------------------|-------|
| `source` | ✓ | ✓ | Same |
| `page` | ✓ | ✓ | Same, but faster |
| `scale` | ✓ | ✓ | Same, smoother |
| `horizontal` | ✓ | ✓ | Same |
| `fitPolicy` | ✓ | ✓ | Same |
| `password` | ✓ | ✓ | Same |
| `onLoadComplete` | ✓ | ✓ | Same signature |
| `onPageChanged` | ✓ | ✓ | Same signature |
| `onError` | ✓ | ✓ | Same signature |
| `preloadRadius` | ✗ | ✓ | New in JSI |
| `enableMetrics` | ✗ | ✓ | New in JSI |

### Methods Comparison

| Method | react-native-pdf | react-native-pdf-jsi |
|--------|------------------|---------------------|
| `setPage()` | ✓ | ✓ (via props) |
| Bookmarks | ✗ | ✓ FREE |
| Export | ✗ | ✓ FREE |
| Split/Extract | ✗ | ✓ FREE |
| Analytics | ✗ | ✓ FREE |

## Need Help?

- 📦 [GitHub Issues](https://github.com/126punith/react-native-enhanced-pdf/issues)
- 📧 Email: punithm300@gmail.com
- 📖 [Full Documentation](/docs/intro)
- 🎥 [Demo Video](https://www.youtube.com/shorts/OmCUq9wLoHo)

## Migration Complete!

Congratulations! Your app now has:
- ⚡ 80x faster PDF rendering
- ✅ Google Play compliance
- 🆓 Advanced features included FREE
- 🚀 Future-proof architecture

Explore the [Features](/docs/features/core-features) section to discover everything you can do!








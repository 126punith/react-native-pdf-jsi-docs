---
sidebar_position: 7
title: File Management API (Android)
description: Download files to public storage and open folders
---

# File Management API (Android)

The File Management modules provide native Android functionality for downloading files to public storage and opening folders in file managers. These features ensure exported files are immediately visible and accessible to users.

:::info Platform Support
**Android Only** - These modules are currently available on Android. iOS support is planned for future releases.
:::

---

## FileDownloader Module

Download files to public storage with automatic MediaStore API integration for Android 10+ and legacy support for older versions.

### Import

```javascript
import { NativeModules } from 'react-native';
const { FileDownloader } = NativeModules;
```

### Check Availability

```javascript
if (FileDownloader) {
  // Module is available
} else {
  console.log('FileDownloader not available on this platform');
}
```

---

### `downloadToPublicFolder(sourcePath, fileName, mimeType)`

Download a file from app's internal/cache storage to public Downloads folder.

```javascript
const publicPath = await FileDownloader.downloadToPublicFolder(
  '/data/user/0/com.app/cache/temp.pdf',
  'document.pdf',
  'application/pdf'
);

console.log('Downloaded to:', publicPath);
// Output: /storage/emulated/0/Download/PDFDemoApp/document.pdf
```

**Parameters:**
- `sourcePath` (string): Full path to source file in app's cache or internal storage
- `fileName` (string): Desired file name for the downloaded file
- `mimeType` (string): MIME type of the file
  - `'application/pdf'` - PDF documents
  - `'image/png'` - PNG images
  - `'image/jpeg'` - JPEG images

**Returns:** `Promise<string>`
- Full path to the downloaded file in public storage

**Platform Behavior:**
- **Android 10+ (API 29+)**: Uses MediaStore API (Scoped Storage compliant)
- **Android 9 and below**: Uses legacy `Environment.getExternalStoragePublicDirectory()`

**Features:**
- ✅ Automatic folder creation (`Downloads/PDFDemoApp`)
- ✅ Files immediately visible in file managers
- ✅ Smart notifications with "Open Folder" action
- ✅ Media scanner notification for legacy devices
- ✅ No WRITE_EXTERNAL_STORAGE permission needed on Android 10+

---

### Complete Example

```javascript
import React, { useState } from 'react';
import { View, Button, Alert, NativeModules } from 'react-native';
import { PDFExporter } from 'NativeModules';

const { FileDownloader } = NativeModules;

const ExportAndDownload = ({ pdfPath }) => {
  const [downloading, setDownloading] = useState(false);

  const exportAndDownload = async () => {
    if (!FileDownloader) {
      Alert.alert('Error', 'File download not available on this platform');
      return;
    }

    setDownloading(true);

    try {
      // Step 1: Export page to image (to cache)
      const cachedImagePath = await PDFExporter.exportPageToImage(
        pdfPath,
        0, // First page
        {
          format: 'png',
          quality: 0.9,
          scale: 2.0
        }
      );

      // Step 2: Download to public storage
      const publicPath = await FileDownloader.downloadToPublicFolder(
        cachedImagePath,
        'exported-page.png',
        'image/png'
      );

      Alert.alert(
        '✅ Success',
        `File saved to:\n${publicPath}`,
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('Download failed:', error);
      Alert.alert('Error', error.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <View>
      <Button
        title={downloading ? 'Downloading...' : 'Export & Download'}
        onPress={exportAndDownload}
        disabled={downloading}
      />
    </View>
  );
};

export default ExportAndDownload;
```

---

### Error Handling

```javascript
try {
  const publicPath = await FileDownloader.downloadToPublicFolder(
    sourcePath,
    fileName,
    mimeType
  );
  console.log('Success:', publicPath);
} catch (error) {
  if (error.code === 'FILE_NOT_FOUND') {
    console.error('Source file does not exist');
  } else if (error.code === 'DOWNLOAD_ERROR') {
    console.error('Failed to download:', error.message);
  } else {
    console.error('Unknown error:', error);
  }
}
```

---

## FileManager Module

Open folders in file managers with multiple fallback strategies for maximum compatibility.

### Import

```javascript
import { NativeModules } from 'react-native';
const { FileManager } = NativeModules;
```

---

### `openDownloadsFolder()`

Open the Downloads/PDFDemoApp folder in the device's file manager.

```javascript
try {
  await FileManager.openDownloadsFolder();
  console.log('Folder opened successfully');
} catch (error) {
  console.error('Could not open folder:', error);
}
```

**Parameters:** None

**Returns:** `Promise<boolean>`
- `true` if folder was opened successfully

**Throws:** Error if all strategies fail

**Fallback Strategies:**
1. Opens specific `Downloads/PDFDemoApp` folder via DocumentsUI
2. Opens system Downloads app
3. Opens generic Files app
4. Shows file picker for user to choose file manager

---

### Complete Example with FileDownloader

```javascript
import React, { useState } from 'react';
import { View, Button, Alert, NativeModules } from 'react-native';

const { FileDownloader, FileManager } = NativeModules;

const ExportWithFolderOpen = ({ pdfPath }) => {
  const [exporting, setExporting] = useState(false);

  const exportAndOpenFolder = async () => {
    setExporting(true);

    try {
      // Export page to cache
      const cachedPath = await PDFExporter.exportPageToImage(
        pdfPath,
        0,
        { format: 'png', quality: 0.9, scale: 2.0 }
      );

      // Download to public storage
      const publicPath = await FileDownloader.downloadToPublicFolder(
        cachedPath,
        'page-1.png',
        'image/png'
      );

      // Show success and offer to open folder
      Alert.alert(
        '✅ Export Complete',
        'File saved to Downloads/PDFDemoApp',
        [
          { text: 'Done', style: 'cancel' },
          {
            text: 'Open Folder',
            onPress: async () => {
              try {
                await FileManager.openDownloadsFolder();
              } catch (e) {
                Alert.alert('Info', 'Please check Downloads/PDFDemoApp folder manually');
              }
            }
          }
        ]
      );

    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <View>
      <Button
        title={exporting ? 'Exporting...' : 'Export & Open Folder'}
        onPress={exportAndOpenFolder}
        disabled={exporting}
      />
    </View>
  );
};

export default ExportWithFolderOpen;
```

---

### Graceful Fallback

```javascript
const tryOpenFolder = async () => {
  if (!FileManager) {
    // Not on Android or module not available
    Alert.alert('Info', 'Please check Downloads/PDFDemoApp folder in your file manager');
    return;
  }

  try {
    await FileManager.openDownloadsFolder();
  } catch (error) {
    // All strategies failed
    Alert.alert(
      'Cannot Open Folder',
      'Please check Downloads/PDFDemoApp folder manually in your file manager',
      [{ text: 'OK' }]
    );
  }
};
```

---

## Batch Download Example

Download multiple files and open folder at the end:

```javascript
const batchExportAndDownload = async (pdfPath, pageNumbers) => {
  const downloadedFiles = [];

  try {
    // Export all pages
    for (let pageNum of pageNumbers) {
      // Export to cache
      const cachedPath = await PDFExporter.exportPageToImage(
        pdfPath,
        pageNum - 1,
        { format: 'png', quality: 0.9, scale: 2.0 }
      );

      // Download to public storage
      const publicPath = await FileDownloader.downloadToPublicFolder(
        cachedPath,
        `page-${pageNum}.png`,
        'image/png'
      );

      downloadedFiles.push(publicPath);
    }

    // Show success
    Alert.alert(
      '✅ Export Complete',
      `${downloadedFiles.length} files saved to Downloads/PDFDemoApp`,
      [
        { text: 'Done', style: 'cancel' },
        {
          text: 'Open Folder',
          onPress: () => FileManager.openDownloadsFolder()
        }
      ]
    );

    return downloadedFiles;

  } catch (error) {
    console.error('Batch download failed:', error);
    throw error;
  }
};

// Usage
batchExportAndDownload('/path/to/file.pdf', [1, 2, 3]);
```

---

## Android Permissions

### Android 10+ (API 29+)
**No permissions required!** MediaStore API doesn't need `WRITE_EXTERNAL_STORAGE` for adding files to public Downloads folder.

### Android 9 and Below
Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission 
  android:name="android.permission.WRITE_EXTERNAL_STORAGE" 
  android:maxSdkVersion="28" 
/>
```

This permission is automatically ignored on Android 10+ thanks to `maxSdkVersion="28"`.

---

## Customization

You can customize the folder name by modifying the native modules:

```java
// In android/src/main/java/org/wonday/pdf/FileDownloader.java
private static final String FOLDER_NAME = "YourAppName";

// In android/src/main/java/org/wonday/pdf/FileManager.java
private static final String FOLDER_NAME = "YourAppName";
```

After modification, rebuild your app for Android.

---

## Platform-Specific Code

Use Platform module to handle Android-only features:

```javascript
import { Platform, NativeModules, Alert } from 'react-native';

const downloadFile = async (sourcePath, fileName, mimeType) => {
  if (Platform.OS !== 'android') {
    Alert.alert('Not Supported', 'File download is only available on Android');
    return null;
  }

  const { FileDownloader } = NativeModules;
  
  if (!FileDownloader) {
    Alert.alert('Error', 'FileDownloader module not available');
    return null;
  }

  try {
    const publicPath = await FileDownloader.downloadToPublicFolder(
      sourcePath,
      fileName,
      mimeType
    );
    return publicPath;
  } catch (error) {
    console.error('Download failed:', error);
    return null;
  }
};
```

---

## TypeScript Support

```typescript
interface FileDownloaderStatic {
  downloadToPublicFolder(
    sourcePath: string,
    fileName: string,
    mimeType: 'application/pdf' | 'image/png' | 'image/jpeg' | string
  ): Promise<string>;
}

interface FileManagerStatic {
  openDownloadsFolder(): Promise<boolean>;
}

declare module 'react-native' {
  interface NativeModulesStatic {
    FileDownloader?: FileDownloaderStatic;
    FileManager?: FileManagerStatic;
  }
}
```

---

## Best Practices

### 1. Always Check Availability

```javascript
const { FileDownloader, FileManager } = NativeModules;

if (!FileDownloader || !FileManager) {
  console.log('File management modules not available');
  // Fallback to alternative solution
}
```

### 2. Handle Errors Gracefully

```javascript
try {
  await FileDownloader.downloadToPublicFolder(path, name, mime);
} catch (error) {
  // Show user-friendly error message
  Alert.alert('Download Failed', 'Could not save file. Please try again.');
}
```

### 3. Provide User Feedback

```javascript
// Show loading indicator
setDownloading(true);

try {
  const path = await FileDownloader.downloadToPublicFolder(...);
  // Show success message
  Alert.alert('Success', `File saved to ${path}`);
} finally {
  setDownloading(false);
}
```

### 4. Clean Up Cache Files

```javascript
import RNFS from 'react-native-fs';

// After downloading to public storage, optionally clean up cache
const cachedPath = await exportPage(...);
const publicPath = await FileDownloader.downloadToPublicFolder(...);

// Clean up cache file
await RNFS.unlink(cachedPath);
```

---

## Troubleshooting

### Files Not Appearing in File Manager

**Solution:** Files should appear immediately with MediaStore API. If not:
1. Check that you're using the correct MIME type
2. On Android 9 and below, the media scanner runs automatically
3. Restart the file manager app

### "Module Not Found" Error

**Solution:** 
1. Ensure you're running on Android
2. Rebuild the app: `npm run android`
3. Clear caches: `npm start --reset-cache`

### Permission Denied on Android 9

**Solution:** Add `WRITE_EXTERNAL_STORAGE` permission to AndroidManifest.xml

---

## See Also

- [Export API](/docs/api/export-api) - Export PDFs to images
- [PDFTextExtractor API](/docs/api/text-extractor-api) - Extract text from PDFs
- [PDF Component](/docs/api/pdf-component) - Main PDF viewer



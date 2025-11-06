---
sidebar_position: 5
title: Export to Images
description: Export PDF pages to PNG and JPEG images
---

# Export to Images

Export PDF pages to high-quality PNG and JPEG images with customizable quality settings, batch export, and progress tracking.

:::tip Free Feature
All export features are completely FREE!
:::

## Overview

The Export system provides:
- Export to PNG (with transparency)
- Export to JPEG (4 quality levels)
- Export to plain text
- Single page or batch export
- Custom scaling and sizing
- Progress callbacks
- Share integration
- File download to public storage

---

## Quick Start

```javascript
import { ExportManager } from 'react-native-pdf-jsi/src/export/ExportManager';

const exportManager = new ExportManager();

// Export single page to image
const imagePath = await exportManager.exportPageToImage('/path/to/file.pdf', 5, {
  format: 'jpeg',
  quality: 0.9,
  scale: 2.0
});

console.log('Exported to:', imagePath);
```

---

## Export Formats

### Export to JPEG

Best for photographs and complex images:

```javascript
const imagePath = await exportManager.exportPageToImage(filePath, pageNumber, {
  format: 'jpeg',
  quality: 0.9,    // 0.5 = low, 0.75 = medium, 0.9 = high, 1.0 = best
  scale: 2.0       // 2x resolution for retina displays
});
```

**Quality Levels:**
- `0.5` - Low (smaller file size)
- `0.75` - Medium (balanced)
- `0.9` - High (recommended)
- `1.0` - Best (largest file size)

---

### Export to PNG

Best for text, diagrams, and when transparency is needed:

```javascript
const imagePath = await exportManager.exportPageToImage(filePath, pageNumber, {
  format: 'png',
  quality: 0.9,
  scale: 2.0
});
```

**PNG Benefits:**
- Lossless compression
- Supports transparency
- Better for text and diagrams
- Larger file size than JPEG

---

### Export to Text

Export PDF content as plain text:

```javascript
// Export all pages
const allText = await exportManager.exportToText(filePath, {
  includePageNumbers: true,
  separator: '\n\n--- Page {page} ---\n\n'
});

// Export specific pages
const selectedText = await exportManager.exportToText(filePath, {
  pages: [1, 2, 3],  // Page numbers (1-indexed)
  includePageNumbers: false
});

// Export single page
const pageText = await exportManager.exportPageToText(filePath, 5);
```

---

## ExportManager API

### exportPageToImage()

Export a single page to an image.

```javascript
const imagePath = await exportManager.exportPageToImage(
  filePath,
  pageNumber,  // 1-indexed
  options
);
```

**Options:**
```typescript
{
  format: 'jpeg' | 'png';
  quality: number;    // 0.5-1.0
  scale: number;      // 1.0-3.0
  width?: number;     // Custom width (optional)
  height?: number;    // Custom height (optional)
}
```

**Returns:** `Promise<string>` - Path to exported image file

---

### exportToImages()

Export multiple pages to images:

```javascript
const imagePaths = await exportManager.exportToImages(filePath, {
  pages: [1, 2, 3],  // Or null for all pages
  format: 'jpeg',
  quality: 0.9,
  scale: 2.0
});

console.log(`Exported ${imagePaths.length} images`);
imagePaths.forEach((path, index) => {
  console.log(`Page ${index + 1}: ${path}`);
});
```

---

### exportPagesToImages()

Export pages with progress tracking:

```javascript
const imagePaths = await exportManager.exportPagesToImages(
  filePath,
  [1, 2, 3, 4, 5],  // Pages to export
  { format: 'png', quality: 0.9, scale: 2.0 },
  (current, total, imagePath) => {
    console.log(`Progress: ${current}/${total}`);
    console.log(`Exported: ${imagePath}`);
    setProgress((current / total) * 100);
  }
);
```

---

### exportToText()

Export pages to plain text:

```javascript
const text = await exportManager.exportToText(filePath, {
  pages: null,              // null = all pages, or [1, 2, 3]
  includePageNumbers: true, // Add page separators
  separator: '\n\n--- Page {page} ---\n\n',
  encoding: 'utf8'
});

console.log('Extracted text:', text);
```

---

### Share Exported Content

Share images or text:

```javascript
// Share image
await exportManager.share(imagePath, {
  title: 'PDF Page Export',
  type: 'file'
});

// Share text
await exportManager.share(extractedText, {
  title: 'PDF Text Export',
  type: 'text'
});
```

---

## Complete Example: Export Menu

```javascript
import React, { useState } from 'react';
import { View, Button, Text, Alert, ActivityIndicator } from 'react-native';
import { ExportManager } from 'react-native-pdf-jsi/src/export/ExportManager';
import { NativeModules } from 'react-native';

const { FileDownloader, FileManager } = NativeModules;

const ExportMenu = ({ pdfPath, currentPage, totalPages, onClose }) => {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const exportManager = new ExportManager();

  const exportPage = async (format, quality) => {
    setExporting(true);
    setProgress(0);

    try {
      // Step 1: Export to cache
      const cachedImagePath = await exportManager.exportPageToImage(
        pdfPath,
        currentPage,
        { format, quality, scale: 2.0 }
      );

      setProgress(50);

      // Step 2: Download to public storage (Android)
      let publicPath = cachedImagePath;
      if (FileDownloader) {
        publicPath = await FileDownloader.downloadToPublicFolder(
          cachedImagePath,
          `page-${currentPage}.${format}`,
          `image/${format}`
        );
      }

      setProgress(100);
      setExporting(false);

      // Step 3: Show success
      Alert.alert(
        'Export Complete',
        `Page ${currentPage} saved as ${format.toUpperCase()}`,
        [
          { text: 'Done', style: 'cancel', onPress: onClose },
          FileManager && {
            text: 'Open Folder',
            onPress: async () => {
              try {
                await FileManager.openDownloadsFolder();
              } catch (e) {
                Alert.alert('Info', 'Check Downloads/PDFDemoApp folder');
              }
            }
          },
          {
            text: 'Share',
            onPress: () => exportManager.share(publicPath, { type: 'file' })
          }
        ].filter(Boolean)
      );

    } catch (error) {
      setExporting(false);
      Alert.alert('Export Failed', error.message);
    }
  };

  const exportMultiplePages = async (format, quality, count) => {
    setExporting(true);
    setProgress(0);

    try {
      const pagesToExport = Array.from(
        { length: Math.min(count, totalPages) },
        (_, i) => i + 1
      );

      const imagePaths = await exportManager.exportPagesToImages(
        pdfPath,
        pagesToExport,
        { format, quality, scale: 2.0 },
        (current, total) => {
          setProgress((current / total) * 100);
        }
      );

      setExporting(false);
      Alert.alert(
        'Export Complete',
        `Exported ${imagePaths.length} pages to ${format.toUpperCase()}`,
        [{ text: 'OK', onPress: onClose }]
      );

    } catch (error) {
      setExporting(false);
      Alert.alert('Export Failed', error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
        Export Pages
      </Text>

      {exporting ? (
        <View style={{ alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={{ marginTop: 10 }}>{progress.toFixed(0)}%</Text>
        </View>
      ) : (
        <>
          <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
            Export Current Page ({currentPage})
          </Text>

          <Button
            title="PNG (High Quality)"
            onPress={() => exportPage('png', 0.9)}
          />
          <View style={{ height: 10 }} />
          <Button
            title="JPEG (Medium Quality)"
            onPress={() => exportPage('jpeg', 0.75)}
          />

          <Text style={{ fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>
            Export Multiple Pages
          </Text>

          <Button
            title="First 3 Pages (PNG)"
            onPress={() => exportMultiplePages('png', 0.9, 3)}
          />
          <View style={{ height: 10 }} />
          <Button
            title="First 5 Pages (JPEG)"
            onPress={() => exportMultiplePages('jpeg', 0.8, 5)}
          />
        </>
      )}
    </View>
  );
};

export default ExportMenu;
```

---

## Export Quality Guide

Choose quality based on use case:

### High Quality (0.9-1.0)
- **Use for:** Presentations, printing, professional use
- **File size:** Large (2-5MB per page)
- **Best format:** PNG for text, JPEG for photos

### Medium Quality (0.75-0.85)
- **Use for:** Web viewing, sharing, general use
- **File size:** Medium (500KB-2MB per page)
- **Best format:** JPEG

### Low Quality (0.5-0.7)
- **Use for:** Quick previews, email attachments
- **File size:** Small (200KB-500KB per page)
- **Best format:** JPEG

---

## Scale Factor Guide

| Scale | Resolution | Use Case | File Size |
|-------|------------|----------|-----------|
| 1.0x | Standard | Quick previews | Smallest |
| 1.5x | HD | Web viewing | Small |
| 2.0x | Retina | Mobile devices | Medium |
| 3.0x | Ultra HD | Professional printing | Large |

---

## Batch Export

Export multiple pages efficiently:

```javascript
const pagesToExport = [1, 5, 10, 15, 20]; // Specific pages

const results = await exportManager.exportPagesToImages(
  pdfPath,
  pagesToExport,
  {
    format: 'jpeg',
    quality: 0.8,
    scale: 2.0
  },
  (current, total, imagePath) => {
    console.log(`Exported ${current}/${total}`);
    console.log(`File: ${imagePath}`);
    
    // Update UI
    setExportProgress((current / total) * 100);
  }
);

console.log(`Batch export complete: ${results.length} images`);
```

---

## Export and Share

Export and immediately share:

```javascript
const exportAndShare = async (pdfPath, pageNumber) => {
  try {
    // Export page
    const imagePath = await exportManager.exportPageToImage(
      pdfPath,
      pageNumber,
      { format: 'jpeg', quality: 0.9, scale: 2.0 }
    );

    // Share
    const shareResult = await exportManager.exportAndShareImage(
      pdfPath,
      pageNumber,
      { format: 'jpeg', quality: 0.9 }
    );

    console.log('Share result:', shareResult);

  } catch (error) {
    Alert.alert('Error', error.message);
  }
};
```

---

## Export Text

Export PDF content as text:

```javascript
// Export all text
const allText = await exportManager.exportToText(pdfPath);

// Export with page markers
const textWithPages = await exportManager.exportToText(pdfPath, {
  includePageNumbers: true,
  separator: '\n\n========== Page {page} ==========\n\n'
});

// Export and share
const shareResult = await exportManager.exportAndShareText(pdfPath, {
  pages: [1, 2, 3],
  includePageNumbers: true
});
```

---

## Integration with File Management

Complete export workflow with file management:

```javascript
import { NativeModules } from 'react-native';
const { FileDownloader, FileManager } = NativeModules;

const exportWithDownload = async (pdfPath, pageNumber) => {
  try {
    // Step 1: Export to cache
    const cachedPath = await exportManager.exportPageToImage(
      pdfPath,
      pageNumber,
      { format: 'png', quality: 0.9, scale: 2.0 }
    );

    // Step 2: Download to public storage
    const publicPath = await FileDownloader.downloadToPublicFolder(
      cachedPath,
      `exported-page-${pageNumber}.png`,
      'image/png'
    );

    // Step 3: Show success and offer to open folder
    Alert.alert(
      'Export Complete',
      `Saved to Downloads/PDFDemoApp`,
      [
        { text: 'Done', style: 'cancel' },
        {
          text: 'Open Folder',
          onPress: () => FileManager.openDownloadsFolder()
        },
        {
          text: 'Share',
          onPress: () => exportManager.share(publicPath, { type: 'file' })
        }
      ]
    );

  } catch (error) {
    Alert.alert('Error', error.message);
  }
};
```

---

## Export Capabilities

Check what export features are available:

```javascript
const capabilities = exportManager.getCapabilities();

console.log('Export to text:', capabilities.exportToText);
console.log('Export to images:', capabilities.exportToImages);
console.log('PDF operations:', capabilities.mergePDFs);
console.log('Share:', capabilities.share);
```

---

## Module Information

Get export module details:

```javascript
const moduleInfo = exportManager.getModuleInfo();

console.log('Available:', moduleInfo.isAvailable);
console.log('Platform:', moduleInfo.platform);
console.log('Version:', moduleInfo.version);
console.log('Capabilities:', moduleInfo.capabilities);
```

---

## Time Estimates

Estimate export time before starting:

```javascript
const estimate = exportManager.estimateExportTime(10, 'jpeg');

console.log('Estimated time:', estimate.formatted);
// Output: "2 seconds" or "1 minutes"

console.log('Milliseconds:', estimate.milliseconds);
console.log('Seconds:', estimate.seconds);
```

**Average Times:**
- Text export: ~80ms per page
- Image export: ~200ms per page
- 10 pages to JPEG: ~2 seconds
- 50 pages to PNG: ~10 seconds

---

## Complete Example: Advanced Export

```javascript
import React, { useState } from 'react';
import { View, Text, Button, ProgressBarAndroid, FlatList, Alert } from 'react-native';
import { ExportManager } from 'react-native-pdf-jsi/src/export/ExportManager';

const AdvancedExportDemo = ({ pdfPath, totalPages }) => {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exportedFiles, setExportedFiles] = useState([]);
  const exportManager = new ExportManager();

  const exportWithProgress = async (pages, format, quality) => {
    setExporting(true);
    setProgress(0);
    setExportedFiles([]);

    try {
      const files = await exportManager.exportPagesToImages(
        pdfPath,
        pages,
        { format, quality, scale: 2.0 },
        (current, total, imagePath) => {
          // Update progress
          setProgress((current / total) * 100);
          
          // Track exported files
          setExportedFiles(prev => [...prev, {
            page: pages[current - 1],
            path: imagePath,
            size: 0  // Could get file size here
          }]);

          console.log(`Exported page ${pages[current - 1]}: ${imagePath}`);
        }
      );

      setExporting(false);
      
      Alert.alert(
        'Export Complete',
        `Successfully exported ${files.length} pages`,
        [
          { text: 'OK' },
          {
            text: 'Share All',
            onPress: () => shareMultipleFiles(files)
          }
        ]
      );

    } catch (error) {
      setExporting(false);
      Alert.alert('Export Failed', error.message);
    }
  };

  const shareMultipleFiles = async (files) => {
    // Share first file (or implement multi-file share)
    if (files.length > 0) {
      await exportManager.share(files[0], { type: 'file', title: 'Exported Pages' });
    }
  };

  const quickExport = async (preset) => {
    const presets = {
      'current-high': {
        pages: [currentPage],
        format: 'png',
        quality: 0.9
      },
      'first-5-medium': {
        pages: [1, 2, 3, 4, 5],
        format: 'jpeg',
        quality: 0.75
      },
      'all-low': {
        pages: Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1),
        format: 'jpeg',
        quality: 0.6
      }
    };

    const config = presets[preset];
    if (config) {
      await exportWithProgress(config.pages, config.format, config.quality);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
        Export Menu
      </Text>

      {exporting && (
        <View style={{ marginBottom: 20 }}>
          <ProgressBarAndroid
            styleAttr="Horizontal"
            indeterminate={false}
            progress={progress / 100}
            color="#6366F1"
          />
          <Text style={{ textAlign: 'center', marginTop: 5 }}>
            {progress.toFixed(0)}%
          </Text>
        </View>
      )}

      {!exporting && (
        <View>
          <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
            Quick Export
          </Text>
          <Button
            title="Current Page (High Quality)"
            onPress={() => quickExport('current-high')}
          />
          <View style={{ height: 10 }} />
          <Button
            title="First 5 Pages (Medium)"
            onPress={() => quickExport('first-5-medium')}
          />
          <View style={{ height: 10 }} />
          <Button
            title="First 10 Pages (Low)"
            onPress={() => quickExport('all-low')}
          />
        </View>
      )}

      {exportedFiles.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
            Exported Files ({exportedFiles.length})
          </Text>
          <FlatList
            data={exportedFiles}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={{
                padding: 10,
                marginBottom: 5,
                backgroundColor: '#e8f5e9',
                borderRadius: 5
              }}>
                <Text style={{ fontWeight: 'bold' }}>Page {item.page}</Text>
                <Text style={{ fontSize: 10, color: '#666' }}>{item.path}</Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default AdvancedExportDemo;
```

---

## Best Practices

### 1. Choose Appropriate Format

```javascript
// For text-heavy pages → PNG
if (pageHasMostlyText) {
  format = 'png';
  quality = 0.9;
}

// For image-heavy pages → JPEG
if (pageHasMostlyImages) {
  format = 'jpeg';
  quality = 0.8;
}
```

### 2. Use Progress Callbacks

```javascript
// Always show progress for multiple pages
exportPagesToImages(path, pages, options, (current, total) => {
  setProgress((current / total) * 100);
  setStatus(`Exporting page ${current} of ${total}...`);
});
```

### 3. Handle File Cleanup

```javascript
import RNFS from 'react-native-fs';

// After downloading to public storage, clean cache
const cachedPath = await exportPage(...);
const publicPath = await FileDownloader.downloadToPublicFolder(...);

// Clean up cache file
await RNFS.unlink(cachedPath);
```

### 4. Validate Before Export

```javascript
if (!pdfPath || !await RNFS.exists(pdfPath)) {
  Alert.alert('Error', 'PDF file not found');
  return;
}

if (pageNumber < 1 || pageNumber > totalPages) {
  Alert.alert('Error', 'Invalid page number');
  return;
}
```

---

## Platform Support

| Platform | PNG Export | JPEG Export | Text Export |
|----------|------------|-------------|-------------|
| Android | ✅ Full | ✅ Full | ✅ Full |
| iOS | ✅ Full | ✅ Full | ✅ Full |
| Windows | ⚠️ Limited | ⚠️ Limited | ✅ Full |

---

## Troubleshooting

### Export Fails

1. Check file exists
2. Check permissions
3. Ensure enough storage space
4. Try lower quality setting

### Out of Memory

1. Reduce quality setting
2. Reduce scale factor
3. Export fewer pages at once
4. Clear cache before exporting

### Slow Export

1. Lower quality setting
2. Reduce scale factor
3. Use JPEG instead of PNG
4. Export in smaller batches

---

## See Also

- [Export API](/docs/api/export-api) - Detailed API reference
- [File Management](/docs/api/file-management-api) - Download to storage
- [Export Demo](/docs/examples/export-demo) - Complete example

---
sidebar_position: 6
title: PDF Operations
description: Split, merge, extract, rotate, and delete PDF pages
---

# PDF Operations

Powerful PDF manipulation features including split, merge, extract, rotate, and delete operations.

:::tip Free Feature
All PDF operations are completely FREE!
:::

## Overview

Available operations:
- **Split PDF** - Divide PDF into multiple files
- **Merge PDFs** - Combine multiple PDFs into one
- **Extract Pages** - Create new PDF from specific pages
- **Rotate Pages** - Rotate pages by 90°, 180°, 270°
- **Delete Pages** - Remove unwanted pages

---

## Import

```javascript
import { ExportManager } from 'react-native-pdf-jsi/src/export/ExportManager';

const exportManager = new ExportManager();
```

---

## Split PDF

Divide a PDF into multiple files by page ranges.

```javascript
const splitResults = await exportManager.splitPDF(
  '/path/to/document.pdf',
  [
    [1, 10],   // Pages 1-10 → file 1
    [11, 20],  // Pages 11-20 → file 2
    [21, 30]   // Pages 21-30 → file 3
  ],
  '/path/to/output-directory'
);

console.log(`Created ${splitResults.length} PDF files:`);
splitResults.forEach((path, index) => {
  console.log(`Part ${index + 1}: ${path}`);
});
```

**Parameters:**
- `filePath` (string): Input PDF path
- `ranges` (Array): Array of `[startPage, endPage]` (1-indexed)
- `outputDir` (string, optional): Output directory (auto-generated if null)

**Returns:** `Promise<string[]>` - Array of paths to split PDF files

---

### Split PDF Example

```javascript
import React, { useState } from 'react';
import { View, Button, Text, Alert } from 'react-native';
import { ExportManager } from 'react-native-pdf-jsi/src/export/ExportManager';

const SplitPDFDemo = ({ pdfPath, totalPages }) => {
  const [splitting, setSplitting] = useState(false);
  const exportManager = new ExportManager();

  const splitInHalf = async () => {
    setSplitting(true);

    try {
      const midpoint = Math.ceil(totalPages / 2);
      
      const results = await exportManager.splitPDF(
        pdfPath,
        [
          [1, midpoint],           // First half
          [midpoint + 1, totalPages]  // Second half
        ]
      );

      Alert.alert(
        'Split Complete',
        `Created 2 PDF files:\n${results.join('\n')}`
      );

    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSplitting(false);
    }
  };

  const splitByChapters = async () => {
    setSplitting(true);

    try {
      // Split into 5-page chapters
      const ranges = [];
      for (let i = 1; i <= totalPages; i += 5) {
        const end = Math.min(i + 4, totalPages);
        ranges.push([i, end]);
      }

      const results = await exportManager.splitPDF(pdfPath, ranges);
      
      Alert.alert('Split Complete', `Created ${results.length} chapter files`);

    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSplitting(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>
        Split PDF
      </Text>

      <Button
        title={splitting ? 'Splitting...' : 'Split in Half'}
        onPress={splitInHalf}
        disabled={splitting}
      />
      <View style={{ height: 10 }} />
      <Button
        title={splitting ? 'Splitting...' : 'Split by 5-Page Chapters'}
        onPress={splitByChapters}
        disabled={splitting}
      />
    </View>
  );
};

export default SplitPDFDemo;
```

---

## Merge PDFs

Combine multiple PDF files into one:

```javascript
const mergedPath = await exportManager.mergePDFs(
  [
    '/path/to/file1.pdf',
    '/path/to/file2.pdf',
    '/path/to/file3.pdf'
  ],
  '/path/to/merged-output.pdf'  // Optional
);

console.log('Merged PDF created at:', mergedPath);
```

**Use Cases:**
- Combine report chapters
- Merge scanned documents
- Consolidate related PDFs
- Create comprehensive documents

---

## Extract Pages

Create a new PDF from specific pages:

```javascript
// Extract pages 1, 5, and 10
const extractedPath = await exportManager.extractPages(
  '/path/to/document.pdf',
  [1, 5, 10],  // Pages to extract (1-indexed)
  '/path/to/extracted.pdf'  // Optional
);

console.log('Extracted pages to:', extractedPath);
```

**Example: Extract Table of Contents**
```javascript
// Extract first 5 pages (TOC)
const tocPath = await exportManager.extractPages(pdfPath, [1, 2, 3, 4, 5]);
```

**Example: Extract Specific Chapters**
```javascript
// Extract chapter 3 (pages 20-30)
const chapter3Pages = Array.from({ length: 11 }, (_, i) => 20 + i);
const chapter3Path = await exportManager.extractPages(pdfPath, chapter3Pages);
```

---

## Rotate Pages

Rotate specific pages in a PDF:

```javascript
const rotatedPath = await exportManager.rotatePages(
  '/path/to/document.pdf',
  {
    1: 90,    // Rotate page 1 by 90° clockwise
    5: 180,   // Rotate page 5 by 180°
    10: 270   // Rotate page 10 by 270° (or 90° counter-clockwise)
  },
  '/path/to/rotated.pdf'  // Optional
);

console.log('Rotated PDF created at:', rotatedPath);
```

**Rotation Angles:**
- `90` - 90° clockwise
- `180` - Upside down
- `270` - 90° counter-clockwise

---

## Delete Pages

Remove unwanted pages from a PDF:

```javascript
const newPath = await exportManager.deletePages(
  '/path/to/document.pdf',
  [2, 5, 8],  // Pages to delete (1-indexed)
  '/path/to/output.pdf'  // Optional
);

console.log('PDF with deleted pages:', newPath);
```

**Use Cases:**
- Remove blank pages
- Remove unnecessary content
- Create condensed versions
- Remove sensitive pages

---

## Complete Example: PDF Operations Menu

```javascript
import React, { useState } from 'react';
import { View, Text, Button, Alert, ScrollView } from 'react-native';
import { ExportManager } from 'react-native-pdf-jsi/src/export/ExportManager';

const PDFOperationsMenu = ({ pdfPath, totalPages, onClose }) => {
  const [processing, setProcessing] = useState(false);
  const exportManager = new ExportManager();

  const handleSplit = async () => {
    setProcessing(true);

    try {
      const midpoint = Math.ceil(totalPages / 2);
      
      const results = await exportManager.splitPDF(
        pdfPath,
        [
          [1, midpoint],
          [midpoint + 1, totalPages]
        ]
      );

      Alert.alert(
        'Split Complete',
        `Created:\n• Part 1 (pages 1-${midpoint})\n• Part 2 (pages ${midpoint + 1}-${totalPages})`,
        [{ text: 'OK', onPress: onClose }]
      );

    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleExtract = async () => {
    setProcessing(true);

    try {
      // Extract first 3 pages
      const extractedPath = await exportManager.extractPages(
        pdfPath,
        [1, 2, 3]
      );

      Alert.alert(
        'Extract Complete',
        `Created new PDF with 3 pages:\n${extractedPath}`,
        [{ text: 'OK', onPress: onClose }]
      );

    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleRotate = async () => {
    setProcessing(true);

    try {
      // Rotate first page 90° clockwise
      const rotatedPath = await exportManager.rotatePages(
        pdfPath,
        { 1: 90 }
      );

      Alert.alert(
        'Rotation Complete',
        `Page 1 rotated 90° clockwise:\n${rotatedPath}`,
        [{ text: 'OK', onPress: onClose }]
      );

    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    // Show confirmation
    Alert.alert(
      'Delete Pages',
      'Delete page 2? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setProcessing(true);

            try {
              const newPath = await exportManager.deletePages(
                pdfPath,
                [2]  // Delete page 2
              );

              Alert.alert(
                'Delete Complete',
                `Created new PDF without page 2:\n${newPath}`,
                [{ text: 'OK', onPress: onClose }]
              );

            } catch (error) {
              Alert.alert('Error', error.message);
            } finally {
              setProcessing(false);
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
        PDF Operations
      </Text>

      {processing && (
        <View style={{ marginBottom: 20, padding: 15, backgroundColor: '#fff3cd' }}>
          <Text style={{ textAlign: 'center' }}>Processing...</Text>
        </View>
      )}

      <OperationButton
        title="Split PDF in Half"
        description="Divide PDF into 2 equal parts"
        onPress={handleSplit}
        disabled={processing}
        icon="✂️"
      />

      <OperationButton
        title="Extract First 3 Pages"
        description="Create new PDF with pages 1-3"
        onPress={handleExtract}
        disabled={processing}
        icon="📄"
      />

      <OperationButton
        title="Rotate First Page"
        description="Rotate page 1 by 90° clockwise"
        onPress={handleRotate}
        disabled={processing}
        icon="🔄"
      />

      <OperationButton
        title="Delete Page 2"
        description="Remove page 2 from PDF"
        onPress={handleDelete}
        disabled={processing}
        icon="🗑️"
      />
    </ScrollView>
  );
};

const OperationButton = ({ title, description, onPress, disabled, icon }) => (
  <View style={{
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8
  }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
      <Text style={{ fontSize: 24, marginRight: 10 }}>{icon}</Text>
      <Text style={{ fontSize: 16, fontWeight: 'bold', flex: 1 }}>{title}</Text>
    </View>
    <Text style={{ color: '#666', marginBottom: 10 }}>{description}</Text>
    <Button title="Execute" onPress={onPress} disabled={disabled} />
  </View>
);

export default PDFOperationsMenu;
```

---

## Operation Details

### Split PDF

**Use Cases:**
- Split large PDF into chapters
- Separate document sections
- Create individual files per topic
- Reduce file sizes

**Example: Split into 10-page chunks**
```javascript
const ranges = [];
for (let i = 1; i <= totalPages; i += 10) {
  ranges.push([i, Math.min(i + 9, totalPages)]);
}

const files = await exportManager.splitPDF(pdfPath, ranges);
console.log(`Created ${files.length} files of ~10 pages each`);
```

---

### Merge PDFs

**Use Cases:**
- Combine report sections
- Merge scanned documents
- Consolidate related files
- Create complete documents

**Example: Merge in specific order**
```javascript
const files = [
  '/path/to/cover.pdf',
  '/path/to/toc.pdf',
  '/path/to/chapter1.pdf',
  '/path/to/chapter2.pdf',
  '/path/to/references.pdf'
];

const mergedPath = await exportManager.mergePDFs(files);
console.log('Complete document:', mergedPath);
```

---

### Extract Pages

**Use Cases:**
- Extract important pages
- Create summaries
- Share specific sections
- Remove sensitive content

**Example: Extract odd pages**
```javascript
const oddPages = Array.from(
  { length: Math.ceil(totalPages / 2) },
  (_, i) => i * 2 + 1
);

const oddPagesPath = await exportManager.extractPages(pdfPath, oddPages);
```

---

### Rotate Pages

**Use Cases:**
- Fix scanned pages
- Correct orientation
- Adjust landscape pages
- Fix upside-down content

**Example: Rotate all landscape pages**
```javascript
// Assume pages 5, 10, 15 are landscape
const rotations = {
  5: 90,
  10: 90,
  15: 90
};

const rotatedPath = await exportManager.rotatePages(pdfPath, rotations);
```

---

### Delete Pages

**Use Cases:**
- Remove blank pages
- Delete unnecessary content
- Remove sensitive information
- Create condensed versions

**Example: Remove all even pages**
```javascript
const evenPages = Array.from(
  { length: Math.floor(totalPages / 2) },
  (_, i) => (i + 1) * 2
);

const newPath = await exportManager.deletePages(pdfPath, evenPages);
console.log('Removed', evenPages.length, 'pages');
```

---

## Error Handling

```javascript
try {
  const result = await exportManager.splitPDF(pdfPath, ranges);
} catch (error) {
  if (error.message.includes('not found')) {
    Alert.alert('Error', 'PDF file not found');
  } else if (error.message.includes('invalid range')) {
    Alert.alert('Error', 'Invalid page range');
  } else if (error.message.includes('insufficient space')) {
    Alert.alert('Error', 'Not enough storage space');
  } else {
    Alert.alert('Error', error.message);
  }
}
```

---

## Best Practices

### 1. Validate Page Ranges

```javascript
const isValidRange = (start, end, totalPages) => {
  return start >= 1 && end <= totalPages && start <= end;
};

if (!isValidRange(startPage, endPage, totalPages)) {
  Alert.alert('Error', 'Invalid page range');
  return;
}
```

### 2. Confirm Destructive Operations

```javascript
Alert.alert(
  'Delete Pages',
  'This will create a new PDF without the selected pages. Continue?',
  [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: performDelete }
  ]
);
```

### 3. Provide Progress Feedback

```javascript
// Show loading indicator
setOperating(true);
try {
  const result = await exportManager.splitPDF(...);
  // Show success
} finally {
  setOperating(false);
}
```

### 4. Handle Output Files

```javascript
// After operation, optionally download to public storage
import { NativeModules } from 'react-native';
const { FileDownloader } = NativeModules;

const newPath = await exportManager.splitPDF(...);

// Download to public folder
if (FileDownloader) {
  await FileDownloader.downloadToPublicFolder(
    newPath,
    'split-document.pdf',
    'application/pdf'
  );
}
```

---

## Platform Support

| Operation | Android | iOS | Windows |
|-----------|---------|-----|---------|
| Split PDF | ✅ Full | ✅ Full | ⚠️ Limited |
| Merge PDFs | ✅ Full | ✅ Full | ⚠️ Limited |
| Extract Pages | ✅ Full | ✅ Full | ⚠️ Limited |
| Rotate Pages | ✅ Full | ✅ Full | ⚠️ Limited |
| Delete Pages | ✅ Full | ✅ Full | ⚠️ Limited |

---

## Performance

| Operation | Time (10 pages) | Time (100 pages) |
|-----------|-----------------|------------------|
| Split | ~500ms | ~2s |
| Merge (3 files) | ~800ms | ~3s |
| Extract | ~300ms | ~1s |
| Rotate | ~400ms | ~1.5s |
| Delete | ~300ms | ~1s |

---

## Troubleshooting

### Operation Fails

1. Check file exists
2. Verify page ranges are valid
3. Ensure sufficient storage space
4. Check write permissions

### Out of Memory

1. Process smaller batches
2. Split large operations
3. Clear app cache first

### Slow Performance

1. Close other apps
2. Reduce page count
3. Use faster storage (internal vs SD card)

---

## See Also

- [Export API](/docs/api/export-api) - Export API reference
- [PDF Component](/docs/api/pdf-component) - Main viewer
- [File Management](/docs/api/file-management-api) - File operations

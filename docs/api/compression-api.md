---
sidebar_position: 8
title: PDF Compression API
description: Compress PDF files with presets and custom settings
---

# PDF Compression API

Compress PDF files using native rendering with enterprise-grade features including progress callbacks, compression presets, batch compression, and detailed statistics.

:::tip Free Feature
PDF compression is completely FREE and included with react-native-pdf-jsi!
:::

## Import

```javascript
import PDFCompressor from 'react-native-pdf-jsi/src/PDFCompressor';
import { CompressionPresets } from 'react-native-pdf-jsi/src/PDFCompressionPresets';
```

---

## Compression Presets

Five pre-configured presets optimized for different use cases:

| Preset | Quality | Downscale | Max Size | Best For | Est. Ratio |
|--------|---------|-----------|----------|----------|------------|
| **EMAIL** | 70 | Yes | 1080x1920 | Email attachments | ~30% |
| **WEB** | 80 | Yes | 1920x2560 | Web viewing | ~50% |
| **MOBILE** | 75 | Yes | 1080x1920 | Mobile devices | ~40% |
| **PRINT** | 95 | No | Original | Printing | ~90% |
| **ARCHIVE** | 90 | No | Original | Long-term storage | ~85% |

```javascript
// Use a preset
await PDFCompressor.compress(filePath, { preset: 'EMAIL' });
await PDFCompressor.compress(filePath, { preset: 'WEB' });
await PDFCompressor.compress(filePath, { preset: 'PRINT' });
```

---

## Methods

### `compress(filePath, options, outputPath)`

Compress a PDF file with customizable options.

```javascript
const result = await PDFCompressor.compress(
  '/path/to/input.pdf',
  {
    preset: 'WEB',           // Or use custom options
    quality: 80,              // 0-100
    downscale: true,          // Enable downscaling
    maxWidth: 1920,           // Max page width
    maxHeight: 2560,          // Max page height
    onProgress: (current, total, percentage) => {
      console.log(`Progress: ${percentage}%`);
    }
  },
  '/path/to/output.pdf'     // Optional: auto-generated if null
);

console.log('Original size:', result.originalSize);
console.log('Compressed size:', result.compressedSize);
console.log('Compression ratio:', result.compressionRatio + '%');
console.log('Output path:', result.outputPath);
```

**Parameters:**
- `filePath` (string): Path to input PDF file
- `options` (object): Compression options
  - `preset` (string): Use predefined preset (EMAIL, WEB, PRINT, ARCHIVE, MOBILE)
  - `quality` (number): Image quality 0-100 (default: 80)
  - `downscale` (boolean): Enable image downscaling (default: false)
  - `maxWidth` (number): Maximum page width (default: 1920)
  - `maxHeight` (number): Maximum page height (default: 2560)
  - `onProgress` (function): Progress callback
- `outputPath` (string, optional): Output file path (auto-generated if null)

**Returns:** `Promise<object>`
```typescript
{
  success: boolean;
  outputPath: string;
  originalSize: number;      // Bytes
  compressedSize: number;    // Bytes
  compressionRatio: number;  // Percentage (0-100)
  pageCount: number;
  processingTime: number;    // Milliseconds
}
```

---

### `smartCompress(filePath, outputPath)`

Automatically analyze PDF content and apply optimal compression settings.

```javascript
const result = await PDFCompressor.smartCompress('/path/to/document.pdf');

console.log('Content type detected:', result.contentType);
console.log('Settings used:', result.settingsUsed);
console.log('Compression ratio:', result.compressionRatio + '%');
```

**How it works:**
1. Analyzes PDF content (text-heavy vs image-heavy)
2. Detects image types and quality
3. Automatically selects best compression settings
4. Applies optimal preset

**Content Types Detected:**
- `text-heavy` - Mostly text → Use EMAIL preset
- `mixed` - Text and images → Use WEB preset
- `image-heavy` - Mostly images → Use MOBILE preset
- `high-quality` - High-res images → Use ARCHIVE preset

---

### `compressBatch(filePaths, outputDir, options)`

Compress multiple PDF files in batch.

```javascript
const filesToCompress = [
  '/path/to/document1.pdf',
  '/path/to/document2.pdf',
  '/path/to/document3.pdf'
];

const results = await PDFCompressor.compressBatch(
  filesToCompress,
  '/path/to/output-directory',
  {
    preset: 'WEB',
    onProgress: (current, total, percentage) => {
      console.log(`Batch progress: ${current}/${total} (${percentage}%)`);
    }
  }
);

results.forEach((result, index) => {
  console.log(`File ${index + 1}:`);
  console.log(`  Original: ${result.originalSize} bytes`);
  console.log(`  Compressed: ${result.compressedSize} bytes`);
  console.log(`  Saved: ${result.compressionRatio}%`);
});
```

**Returns:** `Promise<Array>` - Array of compression results

---

## Complete Examples

### Example 1: Basic Compression with Progress

```javascript
import React, { useState } from 'react';
import { View, Button, Text, ProgressBarAndroid } from 'react-native';
import PDFCompressor from 'react-native-pdf-jsi/src/PDFCompressor';

const CompressDemo = ({ pdfPath }) => {
  const [compressing, setCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  const compressPDF = async () => {
    setCompressing(true);
    setProgress(0);

    try {
      const compressionResult = await PDFCompressor.compress(
        pdfPath,
        {
          preset: 'WEB',
          onProgress: (current, total, percentage) => {
            setProgress(percentage);
            console.log(`Compressing: ${percentage}%`);
          }
        }
      );

      setResult(compressionResult);
      setCompressing(false);
      console.log('Compression complete!', compressionResult);

    } catch (error) {
      setCompressing(false);
      console.error('Compression failed:', error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button
        title={compressing ? 'Compressing...' : 'Compress PDF'}
        onPress={compressPDF}
        disabled={compressing}
      />

      {compressing && (
        <View style={{ marginTop: 20 }}>
          <ProgressBarAndroid
            styleAttr="Horizontal"
            indeterminate={false}
            progress={progress / 100}
          />
          <Text style={{ textAlign: 'center', marginTop: 10 }}>
            {progress}%
          </Text>
        </View>
      )}

      {result && (
        <View style={{ marginTop: 20, padding: 10, backgroundColor: '#e8f5e9' }}>
          <Text style={{ fontWeight: 'bold' }}>Compression Results:</Text>
          <Text>Original: {(result.originalSize / 1024).toFixed(2)} KB</Text>
          <Text>Compressed: {(result.compressedSize / 1024).toFixed(2)} KB</Text>
          <Text>Saved: {result.compressionRatio}%</Text>
          <Text>Output: {result.outputPath}</Text>
        </View>
      )}
    </View>
  );
};

export default CompressDemo;
```

---

### Example 2: Preset Comparison

Compare different presets to find the best balance:

```javascript
import React, { useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import PDFCompressor from 'react-native-pdf-jsi/src/PDFCompressor';

const PresetComparison = ({ pdfPath }) => {
  const [results, setResults] = useState([]);
  const [testing, setTesting] = useState(false);

  const testAllPresets = async () => {
    setTesting(true);
    const presets = ['EMAIL', 'MOBILE', 'WEB', 'ARCHIVE', 'PRINT'];
    const testResults = [];

    for (const preset of presets) {
      try {
        console.log(`Testing ${preset} preset...`);
        
        const result = await PDFCompressor.compress(
          pdfPath,
          { preset },
          null
        );

        testResults.push({
          preset,
          originalSize: result.originalSize,
          compressedSize: result.compressedSize,
          compressionRatio: result.compressionRatio,
          processingTime: result.processingTime
        });

      } catch (error) {
        console.error(`${preset} failed:`, error);
      }
    }

    setResults(testResults);
    setTesting(false);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button
        title={testing ? 'Testing Presets...' : 'Test All Presets'}
        onPress={testAllPresets}
        disabled={testing}
      />

      <FlatList
        data={results}
        keyExtractor={(item) => item.preset}
        renderItem={({ item }) => (
          <View style={{
            marginTop: 10,
            padding: 15,
            backgroundColor: '#f5f5f5',
            borderRadius: 8
          }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
              {item.preset}
            </Text>
            <Text>Original: {(item.originalSize / 1024).toFixed(2)} KB</Text>
            <Text>Compressed: {(item.compressedSize / 1024).toFixed(2)} KB</Text>
            <Text style={{ color: '#4CAF50', fontWeight: 'bold' }}>
              Saved: {item.compressionRatio}%
            </Text>
            <Text style={{ color: '#666', fontSize: 12 }}>
              Time: {item.processingTime}ms
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default PresetComparison;
```

---

### Example 3: Smart Compression

Let the system automatically choose optimal settings:

```javascript
import React, { useState } from 'react';
import { View, Button, Text, Alert } from 'react-native';
import PDFCompressor from 'react-native-pdf-jsi/src/PDFCompressor';

const SmartCompression = ({ pdfPath }) => {
  const [result, setResult] = useState(null);
  const [compressing, setCompressing] = useState(false);

  const handleSmartCompress = async () => {
    setCompressing(true);

    try {
      const compressionResult = await PDFCompressor.smartCompress(pdfPath);

      setResult(compressionResult);
      
      Alert.alert(
        'Smart Compression Complete',
        `Content Type: ${compressionResult.contentType}\n` +
        `Settings: ${JSON.stringify(compressionResult.settingsUsed)}\n` +
        `Saved: ${compressionResult.compressionRatio}%`
      );

    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setCompressing(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button
        title={compressing ? 'Analyzing...' : 'Smart Compress'}
        onPress={handleSmartCompress}
        disabled={compressing}
      />

      {result && (
        <View style={{ marginTop: 20, padding: 15, backgroundColor: '#e3f2fd' }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
            Auto-Detected Settings:
          </Text>
          <Text>Content Type: {result.contentType}</Text>
          <Text>Quality: {result.settingsUsed.quality}</Text>
          <Text>Downscale: {result.settingsUsed.downscale ? 'Yes' : 'No'}</Text>
          <Text style={{ marginTop: 10, color: '#4CAF50', fontWeight: 'bold' }}>
            Size Reduction: {result.compressionRatio}%
          </Text>
        </View>
      )}
    </View>
  );
};

export default SmartCompression;
```

---

## Compression Presets Details

### EMAIL Preset

Optimized for email attachments (< 5MB target).

```javascript
const result = await PDFCompressor.compress(filePath, { preset: 'EMAIL' });
```

**Settings:**
- Quality: 70
- Downscale: Yes
- Max Size: 1080x1920
- Expected Ratio: ~30% of original
- Best For: Email, quick sharing, mobile viewing

---

### WEB Preset

Balanced quality and size for web distribution.

```javascript
const result = await PDFCompressor.compress(filePath, { preset: 'WEB' });
```

**Settings:**
- Quality: 80
- Downscale: Yes
- Max Size: 1920x2560
- Expected Ratio: ~50% of original
- Best For: Websites, online viewing, downloads

---

### MOBILE Preset

Optimized for mobile devices and limited bandwidth.

```javascript
const result = await PDFCompressor.compress(filePath, { preset: 'MOBILE' });
```

**Settings:**
- Quality: 75
- Downscale: Yes
- Max Size: 1080x1920
- Expected Ratio: ~40% of original
- Best For: Mobile apps, slow connections

---

### PRINT Preset

High quality for printing.

```javascript
const result = await PDFCompressor.compress(filePath, { preset: 'PRINT' });
```

**Settings:**
- Quality: 95
- Downscale: No
- Max Size: Original
- Expected Ratio: ~90% of original
- Best For: Professional printing, presentations

---

### ARCHIVE Preset

Long-term storage with quality preservation.

```javascript
const result = await PDFCompressor.compress(filePath, { preset: 'ARCHIVE' });
```

**Settings:**
- Quality: 90
- Downscale: No
- Max Size: Original
- Expected Ratio: ~85% of original
- Best For: Archiving, permanent storage

---

## Custom Compression

Create custom compression settings:

```javascript
const result = await PDFCompressor.compress(
  filePath,
  {
    quality: 85,              // Custom quality
    downscale: true,          // Enable downscaling
    maxWidth: 1600,           // Custom max width
    maxHeight: 2400,          // Custom max height
    onProgress: (current, total, percentage) => {
      console.log(`Page ${current}/${total} - ${percentage}%`);
    }
  },
  outputPath
);
```

---

## Batch Compression

Compress multiple PDF files:

```javascript
import { useRef } from 'react';

const BatchCompressor = ({ filePaths }) => {
  const [batchProgress, setBatchProgress] = useState(0);
  const [batchResults, setBatchResults] = useState([]);

  const compressMultiple = async () => {
    try {
      const results = await PDFCompressor.compressBatch(
        filePaths,
        '/output/directory',
        {
          preset: 'WEB',
          onProgress: (current, total, percentage) => {
            setBatchProgress(percentage);
          }
        }
      );

      setBatchResults(results);
      
      const totalSaved = results.reduce((sum, r) => {
        return sum + (r.originalSize - r.compressedSize);
      }, 0);

      Alert.alert(
        'Batch Complete',
        `Compressed ${results.length} files\n` +
        `Total space saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`
      );

    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View>
      <Button title="Compress All" onPress={compressMultiple} />
      {batchProgress > 0 && <Text>Progress: {batchProgress}%</Text>}
    </View>
  );
};
```

---

## Progress Tracking

Monitor compression progress in real-time:

```javascript
const [progress, setProgress] = useState({ current: 0, total: 0, percentage: 0 });

await PDFCompressor.compress(
  filePath,
  {
    preset: 'WEB',
    onProgress: (current, total, percentage) => {
      setProgress({ current, total, percentage });
      
      // Update UI
      console.log(`Processing page ${current} of ${total}`);
      console.log(`Overall progress: ${percentage}%`);
    }
  }
);
```

**Progress Callback Parameters:**
- `current` (number): Current page being processed
- `total` (number): Total pages in PDF
- `percentage` (number): Overall completion percentage (0-100)

---

## Compression Statistics

Understand compression results:

```javascript
const result = await PDFCompressor.compress(filePath, { preset: 'EMAIL' });

// Calculate savings
const savedBytes = result.originalSize - result.compressedSize;
const savedMB = savedBytes / 1024 / 1024;
const savingsPercent = result.compressionRatio;

console.log(`Original size: ${(result.originalSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`Compressed size: ${(result.compressedSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`Saved: ${savedMB.toFixed(2)} MB (${savingsPercent}%)`);
console.log(`Processing time: ${result.processingTime}ms`);
console.log(`Pages processed: ${result.pageCount}`);

// Calculate per-page metrics
const msPerPage = result.processingTime / result.pageCount;
console.log(`Average: ${msPerPage.toFixed(2)}ms per page`);
```

---

## Quality vs Size Trade-off Guide

Choose quality based on use case:

### When to Use Low Quality (60-70)
- Email attachments with size limits
- Quick previews
- Mobile apps with data constraints
- Temporary files

### When to Use Medium Quality (75-85)
- Web viewing
- Mobile devices
- Balanced performance
- General distribution

### When to Use High Quality (90-100)
- Professional printing
- Presentations
- Long-term archiving
- Legal documents

---

## Performance Tips

### 1. Use Appropriate Presets

```javascript
// For 10MB PDF to email → Use EMAIL preset
await PDFCompressor.compress(largePDF, { preset: 'EMAIL' });
// Result: ~3MB (can email)

// For web display → Use WEB preset
await PDFCompressor.compress(webPDF, { preset: 'WEB' });
// Result: ~5MB (fast loading)
```

### 2. Smart Compression for Unknown Content

```javascript
// Let the system decide
const result = await PDFCompressor.smartCompress(unknownPDF);
// Automatically optimized
```

### 3. Batch Compression for Multiple Files

```javascript
// Compress all at once instead of individually
await PDFCompressor.compressBatch(files, outputDir, options);
```

### 4. Monitor Progress for User Feedback

```javascript
onProgress: (current, total, percentage) => {
  // Show progress bar
  // Prevent user from closing app mid-compression
  // Display estimated time remaining
}
```

---

## Error Handling

```javascript
try {
  const result = await PDFCompressor.compress(filePath, options);
} catch (error) {
  if (error.message.includes('File path is required')) {
    console.error('Invalid file path');
  } else if (error.message.includes('not found')) {
    console.error('PDF file does not exist');
  } else if (error.message.includes('corrupted')) {
    console.error('PDF file is corrupted');
  } else {
    console.error('Compression error:', error);
  }
}
```

---

## TypeScript

```typescript
interface CompressionOptions {
  preset?: 'EMAIL' | 'WEB' | 'MOBILE' | 'PRINT' | 'ARCHIVE';
  quality?: number;          // 0-100
  downscale?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  onProgress?: (current: number, total: number, percentage: number) => void;
}

interface CompressionResult {
  success: boolean;
  outputPath: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  pageCount: number;
  processingTime: number;
  contentType?: string;      // For smartCompress
  settingsUsed?: object;     // For smartCompress
}

class PDFCompressorAPI {
  static compress(
    filePath: string,
    options?: CompressionOptions,
    outputPath?: string | null
  ): Promise<CompressionResult>;

  static smartCompress(
    filePath: string,
    outputPath?: string | null
  ): Promise<CompressionResult>;

  static compressBatch(
    filePaths: string[],
    outputDir: string,
    options?: CompressionOptions
  ): Promise<CompressionResult[]>;
}
```

---

## Platform Support

| Platform | Support | Notes |
|----------|---------|-------|
| Android | ✅ Full | Native compression |
| iOS | ✅ Full | Native compression |
| Windows | ⚠️ Limited | Check availability |

---

## Troubleshooting

### Compression Taking Too Long

For large PDFs (100+ pages):
- Use lower quality settings
- Enable downscaling
- Consider batch processing with smaller batches

### Out of Memory Errors

- Reduce quality setting
- Enable downscaling with smaller maxWidth/maxHeight
- Process in smaller batches
- Clear other app caches first

### Compression Ratio Lower Than Expected

- Some PDFs are already optimized
- Text-heavy PDFs compress less
- Try different presets
- Use smartCompress for automatic optimization

---

## See Also

- [Export API](/docs/api/export-api) - Export pages to images
- [PDF Operations](/docs/features/pdf-operations) - Split and merge PDFs
- [Compression Feature](/docs/features/compression) - Compression guide


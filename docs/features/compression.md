---
sidebar_position: 8
title: PDF Compression
description: Reduce PDF file sizes with intelligent compression
---

# PDF Compression

Reduce PDF file sizes using native rendering with enterprise-grade compression algorithms and intelligent presets.

:::tip Free Feature
PDF compression is completely FREE!
:::

## Why Compress PDFs?

### Common Scenarios

- **Email Attachments**: Many email services limit attachments to 25MB
- **Mobile Apps**: Reduce bandwidth and storage usage
- **Web Delivery**: Faster page load times
- **Cloud Storage**: Save storage costs
- **Archiving**: Optimize long-term storage

### Benefits

- Reduce file size by 30-90%
- Maintain acceptable quality
- Faster uploads/downloads
- Lower bandwidth costs
- Better user experience

---

## Quick Start

```javascript
import PDFCompressor from 'react-native-pdf-jsi/src/PDFCompressor';

// Compress using preset
const result = await PDFCompressor.compress('/path/to/file.pdf', {
  preset: 'WEB'
});

console.log('Original:', result.originalSize, 'bytes');
console.log('Compressed:', result.compressedSize, 'bytes');
console.log('Saved:', result.compressionRatio + '%');
```

---

## Compression Presets

### EMAIL Preset - Maximum Compression

Target: < 5MB for email attachments

```javascript
await PDFCompressor.compress(filePath, { preset: 'EMAIL' });
```

**Settings:**
- Quality: 70
- Downscale: Yes (1080x1920 max)
- **Expected Reduction:** ~70% (30% of original)
- **Best For:** Email, messaging apps, quick sharing

**Example Results:**
- 10MB PDF → ~3MB (can email)
- 50MB PDF → ~15MB (may need splitting)

---

### WEB Preset - Balanced

Target: Fast web loading with good quality

```javascript
await PDFCompressor.compress(filePath, { preset: 'WEB' });
```

**Settings:**
- Quality: 80
- Downscale: Yes (1920x2560 max)
- **Expected Reduction:** ~50% (50% of original)
- **Best For:** Websites, online viewing, downloads

**Example Results:**
- 20MB PDF → ~10MB (fast loading)
- 100MB PDF → ~50MB (reasonable download)

---

### MOBILE Preset - Optimized for Devices

Target: Mobile devices and limited bandwidth

```javascript
await PDFCompressor.compress(filePath, { preset: 'MOBILE' });
```

**Settings:**
- Quality: 75
- Downscale: Yes (1080x1920 max)
- **Expected Reduction:** ~60% (40% of original)
- **Best For:** Mobile apps, offline viewing, limited data

---

### PRINT Preset - High Quality

Target: Professional printing and presentations

```javascript
await PDFCompressor.compress(filePath, { preset: 'PRINT' });
```

**Settings:**
- Quality: 95
- Downscale: No (original resolution)
- **Expected Reduction:** ~10% (90% of original)
- **Best For:** Printing, presentations, professional use

---

### ARCHIVE Preset - Long-term Storage

Target: Archiving with quality preservation

```javascript
await PDFCompressor.compress(filePath, { preset: 'ARCHIVE' });
```

**Settings:**
- Quality: 90
- Downscale: No
- **Expected Reduction:** ~15% (85% of original)
- **Best For:** Permanent storage, legal documents

---

## Custom Compression

Fine-tune compression settings:

```javascript
const result = await PDFCompressor.compress(filePath, {
  quality: 85,              // 0-100 scale
  downscale: true,          // Enable image downscaling
  maxWidth: 1600,           // Custom max width
  maxHeight: 2400,          // Custom max height
  onProgress: (current, total, percentage) => {
    console.log(`Compressing: ${percentage}%`);
    setProgress(percentage);
  }
});
```

---

## Smart Compression

Let the system automatically choose optimal settings:

```javascript
const result = await PDFCompressor.smartCompress('/path/to/document.pdf');

console.log('Content type:', result.contentType);
// "text-heavy", "mixed", "image-heavy", or "high-quality"

console.log('Settings used:', result.settingsUsed);
// { quality: 75, downscale: true, maxWidth: 1920, ... }

console.log('Compression ratio:', result.compressionRatio + '%');
```

**How Smart Compression Works:**

1. **Analyzes Content**
   - Detects text vs images ratio
   - Checks image quality and resolution
   - Identifies document type

2. **Selects Preset**
   - Text-heavy → EMAIL preset
   - Mixed content → WEB preset
   - Image-heavy → MOBILE preset
   - High-quality → ARCHIVE preset

3. **Applies Compression**
   - Uses detected optimal settings
   - Returns detailed results

---

## Quality vs Size Trade-offs

| Quality | File Size | Visual Quality | Use Case |
|---------|-----------|----------------|----------|
| 60-70 | Smallest | Acceptable | Email, quick share |
| 75-85 | Medium | Good | Web, mobile |
| 90-95 | Large | Excellent | Print, archive |
| 100 | Largest | Perfect | Professional |

---

## Compression Comparison Chart

For a typical 20MB PDF with images:

| Preset | Output Size | Reduction | Quality | Speed |
|--------|-------------|-----------|---------|-------|
| EMAIL | ~6MB | 70% | Good | Fast |
| MOBILE | ~8MB | 60% | Good | Fast |
| WEB | ~10MB | 50% | Very Good | Medium |
| ARCHIVE | ~17MB | 15% | Excellent | Slow |
| PRINT | ~18MB | 10% | Excellent | Slow |

---

## Complete Example: Compression Tool

```javascript
import React, { useState } from 'react';
import { View, Text, Button, Picker, ProgressBarAndroid, Alert } from 'react-native';
import PDFCompressor from 'react-native-pdf-jsi/src/PDFCompressor';

const CompressionTool = ({ pdfPath, originalSize }) => {
  const [preset, setPreset] = useState('WEB');
  const [compressing, setCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  const handleCompress = async () => {
    setCompressing(true);
    setProgress(0);
    setResult(null);

    try {
      const compressionResult = await PDFCompressor.compress(
        pdfPath,
        {
          preset,
          onProgress: (current, total, percentage) => {
            setProgress(percentage);
          }
        }
      );

      setResult(compressionResult);
      
      const savedMB = (compressionResult.originalSize - compressionResult.compressedSize) / 1024 / 1024;
      
      Alert.alert(
        'Compression Complete',
        `Saved ${savedMB.toFixed(2)} MB (${compressionResult.compressionRatio}% reduction)`
      );

    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setCompressing(false);
    }
  };

  const handleSmartCompress = async () => {
    setCompressing(true);

    try {
      const result = await PDFCompressor.smartCompress(pdfPath);
      
      setResult(result);
      
      Alert.alert(
        'Smart Compression',
        `Detected: ${result.contentType}\n` +
        `Used: ${JSON.stringify(result.settingsUsed)}\n` +
        `Saved: ${result.compressionRatio}%`
      );

    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setCompressing(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
        PDF Compression
      </Text>

      {/* Preset Selector */}
      <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
        Select Preset:
      </Text>
      <Picker
        selectedValue={preset}
        onValueChange={setPreset}
        style={{ marginBottom: 20 }}
      >
        <Picker.Item label="EMAIL (Max Compression)" value="EMAIL" />
        <Picker.Item label="MOBILE (Optimized)" value="MOBILE" />
        <Picker.Item label="WEB (Balanced)" value="WEB" />
        <Picker.Item label="ARCHIVE (Quality)" value="ARCHIVE" />
        <Picker.Item label="PRINT (High Quality)" value="PRINT" />
      </Picker>

      {/* Original Size Display */}
      <View style={{ padding: 10, backgroundColor: '#f5f5f5', borderRadius: 5, marginBottom: 20 }}>
        <Text>Original Size: {(originalSize / 1024 / 1024).toFixed(2)} MB</Text>
      </View>

      {/* Progress */}
      {compressing && (
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

      {/* Buttons */}
      <Button
        title={compressing ? 'Compressing...' : 'Compress'}
        onPress={handleCompress}
        disabled={compressing}
      />
      <View style={{ height: 10 }} />
      <Button
        title={compressing ? 'Analyzing...' : 'Smart Compress (Auto)'}
        onPress={handleSmartCompress}
        disabled={compressing}
        color="#FF9800"
      />

      {/* Results */}
      {result && (
        <View style={{
          marginTop: 20,
          padding: 15,
          backgroundColor: '#e8f5e9',
          borderRadius: 8
        }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
            Compression Results:
          </Text>
          <Text>Original: {(result.originalSize / 1024 / 1024).toFixed(2)} MB</Text>
          <Text>Compressed: {(result.compressedSize / 1024 / 1024).toFixed(2)} MB</Text>
          <Text style={{ color: '#4CAF50', fontWeight: 'bold', marginTop: 5 }}>
            Saved: {((result.originalSize - result.compressedSize) / 1024 / 1024).toFixed(2)} MB 
            ({result.compressionRatio}%)
          </Text>
          <Text style={{ color: '#666', fontSize: 12, marginTop: 5 }}>
            Processing time: {result.processingTime}ms
          </Text>
          <Text style={{ color: '#666', fontSize: 10, marginTop: 10 }}>
            {result.outputPath}
          </Text>
        </View>
      )}
    </View>
  );
};

export default CompressionTool;
```

---

## When to Use Which Preset

### Decision Flow

```
Need to email it?
  └─ Yes → EMAIL preset
  └─ No ↓

Going on a website?
  └─ Yes → WEB preset
  └─ No ↓

For mobile app?
  └─ Yes → MOBILE preset
  └─ No ↓

Need to print it?
  └─ Yes → PRINT preset
  └─ No ↓

Long-term storage?
  └─ Yes → ARCHIVE preset
  └─ No → Try SMART COMPRESS
```

---

## Compression Tips

### 1. Know Your Content

- **Text-heavy PDFs**: Compress well (70-80% reduction possible)
- **Image-heavy PDFs**: Moderate compression (40-60% reduction)
- **Already compressed**: Limited gains (10-20%)

### 2. Test Different Presets

```javascript
const presets = ['EMAIL', 'WEB', 'MOBILE'];
for (const preset of presets) {
  const result = await PDFCompressor.compress(filePath, { preset });
  console.log(`${preset}: ${result.compressionRatio}% reduction`);
}
```

### 3. Monitor Progress

For large PDFs, always use progress callbacks:

```javascript
onProgress: (current, total, percentage) => {
  setProgress(percentage);
  setStatus(`Processing page ${current}/${total}`);
}
```

### 4. Handle Errors Gracefully

```javascript
try {
  const result = await PDFCompressor.compress(filePath, options);
} catch (error) {
  // Try lower quality if out of memory
  if (error.message.includes('memory')) {
    const result = await PDFCompressor.compress(filePath, { preset: 'EMAIL' });
  }
}
```

---

## See Also

- [Compression API](/docs/api/compression-api) - Full API reference
- [Export Features](/docs/features/export) - Export to images
- [PDF Operations](/docs/features/pdf-operations) - Split and merge


---
sidebar_position: 5
title: JSI API
description: Low-level JSI methods for maximum performance
---

# JSI API

The PDFJSI module provides low-level JavaScript Interface (JSI) methods for direct native communication with zero bridge overhead. This enables up to 80x faster PDF operations compared to traditional React Native bridge.

## Import

```javascript
import PDFJSI from 'react-native-pdf-jsi/src/PDFJSI';
```

---

## Core Methods

### `checkJSIAvailability()`

Check if JSI is available on the current platform.

```javascript
const isAvailable = await PDFJSI.checkJSIAvailability();
console.log('JSI Available:', isAvailable);
```

**Returns:** `Promise<boolean>`
- `true` on Android (full JSI support)
- `true` on iOS (enhanced bridge mode)
- `false` on unsupported platforms

**Platform Support:**
- **Android**: Full JSI acceleration
- **iOS**: Enhanced bridge with optimizations
- **Windows**: Not supported

---

### `renderPageDirect(pdfId, pageNumber, scale, base64Data)`

Render a PDF page directly using JSI acceleration.

```javascript
const result = await PDFJSI.renderPageDirect(
  'my-pdf-123',
  0,              // Page number (0-indexed)
  2.0,            // Scale factor
  base64PdfData   // Base64 encoded PDF
);

console.log('Render success:', result.success);
console.log('Render time:', result.renderTime, 'ms');
```

**Parameters:**
- `pdfId` (string): Unique PDF identifier
- `pageNumber` (number): Page to render (0-indexed)
- `scale` (number): Scale factor (1.0 = 100%, 2.0 = 200%)
- `base64Data` (string): Base64 encoded PDF data

**Returns:** `Promise<object>`
```typescript
{
  success: boolean;
  renderTime: number;
  imageData?: string;  // Base64 image data
}
```

**Performance:** ~2ms on average (vs 45ms with bridge)

---

###  `getPageMetrics(pdfId, pageNumber)`

Get detailed metrics for a specific page.

```javascript
const metrics = await PDFJSI.getPageMetrics('my-pdf-123', 0);

console.log('Page size:', metrics.width, 'x', metrics.height);
console.log('Aspect ratio:', metrics.aspectRatio);
```

**Returns:** `Promise<object>`
```typescript
{
  width: number;          // Page width in points
  height: number;         // Page height in points
  aspectRatio: number;    // Width / height ratio
  renderTime?: number;    // Last render time
  cacheHit?: boolean;     // Whether page was cached
}
```

---

### `preloadPagesDirect(pdfId, startPage, endPage)`

Preload a range of pages into cache for faster access.

```javascript
// Preload pages 10-20
await PDFJSI.preloadPagesDirect('my-pdf-123', 10, 20);
console.log('Pages 10-20 preloaded');
```

**Parameters:**
- `pdfId` (string): PDF identifier
- `startPage` (number): First page to preload
- `endPage` (number): Last page to preload

**Returns:** `Promise<boolean>` - Success status

**Use Case:** Preload upcoming pages for smooth scrolling

---

### `searchTextDirect(pdfId, searchTerm, startPage, endPage)`

Search for text within PDF pages using JSI.

```javascript
const results = await PDFJSI.searchTextDirect(
  'my-pdf-123',
  'React Native',
  0,    // Start page
  50    // End page
);

console.log(`Found ${results.length} matches`);
results.forEach(result => {
  console.log(`Page ${result.page}: "${result.context}"`);
});
```

**Returns:** `Promise<Array>`
```typescript
Array<{
  page: number;
  position: number;
  context: string;
  bounds?: { x: number; y: number; width: number; height: number };
}>
```

**Performance:** ~15ms per page (vs 120ms with bridge)

---

### `getCacheMetrics(pdfId)`

Get cache statistics for a PDF.

```javascript
const cacheMetrics = await PDFJSI.getCacheMetrics('my-pdf-123');

console.log('Cached pages:', cacheMetrics.cachedPages);
console.log('Cache size:', cacheMetrics.cacheSize, 'bytes');
console.log('Hit rate:', cacheMetrics.hitRate, '%');
```

**Returns:** `Promise<object>`
```typescript
{
  cachedPages: number;       // Number of pages in cache
  cacheSize: number;         // Total cache size in bytes
  hitRate: number;           // Cache hit percentage (0-100)
  missRate: number;          // Cache miss percentage
  totalRequests: number;     // Total cache requests
}
```

---

### `clearCacheDirect(pdfId, cacheType)`

Clear cache for improved memory management.

```javascript
// Clear all caches
await PDFJSI.clearCacheDirect('my-pdf-123', 'all');

// Clear only page cache
await PDFJSI.clearCacheDirect('my-pdf-123', 'pages');

// Clear only image cache
await PDFJSI.clearCacheDirect('my-pdf-123', 'images');
```

**Cache Types:**
- `'all'` - Clear all caches (default)
- `'pages'` - Clear page cache only
- `'images'` - Clear rendered image cache
- `'text'` - Clear text extraction cache
- `'base64'` - Clear base64 data cache
- `'bytes'` - Clear byte array cache

---

### `optimizeMemory(pdfId)`

Optimize memory usage for a PDF.

```javascript
await PDFJSI.optimizeMemory('my-pdf-123');
console.log('Memory optimized');
```

**What it does:**
- Releases unused cached pages
- Compresses cached data
- Cleans up temporary buffers
- Triggers garbage collection hints

**When to use:**
- After viewing many pages
- Before loading new PDF
- On memory warnings
- Periodically for long sessions

---

### `setRenderQuality(pdfId, quality)`

Set rendering quality for PDF pages.

```javascript
// High quality (slower, better appearance)
await PDFJSI.setRenderQuality('my-pdf-123', 1.0);

// Medium quality (balanced)
await PDFJSI.setRenderQuality('my-pdf-123', 0.75);

// Low quality (faster, lower file size)
await PDFJSI.setRenderQuality('my-pdf-123', 0.5);
```

**Quality Levels:**
- `1.0` - Best quality (default)
- `0.75` - High quality
- `0.5` - Medium quality
- `0.25` - Low quality (draft mode)

---

### `getPerformanceMetrics(pdfId)`

Get performance metrics for PDF operations.

```javascript
const metrics = await PDFJSI.getPerformanceMetrics('my-pdf-123');

console.log('Total operations:', metrics.totalOperations);
console.log('Average duration:', metrics.averageDuration, 'ms');
console.log('Fastest operation:', metrics.fastest, 'ms');
console.log('Slowest operation:', metrics.slowest, 'ms');
```

**Returns:** `Promise<object>`
```typescript
{
  totalOperations: number;
  averageDuration: number;
  fastest: number;
  slowest: number;
  cacheHitRate: number;
  jsiCallCount: number;
}
```

---

### `getJSIStats()`

Get global JSI statistics (Android only).

```javascript
const stats = await PDFJSI.getJSIStats();

console.log('JSI calls:', stats.totalJSICalls);
console.log('Bridge calls:', stats.totalBridgeCalls);
console.log('Performance gain:', stats.performanceGain, 'x');
```

**Returns:** `Promise<object>` (Android only)
```typescript
{
  totalJSICalls: number;
  totalBridgeCalls: number;
  averageJSITime: number;
  averageBridgeTime: number;
  performanceGain: number;  // JSI speedup factor
}
```

---

## Advanced Methods

### `lazyLoadPages(pdfId, currentPage, preloadRadius, totalPages)`

Implement lazy loading with intelligent preloading.

```javascript
await PDFJSI.lazyLoadPages(
  'my-pdf-123',
  10,    // Current page
  3,     // Preload 3 pages before and after
  100    // Total pages in PDF
);
```

**What it does:**
- Loads current page immediately
- Preloads pages within radius (10-3 to 10+3)
- Unloads pages outside 2x radius
- Optimizes memory automatically

---

### `progressiveLoadPages(pdfId, startPage, batchSize, onProgress)`

Load pages progressively in batches with progress callbacks.

```javascript
await PDFJSI.progressiveLoadPages(
  'my-pdf-123',
  1,      // Start from page 1
  5,      // Load 5 pages per batch
  (progress) => {
    console.log(`Loading progress: ${progress}%`);
    setLoadProgress(progress);
  }
);
```

**Use Case:** Loading very large PDFs (100+ pages) without freezing UI

---

### `smartCacheFrequentPages(pdfId, frequentPages)`

Intelligently cache frequently accessed pages.

```javascript
// Cache table of contents and frequently visited pages
await PDFJSI.smartCacheFrequentPages('my-pdf-123', [1, 5, 10, 20, 50]);
```

**What it does:**
- Prioritizes specified pages in cache
- Prevents eviction of frequent pages
- Optimizes cache hit rate

---

### `check16KBSupport()`

Check if device supports 16KB page size (Android 15+ compliance).

```javascript
const is16KBSupported = await PDFJSI.check16KBSupport();
console.log('16KB page size supported:', is16KBSupported);
```

---

## Complete Example: High-Performance PDF Viewer

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import PDFJSI from 'react-native-pdf-jsi/src/PDFJSI';
import Pdf from 'react-native-pdf-jsi';

const HighPerformanceViewer = ({ pdfPath }) => {
  const [jsiAvailable, setJsiAvailable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const pdfId = 'main-pdf';

  // Initialize JSI
  useEffect(() => {
    const initJSI = async () => {
      const available = await PDFJSI.checkJSIAvailability();
      setJsiAvailable(available);
      
      if (available) {
        const stats = await PDFJSI.getJSIStats();
        console.log('JSI Stats:', stats);
      }
    };
    initJSI();
  }, []);

  // Lazy load pages as user navigates
  useEffect(() => {
    if (jsiAvailable && totalPages > 0) {
      PDFJSI.lazyLoadPages(pdfId, currentPage, 3, totalPages)
        .catch(err => console.error('Lazy load error:', err));
    }
  }, [currentPage, jsiAvailable, totalPages]);

  // Update performance metrics periodically
  useEffect(() => {
    if (!jsiAvailable) return;

    const interval = setInterval(async () => {
      try {
        const metrics = await PDFJSI.getPerformanceMetrics(pdfId);
        setPerformanceMetrics(metrics);
      } catch (error) {
        console.error('Metrics error:', error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jsiAvailable]);

  const handleLoadComplete = async (pages) => {
    setTotalPages(pages);
    
    // Preload first 10 pages
    if (jsiAvailable) {
      await PDFJSI.preloadPagesDirect(pdfId, 0, Math.min(9, pages - 1));
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const clearCache = async () => {
    try {
      await PDFJSI.clearCacheDirect(pdfId, 'all');
      Alert.alert('Success', 'Cache cleared');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const optimizeMemory = async () => {
    try {
      await PDFJSI.optimizeMemory(pdfId);
      Alert.alert('Success', 'Memory optimized');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Performance Badge */}
      <View style={{ 
        padding: 10, 
        backgroundColor: jsiAvailable ? '#4CAF50' : '#FF9800' 
      }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          {jsiAvailable ? '⚡ JSI Accelerated' : '⚠️ Bridge Mode'}
        </Text>
        {performanceMetrics && (
          <Text style={{ color: 'white', fontSize: 12 }}>
            Avg: {performanceMetrics.averageDuration.toFixed(2)}ms | 
            Cache Hit: {performanceMetrics.cacheHitRate}%
          </Text>
        )}
      </View>

      {/* PDF Viewer */}
      <Pdf
        source={{ uri: pdfPath }}
        onLoadComplete={handleLoadComplete}
        onPageChanged={handlePageChange}
        style={{ flex: 1 }}
      />

      {/* Controls */}
      <View style={{ flexDirection: 'row', padding: 10 }}>
        <Button title="Clear Cache" onPress={clearCache} />
        <View style={{ width: 10 }} />
        <Button title="Optimize Memory" onPress={optimizeMemory} />
      </View>
    </View>
  );
};

export default HighPerformanceViewer;
```

---

## Performance Comparison

Real-world benchmarks comparing JSI vs Bridge:

| Operation | Bridge | JSI | Speedup |
|-----------|--------|-----|---------|
| Page Render | 45ms | 2ms | **22.5x** |
| Cache Access | 8ms | 0.1ms | **80x** |
| Text Search | 120ms | 15ms | **8x** |
| Page Metrics | 25ms | 1ms | **25x** |
| Preload (10 pages) | 450ms | 20ms | **22.5x** |

---

## Method Details

### lazyLoadPages()

```javascript
await PDFJSI.lazyLoadPages(pdfId, currentPage, preloadRadius, totalPages);
```

Efficiently load pages with intelligent caching:
- Loads current page immediately
- Preloads pages within radius (current ± radius)
- Unloads pages beyond 2x radius
- Optimizes memory automatically

**Example:**
```javascript
// User is on page 50 of 200-page PDF
await PDFJSI.lazyLoadPages('pdf-1', 50, 3, 200);
// Loads: pages 47-53
// Keeps in cache: pages 44-56
// Unloads: pages < 44 and > 56
```

---

### progressiveLoadPages()

```javascript
await PDFJSI.progressiveLoadPages(pdfId, startPage, batchSize, onProgress);
```

Load pages in batches with progress feedback:

```javascript
await PDFJSI.progressiveLoadPages(
  'large-pdf',
  1,
  10,  // 10 pages per batch
  (progress) => {
    console.log(`Progress: ${progress}%`);
    setLoadingProgress(progress);
  }
);
```

**Use Case:** Loading 100+ page PDFs without blocking UI

---

### smartCacheFrequentPages()

```javascript
await PDFJSI.smartCacheFrequentPages(pdfId, frequentPages);
```

Cache specific pages with high priority:

```javascript
// Cache cover, TOC, and important chapters
await PDFJSI.smartCacheFrequentPages('textbook', [
  1,    // Cover
  5,    // Table of contents
  20,   // Chapter 1
  45,   // Chapter 2
  80    // Chapter 3
]);
```

**Benefits:**
- Instant access to important pages
- Prevents eviction from cache
- Optimizes overall cache hit rate

---

### setRenderQuality()

```javascript
await PDFJSI.setRenderQuality(pdfId, quality);
```

Control rendering quality for performance/quality tradeoff:

```javascript
// Use case: Draft mode for previews
await PDFJSI.setRenderQuality('preview-pdf', 0.5);

// Use case: High-quality for final display
await PDFJSI.setRenderQuality('presentation-pdf', 1.0);
```

---

### check16KBSupport()

```javascript
const supported = await PDFJSI.check16KBSupport();

if (!supported) {
  console.warn('Device may not support Google Play 16KB requirements');
}
```

Check Android 15+ compliance (Google Play requirement).

---

## Error Handling

All methods may throw errors. Always use try-catch:

```javascript
try {
  await PDFJSI.renderPageDirect(pdfId, page, scale, data);
} catch (error) {
  if (error.message.includes('JSI not available')) {
    console.log('Falling back to bridge mode');
    // Use standard Pdf component
  } else if (error.message.includes('Platform')) {
    console.log('Platform not supported');
  } else {
    console.error('Render error:', error);
  }
}
```

---

## Best Practices

### 1. Initialize Early

```javascript
useEffect(() => {
  PDFJSI.checkJSIAvailability().then(available => {
    if (available) {
      console.log('✅ JSI ready');
    }
  });
}, []);
```

### 2. Use Lazy Loading for Large PDFs

```javascript
// For PDFs with 50+ pages
if (totalPages > 50) {
  PDFJSI.lazyLoadPages(pdfId, currentPage, 3, totalPages);
} else {
  // Preload all for smaller PDFs
  PDFJSI.preloadPagesDirect(pdfId, 0, totalPages - 1);
}
```

### 3. Monitor Performance

```javascript
useEffect(() => {
  const checkPerf = async () => {
    const metrics = await PDFJSI.getPerformanceMetrics(pdfId);
    if (metrics.averageDuration > 50) {
      console.warn('Performance degradation detected');
      // Clear cache or optimize
      await PDFJSI.optimizeMemory(pdfId);
    }
  };
  
  const interval = setInterval(checkPerf, 30000);
  return () => clearInterval(interval);
}, [pdfId]);
```

### 4. Clean Up on Unmount

```javascript
useEffect(() => {
  return () => {
    PDFJSI.clearCacheDirect(pdfId, 'all')
      .catch(err => console.error('Cleanup error:', err));
  };
}, [pdfId]);
```

---

## TypeScript

```typescript
class PDFJSIManager {
  checkJSIAvailability(): Promise<boolean>;
  renderPageDirect(pdfId: string, pageNumber: number, scale: number, base64Data: string): Promise<RenderResult>;
  getPageMetrics(pdfId: string, pageNumber: number): Promise<PageMetrics>;
  preloadPagesDirect(pdfId: string, startPage: number, endPage: number): Promise<boolean>;
  searchTextDirect(pdfId: string, searchTerm: string, startPage: number, endPage: number): Promise<SearchResult[]>;
  getCacheMetrics(pdfId: string): Promise<CacheMetrics>;
  clearCacheDirect(pdfId: string, cacheType?: CacheType): Promise<boolean>;
  optimizeMemory(pdfId: string): Promise<boolean>;
  setRenderQuality(pdfId: string, quality: number): Promise<void>;
  getPerformanceMetrics(pdfId: string): Promise<PerformanceMetrics>;
  getJSIStats(): Promise<JSIStats>;
  lazyLoadPages(pdfId: string, currentPage: number, preloadRadius?: number, totalPages?: number | null): Promise<void>;
  progressiveLoadPages(pdfId: string, startPage?: number, batchSize?: number, onProgress?: ((progress: number) => void) | null): Promise<void>;
  smartCacheFrequentPages(pdfId: string, frequentPages?: number[]): Promise<void>;
  check16KBSupport(): Promise<boolean>;
}

type CacheType = 'all' | 'pages' | 'images' | 'text' | 'base64' | 'bytes';

const PDFJSI: PDFJSIManager;
export default PDFJSI;
```

---

## See Also

- [Hooks API](/docs/api/hooks) - React hook wrapper (usePDFJSI)
- [JSI Acceleration](/docs/features/jsi-acceleration) - Performance details
- [Lazy Loading](/docs/features/lazy-loading) - Lazy loading guide

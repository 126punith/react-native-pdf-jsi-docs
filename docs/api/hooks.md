---
sidebar_position: 2
title: Hooks API
description: React hooks for PDF operations with JSI acceleration
---

# Hooks API

React hooks for easy integration of PDF JSI functionality in functional components. The `usePDFJSI` hook provides automatic JSI availability detection, performance tracking, and memory management.

## usePDFJSI Hook

A comprehensive React hook that provides access to all JSI-accelerated PDF operations with built-in state management and performance tracking.

### Import

```javascript
import { usePDFJSI } from 'react-native-pdf-jsi/src/hooks/usePDFJSI';
```

---

## Hook Parameters

```javascript
const pdfJSI = usePDFJSI(options);
```

**Options:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `autoInitialize` | boolean | `true` | Automatically initialize JSI on mount |
| `enablePerformanceTracking` | boolean | `true` | Track performance metrics for operations |
| `enableCaching` | boolean | `true` | Enable smart caching for pages |
| `maxCacheSize` | number | `100` | Maximum number of pages to cache |

---

## Return Values

The hook returns an object with the following properties and methods:

### State

| Property | Type | Description |
|----------|------|-------------|
| `isJSIAvailable` | boolean | Whether JSI is available on current platform |
| `isInitialized` | boolean | Whether JSI has been initialized |
| `performanceMetrics` | object \| null | Current performance metrics |
| `jsiStats` | object \| null | JSI statistics (Android only) |

### Core Methods

| Method | Description |
|--------|-------------|
| `renderPage(pdfId, pageNumber, scale, base64Data)` | Render a page with JSI acceleration |
| `getPageMetrics(pdfId, pageNumber)` | Get metrics for a specific page |
| `preloadPages(pdfId, startPage, endPage)` | Preload a range of pages |
| `searchText(pdfId, searchTerm, startPage, endPage)` | Search text within pages |
| `getCacheMetrics(pdfId)` | Get cache statistics |
| `clearCache(pdfId, cacheType)` | Clear cache for PDF |
| `optimizeMemory(pdfId)` | Optimize memory usage |
| `setRenderQuality(pdfId, quality)` | Set rendering quality |

### Performance Tracking

| Method | Description |
|--------|-------------|
| `updatePerformanceMetrics(pdfId)` | Update performance metrics |
| `getPerformanceHistory()` | Get history of all operations |
| `clearPerformanceHistory()` | Clear performance history |

### Instance Management

| Method | Description |
|--------|-------------|
| `createPDFInstance(pdfId, options)` | Create tracked PDF instance |
| `removePDFInstance(pdfId)` | Remove PDF instance |
| `getPDFInstances()` | Get all tracked instances |

### Advanced Features

| Method | Description |
|--------|-------------|
| `lazyLoadPages(pdfId, currentPage, preloadRadius, totalPages)` | Lazy load pages with preload radius |
| `progressiveLoadPages(pdfId, startPage, batchSize, onProgress)` | Load pages progressively with callbacks |
| `smartCacheFrequentPages(pdfId, frequentPages)` | Smart cache for frequently accessed pages |

---

## Basic Usage Example

```javascript
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { usePDFJSI } from 'react-native-pdf-jsi/src/hooks/usePDFJSI';
import Pdf from 'react-native-pdf-jsi';

const PDFViewer = ({ pdfPath }) => {
  const {
    isJSIAvailable,
    isInitialized,
    renderPage,
    getPageMetrics
  } = usePDFJSI({
    autoInitialize: true,
    enablePerformanceTracking: true
  });

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (isInitialized) {
      console.log('JSI Available:', isJSIAvailable);
    }
  }, [isInitialized, isJSIAvailable]);

  if (!isInitialized) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Text>JSI Status: {isJSIAvailable ? '✅ Enabled' : '⚠️ Bridge Mode'}</Text>
      <Pdf
        source={{ uri: pdfPath }}
        onLoadComplete={(numberOfPages) => {
          console.log(`Loaded ${numberOfPages} pages`);
        }}
        onPageChanged={(page) => {
          setCurrentPage(page);
        }}
        style={{ flex: 1 }}
      />
    </View>
  );
};

export default PDFViewer;
```

---

## Performance Tracking Example

Monitor and analyze performance of PDF operations:

```javascript
import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import { usePDFJSI } from 'react-native-pdf-jsi/src/hooks/usePDFJSI';

const PerformanceMonitor = ({ pdfId }) => {
  const {
    isJSIAvailable,
    performanceMetrics,
    updatePerformanceMetrics,
    getPerformanceHistory,
    clearPerformanceHistory
  } = usePDFJSI({
    enablePerformanceTracking: true
  });

  const [history, setHistory] = useState([]);

  const refreshMetrics = async () => {
    await updatePerformanceMetrics(pdfId);
    const perfHistory = getPerformanceHistory();
    setHistory(perfHistory);
  };

  useEffect(() => {
    const interval = setInterval(refreshMetrics, 1000);
    return () => clearInterval(interval);
  }, [pdfId]);

  const clearHistory = () => {
    clearPerformanceHistory();
    setHistory([]);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
        Performance Monitor
      </Text>
      
      {performanceMetrics && (
        <View style={{ marginTop: 10 }}>
          <Text>Total Operations: {performanceMetrics.totalOps}</Text>
          <Text>Avg Duration: {performanceMetrics.avgDuration}ms</Text>
          <Text>Cache Hit Rate: {performanceMetrics.cacheHitRate}%</Text>
        </View>
      )}

      <Button title="Refresh Metrics" onPress={refreshMetrics} />
      <Button title="Clear History" onPress={clearHistory} />

      <ScrollView style={{ marginTop: 20, maxHeight: 300 }}>
        {history.map((entry, index) => (
          <View key={index} style={{ padding: 5, borderBottomWidth: 1 }}>
            <Text>{entry.operation}: {entry.duration.toFixed(2)}ms</Text>
            <Text style={{ fontSize: 10, color: '#666' }}>
              Page {entry.pageNumber} • {new Date(entry.timestamp).toLocaleTimeString()}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default PerformanceMonitor;
```

---

## Cache Management Example

Manage PDF caching for optimal performance:

```javascript
import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { usePDFJSI } from 'react-native-pdf-jsi/src/hooks/usePDFJSI';

const CacheManager = ({ pdfId }) => {
  const {
    getCacheMetrics,
    clearCache,
    optimizeMemory,
    smartCacheFrequentPages
  } = usePDFJSI({
    enableCaching: true,
    maxCacheSize: 50
  });

  const [cacheInfo, setCacheInfo] = useState(null);

  const checkCache = async () => {
    try {
      const metrics = await getCacheMetrics(pdfId);
      setCacheInfo(metrics);
      Alert.alert('Cache Info', JSON.stringify(metrics, null, 2));
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleClearCache = async (type = 'all') => {
    try {
      await clearCache(pdfId, type);
      Alert.alert('Success', `${type} cache cleared`);
      checkCache();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleOptimizeMemory = async () => {
    try {
      await optimizeMemory(pdfId);
      Alert.alert('Success', 'Memory optimized');
      checkCache();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const cacheFrequentPages = async () => {
    try {
      // Cache pages 1, 5, 10, 20 as frequently accessed
      await smartCacheFrequentPages(pdfId, [1, 5, 10, 20]);
      Alert.alert('Success', 'Frequent pages cached');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Cache Management
      </Text>

      {cacheInfo && (
        <View style={{ marginBottom: 20, padding: 10, backgroundColor: '#f0f0f0' }}>
          <Text>Cached Pages: {cacheInfo.cachedPages}</Text>
          <Text>Cache Size: {(cacheInfo.cacheSize / 1024).toFixed(2)} KB</Text>
          <Text>Hit Rate: {cacheInfo.hitRate}%</Text>
        </View>
      )}

      <Button title="Check Cache" onPress={checkCache} />
      <View style={{ height: 10 }} />
      <Button title="Clear All Cache" onPress={() => handleClearCache('all')} />
      <View style={{ height: 10 }} />
      <Button title="Clear Page Cache" onPress={() => handleClearCache('pages')} />
      <View style={{ height: 10 }} />
      <Button title="Optimize Memory" onPress={handleOptimizeMemory} />
      <View style={{ height: 10 }} />
      <Button title="Cache Frequent Pages" onPress={cacheFrequentPages} />
    </View>
  );
};

export default CacheManager;
```

---

## Advanced: Lazy Loading with Preload

Implement efficient lazy loading for large PDF files:

```javascript
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { usePDFJSI } from 'react-native-pdf-jsi/src/hooks/usePDFJSI';
import Pdf from 'react-native-pdf-jsi';

const LazyPDFViewer = ({ pdfPath, totalPages = 100 }) => {
  const {
    isJSIAvailable,
    lazyLoadPages,
    preloadPages
  } = usePDFJSI({
    autoInitialize: true,
    enableCaching: true
  });

  const [currentPage, setCurrentPage] = useState(1);
  const preloadRadius = 3; // Preload 3 pages before and after current

  useEffect(() => {
    if (isJSIAvailable && currentPage) {
      // Lazy load with preload radius
      lazyLoadPages(pdfPath, currentPage, preloadRadius, totalPages)
        .then(() => {
          console.log(`Lazy loaded pages around ${currentPage}`);
        })
        .catch(error => {
          console.error('Lazy load error:', error);
        });
    }
  }, [currentPage, isJSIAvailable, pdfPath]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    
    // Proactively preload next batch
    const startPreload = page + preloadRadius + 1;
    const endPreload = Math.min(startPreload + 5, totalPages);
    
    if (startPreload <= totalPages) {
      preloadPages(pdfPath, startPreload, endPreload)
        .catch(error => console.error('Preload error:', error));
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Pdf
        source={{ uri: pdfPath }}
        onPageChanged={handlePageChange}
        enablePaging={true}
        style={{ flex: 1 }}
      />
    </View>
  );
};

export default LazyPDFViewer;
```

---

## Method Reference

### renderPage()

Render a specific page with JSI acceleration.

```javascript
const result = await renderPage(pdfId, pageNumber, scale, base64Data);
```

**Parameters:**
- `pdfId` (string): PDF identifier
- `pageNumber` (number): Page to render (0-indexed)
- `scale` (number): Scale factor (1.0 = 100%)
- `base64Data` (string): Base64 PDF data

**Returns:** `Promise<object>` - Render result with image data

---

### getPageMetrics()

Get detailed metrics for a specific page.

```javascript
const metrics = await getPageMetrics(pdfId, pageNumber);
```

**Returns:**
```typescript
{
  width: number;
  height: number;
  renderTime: number;
  cacheHit: boolean;
}
```

---

### preloadPages()

Preload a range of pages into cache.

```javascript
await preloadPages(pdfId, startPage, endPage);
```

**Parameters:**
- `pdfId` (string): PDF identifier
- `startPage` (number): First page to preload
- `endPage` (number): Last page to preload

---

### clearCache()

Clear cache for a PDF.

```javascript
await clearCache(pdfId, cacheType);
```

**Cache Types:**
- `'all'` - Clear all caches (default)
- `'pages'` - Clear only page cache
- `'images'` - Clear only image cache
- `'text'` - Clear only text cache

---

## Platform Support

| Platform | JSI Support | Features |
|----------|-------------|----------|
| **Android** | ✅ Full JSI | All features available |
| **iOS** | ⚡ Enhanced Bridge | Caching and optimizations |
| **Windows** | ⚠️ Standard | Basic features only |

---

## Performance Tips

1. **Enable Performance Tracking**: Monitor operations to identify bottlenecks
   ```javascript
   usePDFJSI({ enablePerformanceTracking: true })
   ```

2. **Use Lazy Loading**: For PDFs with 50+ pages
   ```javascript
   lazyLoadPages(pdfId, currentPage, 3, totalPages)
   ```

3. **Smart Caching**: Cache frequently accessed pages
   ```javascript
   smartCacheFrequentPages(pdfId, [1, 5, 10, 20])
   ```

4. **Optimize Memory**: Periodically optimize to prevent leaks
   ```javascript
   await optimizeMemory(pdfId)
   ```

5. **Progressive Loading**: For very large PDFs
   ```javascript
   progressiveLoadPages(pdfId, 1, 5, (progress) => {
     console.log(`Loaded ${progress}%`);
   })
   ```

---

## TypeScript

```typescript
interface UsePDFJSIOptions {
  autoInitialize?: boolean;
  enablePerformanceTracking?: boolean;
  enableCaching?: boolean;
  maxCacheSize?: number;
}

interface UsePDFJSIReturn {
  // State
  isJSIAvailable: boolean;
  isInitialized: boolean;
  performanceMetrics: PerformanceMetrics | null;
  jsiStats: JSIStats | null;
  
  // Methods
  renderPage: (pdfId: string, pageNumber: number, scale: number, base64Data: string) => Promise<any>;
  getPageMetrics: (pdfId: string, pageNumber: number) => Promise<PageMetrics>;
  preloadPages: (pdfId: string, startPage: number, endPage: number) => Promise<void>;
  searchText: (pdfId: string, searchTerm: string, startPage: number, endPage: number) => Promise<SearchResult[]>;
  getCacheMetrics: (pdfId: string) => Promise<CacheMetrics>;
  clearCache: (pdfId: string, cacheType?: 'all' | 'pages' | 'images' | 'text') => Promise<void>;
  optimizeMemory: (pdfId: string) => Promise<void>;
  setRenderQuality: (pdfId: string, quality: number) => Promise<void>;
  updatePerformanceMetrics: (pdfId: string) => Promise<PerformanceMetrics | null>;
  getPerformanceHistory: () => PerformanceEntry[];
  clearPerformanceHistory: () => void;
  createPDFInstance: (pdfId: string, options?: any) => PDFInstance;
  removePDFInstance: (pdfId: string) => void;
  getPDFInstances: () => PDFInstance[];
  lazyLoadPages: (pdfId: string, currentPage: number, preloadRadius?: number, totalPages?: number | null) => Promise<void>;
  progressiveLoadPages: (pdfId: string, startPage?: number, batchSize?: number, onProgress?: ((progress: number) => void) | null) => Promise<void>;
  smartCacheFrequentPages: (pdfId: string, frequentPages?: number[]) => Promise<void>;
  initializeJSI: () => Promise<boolean>;
}

function usePDFJSI(options?: UsePDFJSIOptions): UsePDFJSIReturn;
```

---

## Troubleshooting

### JSI Not Available

If `isJSIAvailable` is `false`:
1. Check that you're on Android (iOS uses enhanced bridge)
2. Ensure package is properly linked
3. Rebuild the app: `npm run android`

### Memory Issues

If experiencing memory warnings:
```javascript
// Periodically optimize
useEffect(() => {
  const interval = setInterval(() => {
    optimizeMemory(pdfId);
  }, 60000); // Every minute
  
  return () => clearInterval(interval);
}, [pdfId]);
```

### Slow Performance Despite JSI

Check performance metrics:
```javascript
const metrics = await updatePerformanceMetrics(pdfId);
console.log('Cache hit rate:', metrics.cacheHitRate);

// If cache hit rate is low, increase cache size
usePDFJSI({ maxCacheSize: 200 })
```

---

## See Also

- [JSI API](/docs/api/jsi-api) - Lower-level JSI methods
- [PDF Component](/docs/api/pdf-component) - Main PDF viewer
- [Performance Guide](/docs/features/jsi-acceleration) - JSI acceleration details

---
sidebar_position: 1
---

# Core Features

react-native-pdf-jsi provides everything you need for professional PDF viewing in React Native. This page covers all the essential features that work out of the box.

## PDF Viewing Basics

### Simple PDF Viewer

The most basic PDF viewer requires just 3 lines of code:

```jsx
import Pdf from 'react-native-pdf-jsi';

<Pdf 
  source={{ uri: 'https://example.com/document.pdf' }} 
  style={{ flex: 1 }}
/>
```

That's it! You now have a fully functional PDF viewer with:
- ⚡ Automatic JSI acceleration (80x faster)
- 📄 Lazy loading for large files
- 🎯 Smart 30-day caching
- 🔍 Zoom and pan gestures
- 📱 Cross-platform support

## Loading PDF Files

react-native-pdf-jsi supports multiple source types:

### From URL

```jsx
<Pdf source={{ uri: 'https://example.com/document.pdf' }} />
```

### From Local File

```jsx
<Pdf source={{ uri: 'file:///path/to/document.pdf' }} />
```

### From Base64

```jsx
<Pdf source={{ 
  uri: 'data:application/pdf;base64,JVBERi0xLjcKCjEgMCBvYmogICUgZW50...' 
}} />
```

### From App Assets

**iOS:**
```jsx
<Pdf source={require('./assets/document.pdf')} />
```

**Android:**
```jsx
<Pdf source={{ uri: 'bundle-assets://document.pdf' }} />
```

## Caching System

### Automatic Caching

PDFs are automatically cached for 30 days to improve performance:

```jsx
<Pdf 
  source={{ 
    uri: 'https://example.com/document.pdf',
    cache: true,  // Enable caching (default: true)
    expiration: 30,  // Days until cache expires
    cacheFileName: 'my-custom-name.pdf'  // Optional custom name
  }} 
/>
```

### Cache Benefits

- 📥 **One-time download** - PDF downloads once, then loads instantly
- 💾 **Offline access** - View previously loaded PDFs without internet
- ⚡ **Instant loading** - Cached PDFs load in milliseconds
- 🔄 **Auto-refresh** - Cache expires after 30 days and reloads

## Viewing Modes

### Vertical Scrolling (Default)

Standard vertical page scrolling:

```jsx
<Pdf 
  source={{ uri: 'https://example.com/document.pdf' }}
  horizontal={false}  // Vertical mode
/>
```

### Horizontal Scrolling

Swipe left/right to change pages:

```jsx
<Pdf 
  source={{ uri: 'https://example.com/document.pdf' }}
  horizontal={true}  // Horizontal mode
/>
```

### Single Page Mode

Show one page at a time with page indicators:

```jsx
<Pdf 
  source={{ uri: 'https://example.com/document.pdf' }}
  singlePage={true}
  enablePaging={true}
/>
```

## Page Navigation

### Controlled Page Navigation

Control which page is displayed:

```jsx
import React, { useState } from 'react';
import { View, Button } from 'react-native';
import Pdf from 'react-native-pdf-jsi';

export default function App() {
  const [page, setPage] = useState(1);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', padding: 10 }}>
        <Button 
          title="Previous" 
          onPress={() => setPage(p => Math.max(1, p - 1))} 
        />
        <Button 
          title="Next" 
          onPress={() => setPage(p => p + 1)} 
        />
      </View>
      
      <Pdf
        source={{ uri: 'https://example.com/document.pdf' }}
        page={page}
        onPageChanged={(newPage) => setPage(newPage)}
        style={{ flex: 1 }}
      />
    </View>
  );
}
```

### Jump to Specific Page

```jsx
const pdfRef = useRef(null);

// Jump to page 10
pdfRef.current?.setPage(10);
```

## Zoom and Scaling

### Zoom Controls

Configure zoom behavior:

```jsx
<Pdf 
  source={{ uri: 'https://example.com/document.pdf' }}
  scale={1.0}      // Initial zoom level
  minScale={0.5}   // Minimum zoom (50%)
  maxScale={3.0}   // Maximum zoom (300%)
  onScaleChanged={(scale) => {
    console.log(`Zoom level: ${scale}`);
  }}
/>
```

### Fit Policies

Control how PDFs fit on screen:

```jsx
<Pdf 
  source={{ uri: 'https://example.com/document.pdf' }}
  fitPolicy={0}  // 0=FitWidth, 1=FitHeight, 2=FitBoth
/>
```

**Fit Policy Options:**
- `0` - **FitWidth**: Fit to screen width, scroll vertically
- `1` - **FitHeight**: Fit to screen height, scroll horizontally  
- `2` - **FitBoth**: Fit entire page in viewport (default)

### Double-Tap Zoom

Double-tap any area to zoom in/out automatically. This is enabled by default.

## Password Protection

### Password-Protected PDFs

```jsx
import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import Pdf from 'react-native-pdf-jsi';

export default function App() {
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) {
    return (
      <View style={{ padding: 20 }}>
        <TextInput
          placeholder="Enter PDF password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        />
        <Button title="Unlock PDF" onPress={() => setUnlocked(true)} />
      </View>
    );
  }

  return (
    <Pdf
      source={{ uri: 'https://example.com/protected.pdf' }}
      password={password}
      onError={(error) => {
        if (error.message.includes('password')) {
          alert('Incorrect password');
          setUnlocked(false);
        }
      }}
      style={{ flex: 1 }}
    />
  );
}
```

## Gestures and Interactions

### Pan and Scroll

Users can:
- **Swipe** - Navigate between pages
- **Pan** - Move around zoomed content
- **Pinch** - Zoom in/out
- **Double-tap** - Quick zoom toggle

### Single Tap Detection

Detect when user taps on a page:

```jsx
<Pdf
  source={{ uri: 'https://example.com/document.pdf' }}
  onPageSingleTap={(page, x, y) => {
    console.log(`Tapped page ${page} at coordinates (${x}, ${y})`);
    // Show/hide toolbar, etc.
  }}
/>
```

### Link Press Handling

Handle hyperlinks in PDFs:

```jsx
<Pdf
  source={{ uri: 'https://example.com/document.pdf' }}
  onPressLink={(url) => {
    console.log(`Link pressed: ${url}`);
    // Open in browser, handle custom URLs, etc.
  }}
/>
```

## Scroll Behavior

### Scroll Indicators

Control scroll bar visibility:

```jsx
<Pdf
  source={{ uri: 'https://example.com/document.pdf' }}
  showsHorizontalScrollIndicator={true}
  showsVerticalScrollIndicator={true}
/>
```

### Enable/Disable Scrolling

```jsx
<Pdf
  source={{ uri: 'https://example.com/document.pdf' }}
  scrollEnabled={true}  // Set to false to disable scrolling
/>
```

### Page Spacing

Adjust spacing between pages:

```jsx
<Pdf
  source={{ uri: 'https://example.com/document.pdf' }}
  spacing={10}  // Pixels between pages (default: 10)
/>
```

## Rendering Options

### Anti-Aliasing

Smooth text and graphics rendering:

```jsx
<Pdf
  source={{ uri: 'https://example.com/document.pdf' }}
  enableAntialiasing={true}  // Default: true
/>
```

### Annotation Rendering

Show PDF annotations and forms:

```jsx
<Pdf
  source={{ uri: 'https://example.com/document.pdf' }}
  enableAnnotationRendering={true}  // Default: true
/>
```

## RTL Support

Right-to-left language support:

```jsx
<Pdf
  source={{ uri: 'https://example.com/document.pdf' }}
  enableRTL={true}  // For Arabic, Hebrew, etc.
/>
```

## Event Handlers

### Load Complete

Triggered when PDF finishes loading:

```jsx
<Pdf
  source={{ uri: 'https://example.com/document.pdf' }}
  onLoadComplete={(numberOfPages, filePath, dimensions, tableOfContents) => {
    console.log(`Loaded ${numberOfPages} pages`);
    console.log(`File path: ${filePath}`);
    console.log(`Dimensions: ${dimensions.width}x${dimensions.height}`);
    console.log(`Table of contents:`, tableOfContents);
  }}
/>
```

### Page Changed

Triggered when user navigates to a different page:

```jsx
<Pdf
  source={{ uri: 'https://example.com/document.pdf' }}
  onPageChanged={(page, numberOfPages) => {
    console.log(`Now on page ${page} of ${numberOfPages}`);
    // Update UI, track analytics, etc.
  }}
/>
```

### Error Handling

Handle loading errors:

```jsx
<Pdf
  source={{ uri: 'https://example.com/document.pdf' }}
  onError={(error) => {
    console.error('PDF Error:', error);
    
    if (error.message.includes('404')) {
      alert('PDF not found');
    } else if (error.message.includes('password')) {
      alert('Password required');
    } else {
      alert(`Failed to load PDF: ${error.message}`);
    }
  }}
/>
```

### Load Progress

Track download progress:

```jsx
<Pdf
  source={{ uri: 'https://example.com/large-document.pdf' }}
  onLoadProgress={(percent) => {
    console.log(`Loading: ${(percent * 100).toFixed(0)}%`);
  }}
/>
```

## Custom Loading Indicator

Replace the default loading indicator:

```jsx
import { ActivityIndicator } from 'react-native';

<Pdf
  source={{ uri: 'https://example.com/document.pdf' }}
  renderActivityIndicator={(progress) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0066cc" />
      <Text>{`${(progress * 100).toFixed(0)}% loaded`}</Text>
    </View>
  )}
/>
```

## Network Configuration

### Trust All Certificates

For development or self-signed certificates:

```jsx
<Pdf
  source={{ uri: 'https://self-signed.example.com/document.pdf' }}
  trustAllCerts={true}  // Default: true
/>
```

:::warning Security Note
Only use `trustAllCerts={true}` in development. In production, use valid SSL certificates.
:::

### Custom Headers

Pass custom HTTP headers:

```jsx
<Pdf
  source={{ 
    uri: 'https://api.example.com/document.pdf',
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN',
      'Custom-Header': 'value'
    }
  }}
/>
```

### Custom HTTP Method

Use POST or other methods:

```jsx
<Pdf
  source={{ 
    uri: 'https://api.example.com/generate-pdf',
    method: 'POST',
    body: JSON.stringify({ documentId: '123' }),
    headers: {
      'Content-Type': 'application/json'
    }
  }}
/>
```

## Complete Example

Here's a full-featured PDF viewer with all core features:

```jsx
import React, { useState, useRef } from 'react';
import { View, Button, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Pdf from 'react-native-pdf-jsi';

export default function PDFViewer() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const pdfRef = useRef(null);

  return (
    <View style={styles.container}>
      {/* Header with controls */}
      <View style={styles.header}>
        <Text style={styles.pageText}>
          Page {currentPage} of {totalPages}
        </Text>
        <Text style={styles.zoomText}>
          Zoom: {(scale * 100).toFixed(0)}%
        </Text>
      </View>

      {/* Navigation buttons */}
      <View style={styles.controls}>
        <Button 
          title="◀ Prev" 
          onPress={() => pdfRef.current?.setPage(currentPage - 1)}
          disabled={currentPage <= 1}
        />
        <Button 
          title="Next ▶" 
          onPress={() => pdfRef.current?.setPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
        />
        <Button 
          title="Go to 10" 
          onPress={() => pdfRef.current?.setPage(10)}
        />
      </View>

      {/* PDF Viewer */}
      <Pdf
        ref={pdfRef}
        source={{ 
          uri: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          cache: true,
          expiration: 30
        }}
        page={currentPage}
        scale={scale}
        minScale={0.5}
        maxScale={3.0}
        horizontal={false}
        fitPolicy={0}
        spacing={10}
        enableAntialiasing={true}
        enableAnnotationRendering={true}
        onLoadComplete={(pages, path) => {
          setTotalPages(pages);
          setLoading(false);
          console.log(`PDF loaded: ${pages} pages`);
        }}
        onPageChanged={(page, pages) => {
          setCurrentPage(page);
        }}
        onScaleChanged={(newScale) => {
          setScale(newScale);
        }}
        onError={(error) => {
          console.error('PDF Error:', error);
          setLoading(false);
        }}
        onPageSingleTap={(page) => {
          console.log(`Tapped page ${page}`);
        }}
        renderActivityIndicator={(progress) => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#0066cc" />
            <Text style={styles.loadingText}>
              {`${(progress * 100).toFixed(0)}%`}
            </Text>
          </View>
        )}
        style={styles.pdf}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#0066cc',
  },
  pageText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  zoomText: {
    color: 'white',
    fontSize: 16,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: 'white',
  },
  pdf: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});
```

## Platform-Specific Behavior

### iOS
- Uses PDFKit for native rendering
- Smooth scrolling and animations
- Full annotation support
- Better memory management

### Android
- Uses Pdfium for rendering
- JSI acceleration available
- Google Play 16KB compliant
- Optimized for large files

### Windows (Experimental)
- Uses standard bridge mode
- Basic PDF viewing
- Limited JSI support

## Best Practices

### Performance Optimization

1. **Enable caching** for frequently accessed PDFs
2. **Use appropriate fit policy** for your layout
3. **Disable unused features** (annotations if not needed)
4. **Monitor memory** with large PDFs

### Error Handling

Always implement `onError` handler:

```jsx
onError={(error) => {
  // Log to analytics
  console.error('PDF Error:', error);
  
  // Show user-friendly message
  Alert.alert('Error', 'Failed to load PDF');
  
  // Provide fallback options
  showFallbackUI();
}}
```

### User Experience

1. **Show loading indicators** during download
2. **Display page numbers** for context
3. **Provide navigation controls** for easy access
4. **Handle edge cases** (no internet, invalid PDF, etc.)

## Troubleshooting

### PDF Not Loading

1. Check URL is accessible
2. Verify network permissions
3. Check for HTTPS/HTTP issues
4. Enable `trustAllCerts` for development

### Slow Performance

1. Enable caching
2. Reduce initial scale
3. Use appropriate fit policy
4. Check JSI is working (see [JSI Acceleration](/docs/features/jsi-acceleration))

### Memory Issues

1. Clear old cache files
2. Reduce max scale
3. Use lazy loading
4. Monitor memory usage

## Next Steps

Now that you understand the core features, explore advanced capabilities:

- **[JSI Acceleration](/docs/features/jsi-acceleration)** - 80x faster performance
- **[Bookmarks](/docs/features/bookmarks)** - Save important pages
- **[Export to Images](/docs/features/export)** - Convert pages to PNG/JPEG
- **[PDF Operations](/docs/features/pdf-operations)** - Split and extract pages
- **[Reading Analytics](/docs/features/analytics)** - Track reading behavior

Need the complete API reference? Check out the [PDF Component API](/docs/api/pdf-component).

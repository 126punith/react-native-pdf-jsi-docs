---
sidebar_position: 2
---

# Quick Start

Build your first PDF viewer in 5 minutes! This guide will walk you through creating a fully functional PDF viewer with JSI acceleration.

## Basic PDF Viewer

Let's start with the simplest possible PDF viewer:

```jsx title="App.js"
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Pdf from 'react-native-pdf-jsi';

export default function App() {
  return (
    <View style={styles.container}>
      <Pdf
        source={{ uri: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }}
        style={styles.pdf}
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

That's it! You now have a working PDF viewer with automatic JSI acceleration.

## Adding Event Handlers

Let's make it more interactive by adding event handlers:

```jsx title="App.js"
import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Pdf from 'react-native-pdf-jsi';

export default function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  return (
    <View style={styles.container}>
      {/* Page counter */}
      <View style={styles.header}>
        <Text style={styles.pageText}>
          Page {currentPage} of {totalPages}
        </Text>
      </View>

      {/* PDF Viewer */}
      <Pdf
        source={{ uri: 'https://example.com/document.pdf' }}
        style={styles.pdf}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`PDF loaded: ${numberOfPages} pages`);
          setTotalPages(numberOfPages);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
          setCurrentPage(page);
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
  header: {
    padding: 16,
    backgroundColor: '#0066cc',
    alignItems: 'center',
  },
  pageText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  pdf: {
    flex: 1,
  },
});
```

## Loading from Different Sources

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
<Pdf source={{ uri: 'data:application/pdf;base64,YOUR_BASE64_STRING' }} />
```

### From Assets (iOS/Android)

```jsx
// iOS
<Pdf source={require('./assets/document.pdf')} />

// Android
<Pdf source={{ uri: 'bundle-assets://document.pdf' }} />
```

## Common Props

Here are the most commonly used props:

```jsx
<Pdf
  // Source
  source={{ uri: 'https://example.com/document.pdf' }}
  
  // Password (if PDF is protected)
  password="yourpassword"
  
  // Scroll direction
  horizontal={false}  // false = vertical, true = horizontal
  
  // Initial page
  page={1}
  
  // Zoom scale
  scale={1.0}
  
  // Fit policy
  fitPolicy={0}  // 0=width, 1=height, 2=both
  
  // Enable antialiasing
  enableAntialiasing={true}
  
  // Event handlers
  onLoadComplete={(numberOfPages, filePath) => {}}
  onPageChanged={(page, numberOfPages) => {}}
  onError={(error) => {}}
  onPageSingleTap={(page) => {}}
  onScaleChanged={(scale) => {}}
  
  // Style
  style={{ flex: 1 }}
/>
```

## Page Navigation

Control which page is displayed programmatically:

```jsx
import React, { useState, useRef } from 'react';
import { View, Button } from 'react-native';
import Pdf from 'react-native-pdf-jsi';

export default function App() {
  const [page, setPage] = useState(1);

  const goToNextPage = () => setPage(prev => prev + 1);
  const goToPrevPage = () => setPage(prev => Math.max(1, prev - 1));
  const goToPage = (pageNum) => setPage(pageNum);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', padding: 10 }}>
        <Button title="Previous" onPress={goToPrevPage} />
        <Button title="Next" onPress={goToNextPage} />
        <Button title="Go to 5" onPress={() => goToPage(5)} />
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

## Fit Policies

Control how the PDF fits within the viewport:

```jsx
// FitPolicy options:
// 0 = FitWidth (fit to width, scroll vertically)
// 1 = FitHeight (fit to height, scroll horizontally)
// 2 = FitBoth (fit entire page in viewport)

<Pdf
  source={{ uri: 'https://example.com/document.pdf' }}
  fitPolicy={0}  // Fit to width
  style={{ flex: 1 }}
/>
```

## Handling Password-Protected PDFs

```jsx
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import Pdf from 'react-native-pdf-jsi';

export default function App() {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleError = (error) => {
    if (error.message && error.message.includes('password')) {
      Alert.alert('Password Required', 'This PDF is password-protected');
    }
  };

  if (!isUnlocked) {
    return (
      <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
        <TextInput
          placeholder="Enter PDF password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        />
        <Button title="Unlock PDF" onPress={() => setIsUnlocked(true)} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Pdf
        source={{ uri: 'https://example.com/protected.pdf' }}
        password={password}
        onError={handleError}
        style={{ flex: 1 }}
      />
    </View>
  );
}
```

## JSI Verification

Want to verify that JSI is actually working? Check the console:

```jsx
<Pdf
  source={{ uri: 'https://example.com/document.pdf' }}
  onLoadComplete={(numberOfPages, filePath) => {
    // JSI-enabled builds will log performance metrics
    console.log('PDF loaded with JSI acceleration');
  }}
  style={{ flex: 1 }}
/>
```

Look for logs like:
- `📱 PDFJSI: JSI availability on android: AVAILABLE`
- `🚀 PDFJSI: High-performance JSI mode enabled`

## Next Steps

Now that you have a basic PDF viewer working, explore more advanced features:

- **[Bookmarks](/docs/features/bookmarks)** - Add, edit, and navigate bookmarks
- **[Export to Images](/docs/features/export)** - Convert PDF pages to PNG/JPEG
- **[PDF Operations](/docs/features/pdf-operations)** - Split and extract pages
- **[Reading Analytics](/docs/features/analytics)** - Track reading sessions
- **[API Reference](/docs/api/pdf-component)** - Complete props and methods

## Common Patterns

### Loading Indicator

```jsx
import React, { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import Pdf from 'react-native-pdf-jsi';

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <View style={{ flex: 1 }}>
      {loading && (
        <View style={{ position: 'absolute', top: '50%', left: '50%' }}>
          <ActivityIndicator size="large" color="#0066cc" />
        </View>
      )}
      
      <Pdf
        source={{ uri: 'https://example.com/document.pdf' }}
        onLoadComplete={() => setLoading(false)}
        onError={() => setLoading(false)}
        style={{ flex: 1 }}
      />
    </View>
  );
}
```

### Error Handling

```jsx
const handlePDFError = (error) => {
  if (error.message.includes('404')) {
    Alert.alert('Not Found', 'PDF file not found');
  } else if (error.message.includes('password')) {
    Alert.alert('Password Required', 'This PDF is password-protected');
  } else {
    Alert.alert('Error', `Failed to load PDF: ${error.message}`);
  }
};
```

---

**Ready for more?** Check out the [Advanced Features](/docs/features/bookmarks) to unlock the full potential of react-native-pdf-jsi!


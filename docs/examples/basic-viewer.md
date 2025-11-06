---
sidebar_position: 1
title: Basic Viewer Example
description: Simple PDF viewer implementation
---

# Basic Viewer Example

A complete, production-ready PDF viewer with essential features.

## Features

- Load PDF from URL or local file
- Page navigation controls
- Zoom in/out buttons
- Current page display
- Loading indicator
- Error handling

---

## Complete Code

```javascript
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import Pdf from 'react-native-pdf-jsi';

const BasicPDFViewer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1.0);

  const pdfRef = React.useRef(null);

  const source = {
    uri: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    cache: true
  };

  const handleLoadComplete = (numberOfPages, path) => {
    setTotalPages(numberOfPages);
    setLoading(false);
    console.log(`PDF loaded: ${numberOfPages} pages`);
  };

  const handlePageChanged = (page, numberOfPages) => {
    setCurrentPage(page);
  };

  const handleError = (error) => {
    setLoading(false);
    Alert.alert('Error', 'Failed to load PDF: ' + error.message);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages && pdfRef.current) {
      pdfRef.current.setPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1 && pdfRef.current) {
      pdfRef.current.setPage(currentPage - 1);
    }
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3.0));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>PDF Viewer</Text>
        <Text style={styles.pageInfo}>
          Page {currentPage} of {totalPages}
        </Text>
      </View>

      {/* PDF Viewer */}
      <View style={styles.pdfContainer}>
        <Pdf
          ref={pdfRef}
          source={source}
          page={currentPage}
          scale={scale}
          minScale={0.5}
          maxScale={3.0}
          spacing={10}
          enablePaging={true}
          onLoadComplete={handleLoadComplete}
          onPageChanged={handlePageChanged}
          onError={handleError}
          onLoadProgress={(percent) => {
            console.log(`Loading: ${(percent * 100).toFixed(0)}%`);
          }}
          style={styles.pdf}
        />
        
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#6366F1" />
            <Text style={styles.loadingText}>Loading PDF...</Text>
          </View>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {/* Page Navigation */}
        <View style={styles.pageControls}>
          <TouchableOpacity
            style={[styles.button, currentPage === 1 && styles.buttonDisabled]}
            onPress={goToPreviousPage}
            disabled={currentPage === 1}
          >
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>

          <View style={styles.pageDisplay}>
            <Text style={styles.pageNumber}>{currentPage}</Text>
            <Text style={styles.pageSeparator}>of</Text>
            <Text style={styles.totalPages}>{totalPages}</Text>
          </View>

          <TouchableOpacity
            style={[styles.button, currentPage === totalPages && styles.buttonDisabled]}
            onPress={goToNextPage}
            disabled={currentPage === totalPages}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>

        {/* Zoom Controls */}
        <View style={styles.zoomControls}>
          <TouchableOpacity
            style={[styles.zoomButton, scale <= 0.5 && styles.buttonDisabled]}
            onPress={zoomOut}
            disabled={scale <= 0.5}
          >
            <Text style={styles.buttonText}>−</Text>
          </TouchableOpacity>

          <Text style={styles.scaleText}>{(scale * 100).toFixed(0)}%</Text>

          <TouchableOpacity
            style={[styles.zoomButton, scale >= 3.0 && styles.buttonDisabled]}
            onPress={zoomIn}
            disabled={scale >= 3.0}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#6366F1',
    padding: 15,
    paddingTop: 50,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  pageInfo: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
  pdfContainer: {
    flex: 1,
    position: 'relative',
  },
  pdf: {
    flex: 1,
    backgroundColor: '#525659',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
  controls: {
    backgroundColor: 'white',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  pageControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  pageDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  pageNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  pageSeparator: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 5,
  },
  totalPages: {
    fontSize: 18,
    color: '#666',
  },
  zoomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomButton: {
    backgroundColor: '#6366F1',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scaleText: {
    fontSize: 16,
    marginHorizontal: 20,
    minWidth: 60,
    textAlign: 'center',
  },
});

export default BasicPDFViewer;
```

---

## Key Features Explained

### 1. PDF Reference

```javascript
const pdfRef = React.useRef(null);

// Use setPage method to navigate
pdfRef.current.setPage(pageNumber);
```

### 2. Source Configuration

```javascript
const source = {
  uri: 'https://example.com/document.pdf',  // URL
  cache: true,                              // Enable caching
  expiration: 86400                         // Cache for 24 hours
};

// Or local file
const source = {
  uri: 'file:///path/to/local/file.pdf'
};
```

### 3. Event Handlers

```javascript
onLoadComplete={(pages, path) => {
  // Called when PDF is fully loaded
  console.log(`Loaded ${pages} pages from ${path}`);
}}

onPageChanged={(page, totalPages) => {
  // Called when user changes page
  setCurrentPage(page);
}}

onError={(error) => {
  // Called on load errors
  Alert.alert('Error', error.message);
}}
```

---

## Customization Options

### Add Search

```javascript
import { useState } from 'react';
import { TextInput } from 'react-native';

const [searchText, setSearchText] = useState('');

<TextInput
  value={searchText}
  onChangeText={setSearchText}
  placeholder="Search..."
  style={styles.searchInput}
/>

<Pdf
  source={source}
  // Search will be highlighted automatically
  style={styles.pdf}
/>
```

### Add Jump to Page

```javascript
const [jumpToPage, setJumpToPage] = useState('');

const handleJumpToPage = () => {
  const page = parseInt(jumpToPage);
  if (page >= 1 && page <= totalPages) {
    pdfRef.current.setPage(page);
  }
};

<View>
  <TextInput
    value={jumpToPage}
    onChangeText={setJumpToPage}
    placeholder="Page number..."
    keyboardType="numeric"
  />
  <Button title="Go" onPress={handleJumpToPage} />
</View>
```

---

## Platform-Specific Features

### iOS

```javascript
// iOS-specific props
<Pdf
  source={source}
  enablePaging={true}         // Better iOS scrolling
  horizontal={false}           // Vertical scroll
  showsHorizontalScrollIndicator={false}
  showsVerticalScrollIndicator={true}
  style={styles.pdf}
/>
```

### Android

```javascript
// Android-specific features
<Pdf
  source={source}
  enableAntialiasing={true}   // Smoother rendering
  spacing={16}                 // Page spacing
  enableRTL={false}            // Right-to-left support
  style={styles.pdf}
/>
```

---

## See Also

- [PDF Component API](/docs/api/pdf-component) - Full API reference
- [Quick Start](/docs/getting-started/quick-start) - Getting started guide
- [Full-Featured Example](/docs/examples/full-featured) - Advanced example

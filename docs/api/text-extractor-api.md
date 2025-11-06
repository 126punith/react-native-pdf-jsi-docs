---
sidebar_position: 6
title: PDFTextExtractor API
description: Extract and search text from PDF documents
---

# PDFTextExtractor API

The PDFTextExtractor module provides a JavaScript wrapper for native PDF text extraction functionality, enabling you to extract, search, and analyze text from PDF documents.

## Import

```javascript
import PDFTextExtractor from 'react-native-pdf-jsi/src/utils/PDFTextExtractor';
```

---

## Methods

### `isTextExtractionAvailable()`

Check if text extraction is available on the current platform.

```javascript
const available = await PDFTextExtractor.isTextExtractionAvailable();
console.log('Text extraction available:', available);
```

**Returns:** `Promise<boolean>`
- `true` if text extraction is supported
- `false` if native module is not available

**Example:**
```javascript
if (await PDFTextExtractor.isTextExtractionAvailable()) {
  // Proceed with text extraction
  const text = await PDFTextExtractor.extractAllText(pdfPath);
} else {
  console.warn('Text extraction not available on this platform');
}
```

---

### `extractAllText(filePath)`

Extract text from all pages in a PDF document.

```javascript
const textMap = await PDFTextExtractor.extractAllText('/path/to/document.pdf');
console.log(textMap);
// Output: { 0: "Page 1 text content...", 1: "Page 2 text content...", ... }
```

**Parameters:**
- `filePath` (string): Absolute path to the PDF file

**Returns:** `Promise<Object>`
- Object mapping page numbers (0-indexed) to extracted text

**Example:**
```javascript
try {
  const textMap = await PDFTextExtractor.extractAllText(pdfPath);
  
  // Process each page
  Object.entries(textMap).forEach(([pageNum, text]) => {
    console.log(`Page ${parseInt(pageNum) + 1}: ${text.length} characters`);
  });
} catch (error) {
  console.error('Text extraction failed:', error);
}
```

---

### `extractTextFromPages(filePath, pageNumbers)`

Extract text from specific pages.

```javascript
const pageTexts = await PDFTextExtractor.extractTextFromPages(
  '/path/to/document.pdf',
  [0, 1, 2]  // Extract first 3 pages (0-indexed)
);
```

**Parameters:**
- `filePath` (string): Absolute path to the PDF file
- `pageNumbers` (number[]): Array of page indices (0-based)

**Returns:** `Promise<Object>`
- Object mapping page numbers to extracted text

**Example:**
```javascript
// Extract pages 1, 5, and 10 (convert to 0-indexed)
const pagesToExtract = [0, 4, 9];
const textMap = await PDFTextExtractor.extractTextFromPages(pdfPath, pagesToExtract);

console.log('Page 1:', textMap[0]);
console.log('Page 5:', textMap[4]);
console.log('Page 10:', textMap[9]);
```

---

### `extractTextFromPage(filePath, pageNumber)`

Extract text from a single page.

```javascript
const pageText = await PDFTextExtractor.extractTextFromPage(
  '/path/to/document.pdf',
  0  // First page (0-indexed)
);
```

**Parameters:**
- `filePath` (string): Absolute path to the PDF file
- `pageNumber` (number): Page index (0-based)

**Returns:** `Promise<string>`
- Extracted text from the specified page

**Example:**
```javascript
// Extract text from page 5 (0-indexed as 4)
const page5Text = await PDFTextExtractor.extractTextFromPage(pdfPath, 4);
console.log('Page 5 text:', page5Text);

// Word count
const wordCount = page5Text.split(/\s+/).filter(w => w.length > 0).length;
console.log('Word count:', wordCount);
```

---

### `searchText(filePath, searchQuery, options)`

Search for text within a PDF document.

```javascript
const results = await PDFTextExtractor.searchText(
  '/path/to/document.pdf',
  'search term',
  { caseSensitive: false }
);
```

**Parameters:**
- `filePath` (string): Absolute path to the PDF file
- `searchQuery` (string): Text to search for
- `options` (Object, optional):
  - `caseSensitive` (boolean): Whether search is case-sensitive (default: `false`)

**Returns:** `Promise<Array>`
- Array of search result objects

**Result Object:**
```typescript
{
  page: number,      // Page number (0-indexed)
  position: number,  // Character position in page text
  context: string    // Surrounding context (~50 chars before/after)
}
```

**Example:**
```javascript
// Case-insensitive search
const results = await PDFTextExtractor.searchText(pdfPath, 'react native', {
  caseSensitive: false
});

console.log(`Found ${results.length} results`);

results.forEach((result, index) => {
  console.log(`\nResult ${index + 1}:`);
  console.log(`  Page: ${result.page + 1}`);
  console.log(`  Position: ${result.position}`);
  console.log(`  Context: "${result.context}"`);
});

// Case-sensitive search
const exactResults = await PDFTextExtractor.searchText(pdfPath, 'ReactNative', {
  caseSensitive: true
});
```

---

### `getTextStatistics(filePath)`

Get text statistics for a PDF document.

```javascript
const stats = await PDFTextExtractor.getTextStatistics('/path/to/document.pdf');
console.log(stats);
```

**Parameters:**
- `filePath` (string): Absolute path to the PDF file

**Returns:** `Promise<Object>`

**Statistics Object:**
```typescript
{
  totalPages: number,              // Total number of pages
  totalCharacters: number,         // Total character count
  totalWords: number,              // Total word count
  averageWordsPerPage: number,     // Average words per page
  averageCharactersPerPage: number // Average characters per page
}
```

**Example:**
```javascript
const stats = await PDFTextExtractor.getTextStatistics(pdfPath);

console.log('Document Statistics:');
console.log(`  Pages: ${stats.totalPages}`);
console.log(`  Characters: ${stats.totalCharacters.toLocaleString()}`);
console.log(`  Words: ${stats.totalWords.toLocaleString()}`);
console.log(`  Avg. Words/Page: ${stats.averageWordsPerPage}`);
console.log(`  Avg. Chars/Page: ${stats.averageCharactersPerPage}`);

// Estimate reading time (assuming 200 words/minute)
const readingMinutes = Math.ceil(stats.totalWords / 200);
console.log(`  Est. Reading Time: ${readingMinutes} minutes`);
```

---

## Complete Examples

### Example 1: Extract and Display Text

```javascript
import React, { useState } from 'react';
import { View, Button, Text, ScrollView } from 'react-native';
import PDFTextExtractor from 'react-native-pdf-jsi/src/utils/PDFTextExtractor';

const TextExtractorDemo = ({ pdfPath }) => {
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);

  const extractText = async () => {
    setLoading(true);
    try {
      const textMap = await PDFTextExtractor.extractAllText(pdfPath);
      
      // Combine all pages
      const allText = Object.values(textMap).join('\n\n--- Page Break ---\n\n');
      setExtractedText(allText);
    } catch (error) {
      console.error('Extraction failed:', error);
      setExtractedText('Error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button 
        title={loading ? 'Extracting...' : 'Extract Text'} 
        onPress={extractText}
        disabled={loading}
      />
      
      {extractedText && (
        <ScrollView style={{ marginTop: 20, flex: 1 }}>
          <Text>{extractedText}</Text>
        </ScrollView>
      )}
    </View>
  );
};

export default TextExtractorDemo;
```

### Example 2: Search with Highlighting

```javascript
import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text } from 'react-native';
import PDFTextExtractor from 'react-native-pdf-jsi/src/utils/PDFTextExtractor';

const SearchDemo = ({ pdfPath }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const performSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      const searchResults = await PDFTextExtractor.searchText(
        pdfPath,
        searchQuery,
        { caseSensitive: false }
      );
      
      setResults(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
    }
    setSearching(false);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search in PDF..."
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          borderRadius: 5
        }}
      />
      
      <Button 
        title={searching ? 'Searching...' : 'Search'}
        onPress={performSearch}
        disabled={searching || !searchQuery.trim()}
      />
      
      <Text style={{ marginTop: 20, fontWeight: 'bold' }}>
        {results.length} results found
      </Text>
      
      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={{ 
            padding: 10, 
            marginVertical: 5, 
            backgroundColor: '#f0f0f0',
            borderRadius: 5 
          }}>
            <Text style={{ fontWeight: 'bold' }}>
              Result {index + 1} - Page {item.page + 1}
            </Text>
            <Text style={{ marginTop: 5, fontStyle: 'italic' }}>
              "{item.context}"
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default SearchDemo;
```

### Example 3: Document Statistics Dashboard

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import PDFTextExtractor from 'react-native-pdf-jsi/src/utils/PDFTextExtractor';

const StatsDashboard = ({ pdfPath }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [pdfPath]);

  const loadStats = async () => {
    try {
      const statistics = await PDFTextExtractor.getTextStatistics(pdfPath);
      setStats(statistics);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (!stats) {
    return <Text>No statistics available</Text>;
  }

  const readingTime = Math.ceil(stats.totalWords / 200);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
        Document Statistics
      </Text>
      
      <StatItem 
        label="Total Pages" 
        value={stats.totalPages} 
      />
      <StatItem 
        label="Total Words" 
        value={stats.totalWords.toLocaleString()} 
      />
      <StatItem 
        label="Total Characters" 
        value={stats.totalCharacters.toLocaleString()} 
      />
      <StatItem 
        label="Avg. Words/Page" 
        value={stats.averageWordsPerPage} 
      />
      <StatItem 
        label="Estimated Reading Time" 
        value={`${readingTime} minutes`} 
      />
    </View>
  );
};

const StatItem = ({ label, value }) => (
  <View style={{ 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  }}>
    <Text style={{ fontSize: 16 }}>{label}:</Text>
    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{value}</Text>
  </View>
);

export default StatsDashboard;
```

---

## Error Handling

All methods may throw errors. Always use try-catch blocks:

```javascript
try {
  const text = await PDFTextExtractor.extractAllText(pdfPath);
} catch (error) {
  if (error.message.includes('not available')) {
    // Native module not available
    console.log('Text extraction not supported');
  } else if (error.message.includes('file not found')) {
    // File doesn't exist
    console.log('PDF file not found');
  } else {
    // Other errors
    console.error('Extraction error:', error);
  }
}
```

---

## TypeScript

```typescript
interface PDFTextExtractorStatic {
  isTextExtractionAvailable(): Promise<boolean>;
  extractAllText(filePath: string): Promise<{[page: number]: string}>;
  extractTextFromPages(filePath: string, pageNumbers: number[]): Promise<{[page: number]: string}>;
  extractTextFromPage(filePath: string, pageNumber: number): Promise<string>;
  searchText(
    filePath: string,
    searchQuery: string,
    options?: { caseSensitive?: boolean }
  ): Promise<Array<{
    page: number;
    position: number;
    context: string;
  }>>;
  getTextStatistics(filePath: string): Promise<{
    totalPages: number;
    totalCharacters: number;
    totalWords: number;
    averageWordsPerPage: number;
    averageCharactersPerPage: number;
  }>;
}
```

---

## Platform Support

| Platform | Support | Notes |
|----------|---------|-------|
| Android | ✅ Full | Native text extraction |
| iOS | ✅ Full | Native text extraction |
| Windows | ⚠️ Limited | Check availability |

---

## Performance Tips

1. **Cache Results:** Text extraction can be slow for large documents. Cache results when possible.

```javascript
const textCache = new Map();

async function getCachedText(pdfPath) {
  if (textCache.has(pdfPath)) {
    return textCache.get(pdfPath);
  }
  
  const text = await PDFTextExtractor.extractAllText(pdfPath);
  textCache.set(pdfPath, text);
  return text;
}
```

2. **Extract Only What You Need:** Use `extractTextFromPages()` instead of `extractAllText()` when you only need specific pages.

3. **Debounce Search:** Debounce search queries to avoid excessive extraction operations.

```javascript
import { debounce } from 'lodash';

const debouncedSearch = debounce(async (query) => {
  const results = await PDFTextExtractor.searchText(pdfPath, query);
  setResults(results);
}, 300);
```

---

## See Also

- [Export API](/docs/api/export-api) - Export PDFs to images
- [PDF Component](/docs/api/pdf-component) - Main PDF viewer component
- [Hooks API](/docs/api/hooks) - React hooks for PDF operations



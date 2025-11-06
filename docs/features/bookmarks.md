---
sidebar_position: 4
title: Bookmarks
description: Create, manage, and navigate PDF bookmarks with colors and notes
---

# Bookmarks

A comprehensive bookmark system for PDFs with colors, notes, progress tracking, and persistent storage.

:::tip Free Feature
All bookmark features are completely FREE, including 10 custom colors!
:::

## Overview

The bookmark system provides:
- Create, read, update, and delete bookmarks
- 10 custom colors for organization
- Add notes and metadata to bookmarks
- Reading progress tracking
- Automatic persistence with AsyncStorage
- Swipeable UI components (ready-to-use)

---

## Quick Start

```javascript
import { BookmarkManager } from 'react-native-pdf-jsi/src/bookmarks/BookmarkManager';

// Initialize
const bookmarkManager = new BookmarkManager();
await bookmarkManager.initialize();

// Create a bookmark
const bookmark = await bookmarkManager.createBookmark('my-pdf-id', {
  page: 5,
  name: 'Chapter 2',
  color: '#FFD700',  // Gold color
  notes: 'Important section to review'
});

// Get all bookmarks for a PDF
const bookmarks = await bookmarkManager.getBookmarks('my-pdf-id');

// Jump to a bookmark
const bookmarkData = await bookmarkManager.getBookmark('my-pdf-id', bookmarkId);
// Navigate to bookmarkData.page
```

---

## BookmarkManager API

### Initialize

```javascript
import { BookmarkManager } from 'react-native-pdf-jsi/src/bookmarks/BookmarkManager';

const manager = new BookmarkManager();
await manager.initialize();
```

Initialization loads existing bookmarks and progress data from AsyncStorage.

---

### Create Bookmark

```javascript
const bookmark = await manager.createBookmark(pdfId, {
  page: 10,
  name: 'Important Section',
  color: '#FF6B6B',
  notes: 'Review this later',
  metadata: { chapter: '2', section: '2.1' }
});

console.log('Bookmark ID:', bookmark.id);
console.log('Created at:', bookmark.createdAt);
```

**Parameters:**
- `pdfId` (string): PDF identifier
- `bookmarkData` (object):
  - `page` (number): Page number (required)
  - `name` (string): Bookmark name (required)
  - `color` (string): Hex color code (optional, default: '#000000')
  - `notes` (string): Additional notes (optional)
  - `metadata` (object): Custom metadata (optional)

**Returns:** Bookmark object with generated `id` and `createdAt` timestamp

---

### Get Bookmarks

```javascript
// Get all bookmarks for a PDF
const allBookmarks = await manager.getBookmarks('my-pdf-id');

allBookmarks.forEach(bookmark => {
  console.log(`${bookmark.name} - Page ${bookmark.page}`);
});
```

**Returns:** Array of bookmark objects, sorted by page number

---

### Get Single Bookmark

```javascript
const bookmark = await manager.getBookmark('my-pdf-id', bookmarkId);

console.log('Page:', bookmark.page);
console.log('Name:', bookmark.name);
console.log('Color:', bookmark.color);
console.log('Notes:', bookmark.notes);
```

---

### Update Bookmark

```javascript
const updated = await manager.updateBookmark('my-pdf-id', bookmarkId, {
  name: 'Updated Name',
  color: '#4ECDC4',
  notes: 'Updated notes'
});

console.log('Bookmark updated:', updated);
```

**Parameters:**
- Only include fields you want to update
- Page, name, color, and notes can all be updated

---

### Delete Bookmark

```javascript
await manager.deleteBookmark('my-pdf-id', bookmarkId);
console.log('Bookmark deleted');
```

---

### Delete All Bookmarks

```javascript
await manager.deleteAllBookmarks('my-pdf-id');
console.log('All bookmarks deleted for this PDF');
```

---

## Available Colors

10 beautiful colors for bookmark organization:

```javascript
export const BookmarkColors = {
  RED: '#FF6B6B',
  BLUE: '#4ECDC4',
  GREEN: '#95E1D3',
  YELLOW: '#FFD93D',
  PURPLE: '#A78BFA',
  ORANGE: '#FFAA64',
  PINK: '#FFA6C1',
  TEAL: '#38B2AC',
  INDIGO: '#818CF8',
  GOLD: '#FFD700'
};

// Use in bookmark
await manager.createBookmark(pdfId, {
  page: 5,
  name: 'Chapter 2',
  color: BookmarkColors.GOLD
});
```

---

## Reading Progress Tracking

Track reading progress automatically:

```javascript
// Update current page
await manager.updateProgress('my-pdf-id', {
  currentPage: 25,
  totalPages: 100,
  lastReadAt: Date.now()
});

// Get reading progress
const progress = await manager.getProgress('my-pdf-id');

console.log('Current page:', progress.currentPage);
console.log('Total pages:', progress.totalPages);
console.log('Completion:', progress.completionPercentage + '%');
console.log('Last read:', new Date(progress.lastReadAt));
console.log('Time spent:', progress.totalTimeSpent, 'seconds');
console.log('Sessions:', progress.sessionCount);
```

**Progress Data:**
```typescript
{
  currentPage: number;
  totalPages: number;
  completionPercentage: number;
  lastReadAt: number;           // Timestamp
  totalTimeSpent: number;       // Seconds
  sessionCount: number;
  averageReadingSpeed: number;  // Pages per minute
}
```

---

## Complete Example: Bookmark System

```javascript
import React, { useState, useEffect } from 'react';
import { View, Button, TextInput, Alert, FlatList, Text } from 'react-native';
import { BookmarkManager } from 'react-native-pdf-jsi/src/bookmarks/BookmarkManager';

const BookmarkSystem = ({ pdfId, currentPage, onNavigate }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkName, setBookmarkName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#FFD700');
  const [manager] = useState(() => new BookmarkManager());

  useEffect(() => {
    initializeBookmarks();
  }, [pdfId]);

  const initializeBookmarks = async () => {
    await manager.initialize();
    await loadBookmarks();
  };

  const loadBookmarks = async () => {
    const pdfBookmarks = await manager.getBookmarks(pdfId);
    setBookmarks(pdfBookmarks);
  };

  const createBookmark = async () => {
    if (!bookmarkName.trim()) {
      Alert.alert('Error', 'Please enter a bookmark name');
      return;
    }

    try {
      await manager.createBookmark(pdfId, {
        page: currentPage,
        name: bookmarkName,
        color: selectedColor,
        notes: `Created on ${new Date().toLocaleDateString()}`
      });

      setBookmarkName('');
      await loadBookmarks();
      Alert.alert('Success', 'Bookmark created!');

    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const deleteBookmark = async (bookmarkId) => {
    try {
      await manager.deleteBookmark(pdfId, bookmarkId);
      await loadBookmarks();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const navigateToBookmark = async (bookmarkId) => {
    const bookmark = await manager.getBookmark(pdfId, bookmarkId);
    if (bookmark && onNavigate) {
      onNavigate(bookmark.page);
    }
  };

  const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#95E1D3', '#FFD93D', 
                  '#A78BFA', '#FFAA64', '#FFA6C1', '#38B2AC', '#818CF8'];

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
        Bookmarks
      </Text>

      {/* Create Bookmark */}
      <View style={{ marginBottom: 20 }}>
        <Text>Add Bookmark for Page {currentPage}</Text>
        <TextInput
          value={bookmarkName}
          onChangeText={setBookmarkName}
          placeholder="Bookmark name..."
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            borderRadius: 5,
            marginTop: 10
          }}
        />

        {/* Color Picker */}
        <View style={{ flexDirection: 'row', marginTop: 10, flexWrap: 'wrap' }}>
          {colors.map(color => (
            <TouchableOpacity
              key={color}
              onPress={() => setSelectedColor(color)}
              style={{
                width: 30,
                height: 30,
                backgroundColor: color,
                borderRadius: 15,
                margin: 5,
                borderWidth: selectedColor === color ? 3 : 0,
                borderColor: '#000'
              }}
            />
          ))}
        </View>

        <Button title="Create Bookmark" onPress={createBookmark} />
      </View>

      {/* Bookmark List */}
      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 15,
            marginBottom: 10,
            backgroundColor: '#f5f5f5',
            borderRadius: 8,
            borderLeftWidth: 4,
            borderLeftColor: item.color
          }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
              <Text style={{ color: '#666', fontSize: 12 }}>Page {item.page}</Text>
              {item.notes && (
                <Text style={{ color: '#999', fontSize: 12, marginTop: 5 }}>
                  {item.notes}
                </Text>
              )}
            </View>

            <Button
              title="Go"
              onPress={() => navigateToBookmark(item.id)}
            />
            <View style={{ width: 10 }} />
            <Button
              title="Delete"
              color="red"
              onPress={() => deleteBookmark(item.id)}
            />
          </View>
        )}
      />
    </View>
  );
};

export default BookmarkSystem;
```

---

## Best Practices

### 1. Initialize Early

```javascript
useEffect(() => {
  const initManager = async () => {
    const manager = new BookmarkManager();
    await manager.initialize();
    setBookmarkManager(manager);
  };
  initManager();
}, []);
```

### 2. Auto-Save Progress

```javascript
const handlePageChange = async (page) => {
  setCurrentPage(page);
  
  // Auto-save progress
  await bookmarkManager.updateProgress(pdfId, {
    currentPage: page,
    totalPages: totalPages,
    lastReadAt: Date.now()
  });
};
```

### 3. Use Colors for Organization

```javascript
// Color code by category
const colors = {
  important: '#FF6B6B',    // Red
  reference: '#4ECDC4',    // Blue
  review: '#FFD93D',       // Yellow
  complete: '#95E1D3'      // Green
};

await manager.createBookmark(pdfId, {
  page: 10,
  name: 'Important Formula',
  color: colors.important
});
```

---

## See Also

- [Bookmark API](/docs/api/bookmark-api) - Detailed API reference
- [Bookmarks Demo](/docs/examples/bookmarks-demo) - Complete example
- [Analytics](/docs/features/analytics) - Progress tracking details

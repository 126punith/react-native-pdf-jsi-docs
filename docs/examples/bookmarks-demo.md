---
sidebar_position: 2
title: Bookmarks Demo
description: Complete bookmark system with UI
---

# Bookmarks Demo

Full-featured bookmark system with creation, editing, deletion, and navigation.

## Features

- Create bookmarks with colors
- Edit bookmark names and colors
- Delete individual bookmarks
- Navigate to bookmarked pages
- Bookmark indicator on current page
- Swipeable bookmark list
- Persistent storage

---

## Complete Code

```javascript
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  StyleSheet,
  Alert
} from 'react-native';
import Pdf from 'react-native-pdf-jsi';
import { BookmarkManager } from 'react-native-pdf-jsi/src/bookmarks/BookmarkManager';

const BookmarksDemo = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [bookmarks, setBookmarks] = useState([]);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [showBookmarkList, setShowBookmarkList] = useState(false);
  const [bookmarkName, setBookmarkName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#FFD700');
  
  const pdfRef = React.useRef(null);
  const [manager] = useState(() => new BookmarkManager());
  const pdfId = 'demo-pdf';

  const colors = [
    '#FFD700', '#FF6B6B', '#4ECDC4', '#95E1D3', '#FFD93D',
    '#A78BFA', '#FFAA64', '#FFA6C1', '#38B2AC', '#818CF8'
  ];

  const source = {
    uri: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    cache: true
  };

  useEffect(() => {
    initializeBookmarks();
  }, []);

  const initializeBookmarks = async () => {
    await manager.initialize();
    await loadBookmarks();
  };

  const loadBookmarks = async () => {
    const pdfBookmarks = await manager.getBookmarks(pdfId);
    setBookmarks(pdfBookmarks);
  };

  const handleCreateBookmark = async () => {
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
      setShowBookmarkModal(false);
      await loadBookmarks();
      Alert.alert('Success', 'Bookmark created!');

    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDeleteBookmark = async (bookmarkId) => {
    Alert.alert(
      'Delete Bookmark',
      'Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await manager.deleteBookmark(pdfId, bookmarkId);
            await loadBookmarks();
          }
        }
      ]
    );
  };

  const handleNavigateToBookmark = async (bookmarkId) => {
    const bookmark = await manager.getBookmark(pdfId, bookmarkId);
    if (bookmark && pdfRef.current) {
      pdfRef.current.setPage(bookmark.page);
      setShowBookmarkList(false);
    }
  };

  const currentPageBookmarks = bookmarks.filter(b => b.page === currentPage);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Bookmarks Demo</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowBookmarkModal(true)}
          >
            <Text style={styles.headerButtonText}>+ Add</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowBookmarkList(true)}
          >
            <Text style={styles.headerButtonText}>📚 List ({bookmarks.length})</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bookmark Indicator */}
      {currentPageBookmarks.length > 0 && (
        <View style={styles.bookmarkIndicator}>
          {currentPageBookmarks.map((bookmark, index) => (
            <View
              key={index}
              style={[
                styles.bookmarkBadge,
                { backgroundColor: bookmark.color }
              ]}
            >
              <Text style={styles.bookmarkBadgeText}>{bookmark.name}</Text>
            </View>
          ))}
        </View>
      )}

      {/* PDF Viewer */}
      <Pdf
        ref={pdfRef}
        source={source}
        page={currentPage}
        onLoadComplete={(pages) => setTotalPages(pages)}
        onPageChanged={(page) => setCurrentPage(page)}
        style={styles.pdf}
      />

      {/* Create Bookmark Modal */}
      <Modal
        visible={showBookmarkModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Add Bookmark - Page {currentPage}
            </Text>

            <TextInput
              value={bookmarkName}
              onChangeText={setBookmarkName}
              placeholder="Bookmark name..."
              style={styles.input}
            />

            <Text style={styles.colorLabel}>Choose Color:</Text>
            <View style={styles.colorPicker}>
              {colors.map(color => (
                <TouchableOpacity
                  key={color}
                  onPress={() => setSelectedColor(color)}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorSelected
                  ]}
                />
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowBookmarkModal(false);
                  setBookmarkName('');
                }}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleCreateBookmark}
              >
                <Text style={{ color: 'white' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bookmark List Modal */}
      <Modal
        visible={showBookmarkList}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { height: '80%' }]}>
            <Text style={styles.modalTitle}>
              Bookmarks ({bookmarks.length})
            </Text>

            <FlatList
              data={bookmarks}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.bookmarkItem,
                    { borderLeftColor: item.color }
                  ]}
                >
                  <TouchableOpacity
                    style={styles.bookmarkContent}
                    onPress={() => handleNavigateToBookmark(item.id)}
                  >
                    <Text style={styles.bookmarkName}>{item.name}</Text>
                    <Text style={styles.bookmarkPage}>Page {item.page}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDeleteBookmark(item.id)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            />

            <TouchableOpacity
              style={[styles.modalButton, styles.closeButton]}
              onPress={() => setShowBookmarkList(false)}
            >
              <Text style={{ color: 'white' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#6366F1',
    padding: 15,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    marginLeft: 10,
  },
  headerButtonText: {
    color: 'white',
    fontSize: 14,
  },
  bookmarkIndicator: {
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    padding: 8,
  },
  bookmarkBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 5,
  },
  bookmarkBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pdf: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  colorLabel: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: '600',
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 5,
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: '#000',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  saveButton: {
    backgroundColor: '#6366F1',
  },
  closeButton: {
    backgroundColor: '#6366F1',
    marginTop: 15,
  },
  bookmarkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  bookmarkContent: {
    flex: 1,
  },
  bookmarkName: {
    fontSize: 16,
    fontWeight: '600',
  },
  bookmarkPage: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
  },
});

export default BookmarksDemo;
```

---

## See Also

- [Bookmarks Feature](/docs/features/bookmarks) - Feature overview
- [Bookmark API](/docs/api/bookmark-api) - API reference

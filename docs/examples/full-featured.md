---
sidebar_position: 4
title: Full-Featured App
description: Production-ready PDF viewer with all features
---

# Full-Featured PDF Viewer

A complete, production-ready PDF viewer integrating all features: bookmarks, analytics, export, and PDF operations.

## Features Included

- PDF viewing with JSI acceleration
- Bookmark creation and management
- Reading analytics dashboard
- Export to images
- PDF operations (split, extract)
- Progress tracking
- File management
- Professional UI

---

## Complete Implementation

```javascript
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import Pdf from 'react-native-pdf-jsi';
import { BookmarkManager } from 'react-native-pdf-jsi/src/bookmarks/BookmarkManager';
import { AnalyticsManager } from 'react-native-pdf-jsi/src/analytics/AnalyticsManager';
import { ExportManager } from 'react-native-pdf-jsi/src/export/ExportManager';
import { usePDFJSI } from 'react-native-pdf-jsi/src/hooks/usePDFJSI';

const FullFeaturedPDFApp = () => {
  // Core state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Feature state
  const [bookmarks, setBookmarks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [showToolbar, setShowToolbar] = useState(true);
  
  // Modal state
  const [showBookmarkList, setShowBookmarkList] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showOperations, setShowOperations] = useState(false);
  
  // Processing state
  const [processing, setProcessing] = useState(false);
  
  // Refs
  const pdfRef = useRef(null);
  const [bookmarkManager] = useState(() => new BookmarkManager());
  const [analyticsManager] = useState(() => new AnalyticsManager());
  const [exportManager] = useState(() => new ExportManager());
  
  // JSI Hook
  const {
    isJSIAvailable,
    performanceMetrics,
    updatePerformanceMetrics
  } = usePDFJSI({ autoInitialize: true, enablePerformanceTracking: true });

  const pdfId = 'main-document';
  const source = {
    uri: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    cache: true
  };

  // Initialize
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await bookmarkManager.initialize();
      await loadBookmarks();
      setLoading(false);
    } catch (error) {
      console.error('Initialization error:', error);
      setLoading(false);
    }
  };

  const loadBookmarks = async () => {
    const pdfBookmarks = await bookmarkManager.getBookmarks(pdfId);
    setBookmarks(pdfBookmarks);
  };

  const loadAnalytics = async () => {
    try {
      await analyticsManager.initialize();
      const analyticsData = await analyticsManager.getAnalytics(pdfId);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Analytics error:', error);
    }
  };

  // Event Handlers
  const handlePageChange = async (page, total) => {
    setCurrentPage(page);
    
    // Update reading progress
    await bookmarkManager.updateProgress(pdfId, {
      currentPage: page,
      totalPages: total,
      lastReadAt: Date.now()
    });

    // Refresh analytics
    if (analytics) {
      await loadAnalytics();
    }
  };

  const handleLoadComplete = (pages) => {
    setTotalPages(pages);
    setLoading(false);
  };

  // Bookmark Operations
  const quickAddBookmark = async () => {
    try {
      await bookmarkManager.createBookmark(pdfId, {
        page: currentPage,
        name: `Page ${currentPage}`,
        color: '#FFD700',
        notes: 'Quick bookmark'
      });
      await loadBookmarks();
      Alert.alert('Success', 'Bookmark added!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const navigateToBookmark = async (bookmarkId) => {
    const bookmark = await bookmarkManager.getBookmark(pdfId, bookmarkId);
    if (bookmark && pdfRef.current) {
      pdfRef.current.setPage(bookmark.page);
      setShowBookmarkList(false);
    }
  };

  // Export Operations
  const exportCurrentPage = async (format, quality) => {
    setProcessing(true);
    try {
      const imagePath = await exportManager.exportPageToImage(
        source.uri,
        currentPage,
        { format, quality, scale: 2.0 }
      );
      
      Alert.alert('Export Complete', `Saved to: ${imagePath}`);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setProcessing(false);
      setShowExportMenu(false);
    }
  };

  // PDF Operations
  const splitPDF = async () => {
    setProcessing(true);
    try {
      const midpoint = Math.ceil(totalPages / 2);
      const results = await exportManager.splitPDF(
        source.uri,
        [[1, midpoint], [midpoint + 1, totalPages]]
      );
      Alert.alert('Success', `Split into ${results.length} files`);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setProcessing(false);
      setShowOperations(false);
    }
  };

  const currentPageBookmarks = bookmarks.filter(b => b.page === currentPage);

  return (
    <View style={styles.container}>
      {/* Top Toolbar */}
      {showToolbar && (
        <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>PDF Reader</Text>
          
          <View style={styles.toolbarButtons}>
            <ToolbarButton
              icon="🔖"
              onPress={quickAddBookmark}
              badge={currentPageBookmarks.length}
            />
            <ToolbarButton
              icon="📚"
              onPress={() => setShowBookmarkList(true)}
              badge={bookmarks.length}
            />
            <ToolbarButton
              icon="📊"
              onPress={() => {
                loadAnalytics();
                setShowAnalytics(true);
              }}
            />
            <ToolbarButton
              icon="🖼️"
              onPress={() => setShowExportMenu(true)}
            />
            <ToolbarButton
              icon="✂️"
              onPress={() => setShowOperations(true)}
            />
          </View>
        </View>
      )}

      {/* JSI Status Badge */}
      {isJSIAvailable && (
        <View style={styles.jsiBadge}>
          <Text style={styles.jsiText}>⚡ JSI Accelerated</Text>
        </View>
      )}

      {/* Bookmark Indicator */}
      {currentPageBookmarks.length > 0 && (
        <View style={styles.bookmarkIndicator}>
          {currentPageBookmarks.map((bookmark, index) => (
            <View
              key={index}
              style={[
                styles.bookmarkTag,
                { backgroundColor: bookmark.color }
              ]}
            >
              <Text style={styles.bookmarkTagText}>{bookmark.name}</Text>
            </View>
          ))}
        </View>
      )}

      {/* PDF Viewer */}
      <Pdf
        ref={pdfRef}
        source={source}
        page={currentPage}
        onLoadComplete={handleLoadComplete}
        onPageChanged={(page, total) => handlePageChange(page, total)}
        onError={(error) => Alert.alert('Error', error.message)}
        enablePaging={true}
        style={styles.pdf}
      />

      {/* Page Counter */}
      <View style={styles.pageCounter}>
        <Text style={styles.pageText}>
          {currentPage} / {totalPages}
        </Text>
      </View>

      {/* Bookmark List Modal */}
      <Modal
        visible={showBookmarkList}
        transparent={true}
        animationType="slide"
      >
        <BookmarkListPanel
          bookmarks={bookmarks}
          onNavigate={navigateToBookmark}
          onClose={() => setShowBookmarkList(false)}
        />
      </Modal>

      {/* Analytics Modal */}
      <Modal
        visible={showAnalytics}
        transparent={true}
        animationType="slide"
      >
        <AnalyticsPanel
          analytics={analytics}
          onClose={() => setShowAnalytics(false)}
        />
      </Modal>

      {/* Export Menu Modal */}
      <Modal
        visible={showExportMenu}
        transparent={true}
        animationType="slide"
      >
        <ExportMenuPanel
          currentPage={currentPage}
          onExport={exportCurrentPage}
          processing={processing}
          onClose={() => setShowExportMenu(false)}
        />
      </Modal>

      {/* Operations Modal */}
      <Modal
        visible={showOperations}
        transparent={true}
        animationType="slide"
      >
        <OperationsPanel
          onSplit={splitPDF}
          processing={processing}
          onClose={() => setShowOperations(false)}
        />
      </Modal>
    </View>
  );
};

// Toolbar Button Component
const ToolbarButton = ({ icon, onPress, badge }) => (
  <TouchableOpacity style={styles.toolbarButton} onPress={onPress}>
    <Text style={styles.toolbarIcon}>{icon}</Text>
    {badge > 0 && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badge}</Text>
      </View>
    )}
  </TouchableOpacity>
);

// Bookmark List Panel
const BookmarkListPanel = ({ bookmarks, onNavigate, onClose }) => (
  <View style={styles.modalOverlay}>
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>Bookmarks ({bookmarks.length})</Text>
      
      <ScrollView>
        {bookmarks.map((bookmark) => (
          <TouchableOpacity
            key={bookmark.id}
            style={[
              styles.bookmarkItem,
              { borderLeftColor: bookmark.color }
            ]}
            onPress={() => onNavigate(bookmark.id)}
          >
            <Text style={styles.bookmarkName}>{bookmark.name}</Text>
            <Text style={styles.bookmarkPage}>Page {bookmark.page}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={{ color: 'white' }}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// Analytics Panel
const AnalyticsPanel = ({ analytics, onClose }) => {
  if (!analytics) {
    return (
      <View style={styles.modalOverlay}>
        <View style={styles.panel}>
          <Text>Loading analytics...</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={{ color: 'white' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const { readingMetrics, timeAnalytics, engagementMetrics } = analytics;

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Reading Analytics</Text>
        
        <ScrollView>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Progress</Text>
            <Text style={styles.statValue}>
              {readingMetrics.completionRate}%
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Time Spent</Text>
            <Text style={styles.statValue}>
              {timeAnalytics.totalTimeFormatted}
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Reading Speed</Text>
            <Text style={styles.statValue}>
              {readingMetrics.pagesPerHour} pages/hr
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Engagement Score</Text>
            <Text style={styles.statValue}>
              {engagementMetrics.engagementScore}/100
            </Text>
          </View>
        </ScrollView>
        
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={{ color: 'white' }}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Export Menu Panel
const ExportMenuPanel = ({ currentPage, onExport, processing, onClose }) => (
  <View style={styles.modalOverlay}>
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>Export Page {currentPage}</Text>
      
      {processing ? (
        <ActivityIndicator size="large" color="#6366F1" />
      ) : (
        <View>
          <TouchableOpacity
            style={styles.exportButton}
            onPress={() => onExport('png', 0.9)}
          >
            <Text style={styles.exportButtonText}>Export as PNG (High Quality)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.exportButton, { backgroundColor: '#FFD93D' }]}
            onPress={() => onExport('jpeg', 0.75)}
          >
            <Text style={styles.exportButtonText}>Export as JPEG (Medium)</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={{ color: 'white' }}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// Operations Panel
const OperationsPanel = ({ onSplit, processing, onClose }) => (
  <View style={styles.modalOverlay}>
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>PDF Operations</Text>
      
      {processing ? (
        <ActivityIndicator size="large" color="#6366F1" />
      ) : (
        <View>
          <TouchableOpacity
            style={styles.operationButton}
            onPress={onSplit}
          >
            <Text style={styles.operationButtonText}>✂️ Split PDF in Half</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={{ color: 'white' }}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  toolbar: {
    backgroundColor: '#6366F1',
    paddingTop: 50,
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  toolbarTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  toolbarButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  toolbarButton: {
    padding: 8,
    position: 'relative',
  },
  toolbarIcon: {
    fontSize: 24,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  jsiBadge: {
    backgroundColor: '#4CAF50',
    padding: 6,
    alignItems: 'center',
  },
  jsiText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bookmarkIndicator: {
    backgroundColor: '#FFD700',
    padding: 8,
  },
  bookmarkTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 4,
  },
  bookmarkTagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pdf: {
    flex: 1,
  },
  pageCounter: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pageText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  panel: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  panelTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  bookmarkItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderLeftWidth: 4,
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
  statCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366F1',
  },
  exportButton: {
    backgroundColor: '#4ECDC4',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  exportButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  operationButton: {
    backgroundColor: '#95E1D3',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  operationButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#6366F1',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
});

export default FullFeaturedPDFApp;
```

---

## Architecture

This app demonstrates a production-ready architecture:

### State Management
- React hooks for local state
- Managers for business logic
- Persistent storage with AsyncStorage

### Component Structure
- Main viewer component
- Reusable toolbar buttons
- Modal panels for features
- Separate panels for each feature

### Performance
- JSI acceleration
- Lazy loading
- Smart caching
- Memory optimization

---

## Key Patterns

### 1. Manager Pattern

```javascript
const [manager] = useState(() => new BookmarkManager());

useEffect(() => {
  manager.initialize();
}, []);
```

### 2. Modal Panels

```javascript
<Modal visible={showFeature} animationType="slide">
  <FeaturePanel onClose={() => setShowFeature(false)} />
</Modal>
```

### 3. Auto-Save Progress

```javascript
onPageChanged={(page, total) => {
  bookmarkManager.updateProgress(pdfId, { currentPage: page, totalPages: total });
}}
```

---

## See Also

- [Basic Viewer](/docs/examples/basic-viewer) - Simple example
- [Bookmarks Demo](/docs/examples/bookmarks-demo) - Bookmarks focus
- [Export Demo](/docs/examples/export-demo) - Export focus

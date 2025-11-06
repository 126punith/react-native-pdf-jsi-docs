---
sidebar_position: 3
title: Export Demo
description: Export PDF pages to images with quality selection
---

# Export Demo

Complete export demonstration with format selection, quality control, and file management.

## Features

- Export current page or multiple pages
- Choose PNG or JPEG format
- Select quality level
- Progress tracking
- Download to public storage
- Share exported files

---

## Complete Code

```javascript
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Alert,
  NativeModules
} from 'react-native';
import Pdf from 'react-native-pdf-jsi';
import { ExportManager } from 'react-native-pdf-jsi/src/export/ExportManager';

const { FileDownloader, FileManager } = NativeModules;

const ExportDemo = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const pdfRef = React.useRef(null);
  const exportManager = new ExportManager();

  const source = {
    uri: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    cache: true
  };

  const handleExport = async (format, quality, pageCount) => {
    setExporting(true);
    setExportProgress(0);

    try {
      let exportedFiles = [];

      if (pageCount === 1) {
        // Export single page
        const imagePath = await exportManager.exportPageToImage(
          source.uri,
          currentPage,
          { format, quality, scale: 2.0 }
        );
        exportedFiles = [imagePath];
        setExportProgress(100);

      } else {
        // Export multiple pages
        const pages = Array.from(
          { length: Math.min(pageCount, totalPages) },
          (_, i) => i + 1
        );

        exportedFiles = await exportManager.exportPagesToImages(
          source.uri,
          pages,
          { format, quality, scale: 2.0 },
          (current, total) => {
            setExportProgress((current / total) * 100);
          }
        );
      }

      // Download to public storage (Android)
      if (FileDownloader) {
        for (let i = 0; i < exportedFiles.length; i++) {
          await FileDownloader.downloadToPublicFolder(
            exportedFiles[i],
            `page-${i + 1}.${format}`,
            `image/${format}`
          );
        }
      }

      setExporting(false);
      setShowExportMenu(false);

      // Show success
      Alert.alert(
        'Export Complete',
        `Exported ${exportedFiles.length} page(s) as ${format.toUpperCase()}`,
        [
          { text: 'Done', style: 'cancel' },
          FileManager && {
            text: 'Open Folder',
            onPress: () => FileManager.openDownloadsFolder()
          },
          {
            text: 'Share',
            onPress: () => exportManager.share(exportedFiles[0], { type: 'file' })
          }
        ].filter(Boolean)
      );

    } catch (error) {
      setExporting(false);
      Alert.alert('Export Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Export Demo</Text>
        <TouchableOpacity
          style={styles.exportButton}
          onPress={() => setShowExportMenu(true)}
        >
          <Text style={styles.exportButtonText}>🖼️ Export</Text>
        </TouchableOpacity>
      </View>

      {/* PDF Viewer */}
      <Pdf
        ref={pdfRef}
        source={source}
        page={currentPage}
        onLoadComplete={(pages) => setTotalPages(pages)}
        onPageChanged={(page) => setCurrentPage(page)}
        style={styles.pdf}
      />

      {/* Page Counter */}
      <View style={styles.pageCounter}>
        <Text style={styles.pageText}>
          Page {currentPage} of {totalPages}
        </Text>
      </View>

      {/* Export Menu Modal */}
      <Modal
        visible={showExportMenu}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Export Pages</Text>

            {exporting ? (
              <View style={styles.exportingView}>
                <ActivityIndicator size="large" color="#6366F1" />
                <Text style={styles.progressText}>
                  {exportProgress.toFixed(0)}%
                </Text>
              </View>
            ) : (
              <>
                <Text style={styles.sectionTitle}>Current Page</Text>
                <View style={styles.buttonRow}>
                  <ExportButton
                    label="PNG High"
                    onPress={() => handleExport('png', 0.9, 1)}
                    color="#4ECDC4"
                  />
                  <ExportButton
                    label="JPEG Medium"
                    onPress={() => handleExport('jpeg', 0.75, 1)}
                    color="#FFD93D"
                  />
                </View>

                <Text style={styles.sectionTitle}>Multiple Pages</Text>
                <View style={styles.buttonRow}>
                  <ExportButton
                    label="First 3 (PNG)"
                    onPress={() => handleExport('png', 0.9, 3)}
                    color="#95E1D3"
                  />
                  <ExportButton
                    label="First 5 (JPEG)"
                    onPress={() => handleExport('jpeg', 0.8, 5)}
                    color="#FFAA64"
                  />
                </View>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowExportMenu(false)}
                >
                  <Text style={{ color: 'white' }}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const ExportButton = ({ label, onPress, color }) => (
  <TouchableOpacity
    style={[styles.exportOptionButton, { backgroundColor: color }]}
    onPress={onPress}
  >
    <Text style={styles.exportOptionText}>{label}</Text>
  </TouchableOpacity>
);

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
  exportButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  exportButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 400,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  exportOptionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  exportOptionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  exportingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366F1',
  },
  closeButton: {
    backgroundColor: '#6366F1',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
});

export default ExportDemo;
```

---

## See Also

- [Export Feature](/docs/features/export) - Export overview
- [Export API](/docs/api/export-api) - API reference
- [File Management](/docs/api/file-management-api) - Download files

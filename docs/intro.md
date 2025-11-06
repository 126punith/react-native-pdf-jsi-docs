---
sidebar_position: 1
---

# Introduction

Welcome to **react-native-pdf-jsi** - the most feature-complete FREE PDF library for React Native!

## What is react-native-pdf-jsi?

react-native-pdf-jsi is a high-performance React Native PDF viewer component with **JSI (JavaScript Interface)** integration for enhanced speed and efficiency. It's a complete replacement for existing PDF libraries, offering **80x faster** performance and advanced features that are **completely free**.

### Key Highlights

- ⚡ **80x Faster** - JSI acceleration for direct JavaScript-to-Native communication
- ✅ **Google Play Compliant** - 16KB page size support for Android 15+
- 📚 **Advanced Bookmarks** - 10 colors, notes, swipeable UI
- 🖼️ **Export to Images** - PNG/JPEG with quality control
- ✂️ **PDF Operations** - Split, extract, merge, rotate operations
- 📊 **Reading Analytics** - Session tracking and detailed statistics
- 🔧 **PDF Compression** - Reduce file sizes with smart presets
- 📥 **File Management** - Download to storage, open folders (Android)
- 🔍 **Text Extraction** - Extract and search text from PDFs
- 🆓 **100% Free** - All features included, MIT licensed, no hidden fees

## Why Choose react-native-pdf-jsi?

### The Only Free Library with Enterprise Features

**react-native-pdf-jsi** offers enterprise-grade features that are completely free and open source:

| Feature | react-native-pdf-jsi | Others |
|---------|---------------------|--------|
| JSI Acceleration | ✅ FREE | ❌ No |
| Google Play 16KB | ✅ Compliant | ❌ Not supported |
| Bookmarks (10 colors) | ✅ FREE | ❌ No |
| Export Images/Text | ✅ FREE | ❌ Limited/Paid |
| PDF Operations | ✅ FREE | ❌ No |
| Reading Analytics | ✅ FREE | ❌ No |
| PDF Compression | ✅ FREE | ❌ No |
| Text Extraction | ✅ FREE | ❌ No |
| File Management | ✅ FREE | ❌ No |

### Performance Breakthrough

Real-world benchmarks show dramatic performance improvements:

| Operation | Standard Bridge | JSI Mode | **Improvement** |
|-----------|-----------------|----------|-----------------|
| Page Render | 45ms | 2ms | **22.5x faster** |
| Cache Access | 8ms | 0.1ms | **80x faster** |
| Text Search | 120ms | 15ms | **8x faster** |

## What's Included?

### Core Features
- PDF viewing (horizontal/vertical/scroll modes)
- Zoom, pan, and double-tap gestures
- Page navigation
- Password-protected PDFs
- Lazy loading for large files
- Smart 30-day caching
- Text search with bounds

### Advanced Features
- **Bookmarks** - Create, edit, delete with 10 custom colors and notes
- **Export** - Convert pages to PNG/JPEG images or extract text
- **PDF Operations** - Split, merge, extract, rotate, and delete pages
- **PDF Compression** - Reduce file sizes with smart presets
- **Reading Analytics** - Track sessions, progress, speed, and engagement
- **Text Extraction** - Extract and search text with statistics
- **File Management** - Download to public storage, open folders (Android)
- **Professional UI** - Production-ready components included

## Quick Start

Get started in just 2 minutes:

```bash
npm install react-native-pdf-jsi react-native-blob-util
```

```jsx
import Pdf from 'react-native-pdf-jsi';

<Pdf 
  source={{ uri: 'https://example.com/document.pdf' }} 
  style={{ flex: 1 }}
/>
```

That's it! You now have a fully functional PDF viewer with JSI acceleration.

## Next Steps

<div className="alert alert-info">
  Ready to build amazing PDF apps? Follow these steps:
</div>

1. **[Installation](/docs/getting-started/installation)** - Set up for iOS, Android, and Windows
2. **[Quick Start](/docs/getting-started/quick-start)** - Build your first PDF viewer
3. **[Features](/docs/features/core-features)** - Explore all available features
4. **[API Reference](/docs/api/pdf-component)** - Complete API documentation
5. **[Examples](/docs/examples/basic-viewer)** - Working code examples

## Support & Community

- 📦 **NPM**: [react-native-pdf-jsi](https://www.npmjs.com/package/react-native-pdf-jsi)
- 🐙 **GitHub**: [126punith/react-native-enhanced-pdf](https://github.com/126punith/react-native-enhanced-pdf)
- 📧 **Email**: punithm300@gmail.com
- 🎥 **Demo**: [YouTube Shorts](https://www.youtube.com/shorts/OmCUq9wLoHo)

## License

MIT Licensed - Use freely in personal and commercial projects.

---

**Ready to get started?** Head over to the [Installation Guide](/docs/getting-started/installation) to set up react-native-pdf-jsi in your project!

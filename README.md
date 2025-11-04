# react-native-pdf-jsi Documentation

This repository contains the official documentation website for [react-native-pdf-jsi](https://github.com/126punith/react-native-enhanced-pdf), built with [Docusaurus](https://docusaurus.io/).

## 🚀 Live Site

Visit the live documentation at: **[react-native-pdf-jsi.netlify.app](https://react-native-pdf-jsi.netlify.app)**

## 📦 What's Included

- **Getting Started Guides** - Installation, Quick Start, Migration
- **Feature Documentation** - Core features, JSI acceleration, and advanced capabilities
- **API Reference** - Complete API documentation for all components and managers
- **Code Examples** - Working examples for common use cases
- **Professional Design** - Responsive, dark mode, mobile-friendly

## 🛠 Development

### Prerequisites

- Node.js 18+ (we recommend using [nvm](https://github.com/nvm-sh/nvm))
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/126punith/react-native-pdf-jsi-docs.git
cd react-native-pdf-jsi-docs

# Install dependencies
npm install
```

### Local Development

```bash
# Start development server
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

The site will be available at `http://localhost:3000`

### Build

```bash
# Create production build
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Test Build Locally

```bash
# Serve production build locally
npm run serve
```

## 📝 Contributing

We welcome contributions to improve the documentation!

### Adding New Documentation

1. Create a new `.md` file in the appropriate directory:
   - `docs/getting-started/` - For setup and installation guides
   - `docs/features/` - For feature documentation
   - `docs/api/` - For API reference
   - `docs/examples/` - For code examples

2. Add frontmatter to your document:
```markdown
---
sidebar_position: 1
---

# Your Page Title

Your content here...
```

3. Update `sidebars.ts` if needed to include your new page in navigation

### Improving Existing Documentation

1. Find the relevant `.md` file
2. Make your changes
3. Test locally with `npm start`
4. Submit a pull request

## 🎨 Styling

- Custom styles are in `src/css/custom.css`
- Theme colors and configuration are in `docusaurus.config.ts`
- Component styling uses CSS modules

## 🚢 Deployment

The site is automatically deployed to Netlify when changes are pushed to the `main` branch.

### Manual Deployment

1. Build the site:
```bash
npm run build
```

2. Deploy the `build` directory to your hosting provider

### Netlify Configuration

Deployment is configured via `netlify.toml`:
- Build command: `npm run build`
- Publish directory: `build`
- Node version: 18
- Automatic redirects for SPA routing
- Security headers configured
- Asset caching optimized

## 📚 Documentation Structure

```
docs/
├── intro.md                        # Homepage content
├── getting-started/
│   ├── installation.md             # Platform setup guides
│   ├── quick-start.md              # Quick start tutorial
│   └── migration.md                # Migration from react-native-pdf
├── features/
│   ├── core-features.md            # Basic PDF viewing
│   ├── jsi-acceleration.md         # Performance features
│   ├── lazy-loading.md             # Caching and optimization
│   ├── bookmarks.md                # Bookmark management
│   ├── export.md                   # Export to images
│   ├── pdf-operations.md           # Split/extract operations
│   ├── analytics.md                # Reading analytics
│   └── advanced.md                 # Advanced features
├── api/
│   ├── pdf-component.md            # Main Pdf component API
│   ├── hooks.md                    # React hooks
│   ├── bookmark-api.md             # BookmarkManager API
│   ├── export-api.md               # ExportManager API
│   └── jsi-api.md                  # JSI methods
└── examples/
    ├── basic-viewer.md             # Simple PDF viewer
    ├── bookmarks-demo.md           # Bookmark system
    ├── export-demo.md              # Export functionality
    └── full-featured.md            # Complete app
```

## 🐛 Reporting Issues

Found a problem with the documentation?

1. Check if it's already [reported](https://github.com/126punith/react-native-enhanced-pdf/issues)
2. Create a [new issue](https://github.com/126punith/react-native-enhanced-pdf/issues/new) with:
   - Clear description
   - Steps to reproduce (if applicable)
   - Screenshots (if relevant)
   - Suggested fix (if you have one)

## 📧 Contact

- **Author**: Punith M
- **Email**: punithm300@gmail.com
- **GitHub**: [@126punith](https://github.com/126punith)
- **Library Repo**: [react-native-enhanced-pdf](https://github.com/126punith/react-native-enhanced-pdf)
- **NPM**: [react-native-pdf-jsi](https://www.npmjs.com/package/react-native-pdf-jsi)

## 📄 License

This documentation is licensed under the MIT License.

The library itself (react-native-pdf-jsi) is also MIT licensed.

## 🙏 Acknowledgments

- Built with [Docusaurus](https://docusaurus.io/)
- Hosted on [Netlify](https://www.netlify.com/)
- Based on [react-native-pdf-jsi](https://github.com/126punith/react-native-enhanced-pdf)

---

**Star the project on GitHub!** ⭐
[github.com/126punith/react-native-enhanced-pdf](https://github.com/126punith/react-native-enhanced-pdf)

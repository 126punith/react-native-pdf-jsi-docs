import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 * - create an ordered group of docs
 * - render a sidebar for each doc of that group
 * - provide next/previous navigation
 *
 * The sidebars can be generated from the filesystem, or explicitly defined here.
 */
const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introduction',
    },
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/installation',
        'getting-started/quick-start',
        'getting-started/migration',
      ],
    },
    {
      type: 'category',
      label: 'Features',
      collapsed: false,
      items: [
        'features/core-features',
        'features/jsi-acceleration',
        'features/lazy-loading',
        'features/bookmarks',
        'features/export',
        'features/pdf-operations',
        'features/analytics',
        'features/advanced',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      collapsed: true,
      items: [
        'api/pdf-component',
        'api/hooks',
        'api/bookmark-api',
        'api/export-api',
        'api/jsi-api',
      ],
    },
    {
      type: 'category',
      label: 'Examples',
      collapsed: true,
      items: [
        'examples/basic-viewer',
        'examples/bookmarks-demo',
        'examples/export-demo',
        'examples/full-featured',
      ],
    },
  ],
};

export default sidebars;

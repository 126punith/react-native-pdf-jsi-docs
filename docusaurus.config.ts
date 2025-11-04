import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'react-native-pdf-jsi',
  tagline: '80x Faster · Google Play Compliant · Advanced Features Included',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  // Set the production url of your site here
  url: 'https://react-native-pdf-jsi.netlify.app',
  baseUrl: '/',

  // GitHub pages deployment config
  organizationName: '126punith',
  projectName: 'react-native-enhanced-pdf',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/126punith/react-native-enhanced-pdf/tree/main/docs/',
          showLastUpdateTime: true,
        },
        blog: false, // Disable blog for now
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.jpg',
    metadata: [
      {name: 'keywords', content: 'react native, pdf viewer, jsi, pdf library, react native pdf, pdf viewer react native, free pdf library'},
      {name: 'description', content: 'The fastest and most feature-complete FREE React Native PDF library with JSI acceleration, bookmarks, export, and analytics.'},
      {property: 'og:title', content: 'react-native-pdf-jsi - The Complete PDF Solution'},
      {property: 'og:description', content: '80x faster with JSI · Google Play Compliant · Advanced features included for FREE'},
    ],
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'react-native-pdf-jsi',
      logo: {
        alt: 'react-native-pdf-jsi Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/docs/features/bookmarks',
          label: 'Features',
          position: 'left',
        },
        {
          to: '/docs/api/pdf-component',
          label: 'API',
          position: 'left',
        },
        {
          to: '/docs/examples/basic-viewer',
          label: 'Examples',
          position: 'left',
        },
        {
          href: 'https://www.npmjs.com/package/react-native-pdf-jsi',
          label: 'NPM',
          position: 'right',
        },
        {
          href: 'https://github.com/126punith/react-native-enhanced-pdf',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started/installation',
            },
            {
              label: 'Features',
              to: '/docs/features/core-features',
            },
            {
              label: 'API Reference',
              to: '/docs/api/pdf-component',
            },
            {
              label: 'Examples',
              to: '/docs/examples/basic-viewer',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub Issues',
              href: 'https://github.com/126punith/react-native-enhanced-pdf/issues',
            },
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/126punith/react-native-enhanced-pdf/discussions',
            },
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/react-native-pdf-jsi',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'NPM Package',
              href: 'https://www.npmjs.com/package/react-native-pdf-jsi',
            },
            {
              label: 'Demo Video',
              href: 'https://www.youtube.com/shorts/OmCUq9wLoHo',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/126punith/react-native-enhanced-pdf',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Punith M. All rights reserved. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'java', 'kotlin', 'swift', 'objectivec', 'groovy'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

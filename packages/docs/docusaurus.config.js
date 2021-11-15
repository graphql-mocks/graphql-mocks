/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const path = require('path');

// needed to polyfill Events on the server
require('event-target-polyfill');

module.exports = {
  title: 'graphql-mocks',
  tagline: 'GraphQL Mock API Framework',
  url: 'http://www.graphql-mocks.com',
  baseUrl: '/',
  favicon: 'img/favicon.png',
  organizationName: 'graphql-mocks',
  projectName: 'graphql-mocks',
  onBrokenLinks: 'warn',
  themeConfig: {
    colorMode: {
      disableSwitch: true,
    },
    prism: {
      theme: require('prism-react-renderer/themes/github'),
    },
    navbar: {
      title: 'graphql-mocks',
      logo: {
        alt: 'graphql-mocks logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/getting-started/introduction',
          label: 'Docs',
          position: 'right',
        },
        {
          href: '/api',
          label: 'API',
          position: 'right',
        },
        {
          href: 'https://discord.gg/eJxddt2CJS',
          label: 'Discord',
          position: 'right',
        },
        {
          href: 'https://github.com/graphql-mocks/graphql-mocks',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} by <a href="https://www.github.com/chadian">chadian</a>`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // It is recommended to set document id as docs home page (`docs/` path).
          // homePageId: 'doc1',
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  plugins: [
    path.resolve(__dirname, 'plugins/docusaurus-load-examples.js'),
    path.resolve(__dirname, 'plugins/docusaurus-plausible-analytics.js'),
  ],
};

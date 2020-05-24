const path = require('path');

module.exports = {
  title: 'graphql-mocks',
  tagline: 'Roll your own Mock GraphQL APIs',
  url: 'http://www.graphql-mocks.com',
  baseUrl: '/',
  favicon: 'img/favicon.png',
  organizationName: 'graphql-mocks',
  projectName: 'graphql-mocks',
  themeConfig: {
    disableDarkMode: true,
    prism: {
      theme: require('prism-react-renderer/themes/github'),
    },
    navbar: {
      title: 'graphql-mocks',
      logo: {
        alt: 'graphql-mocks logo',
        src: 'img/logo.svg',
      },
      links: [
        {
          to: 'docs/getting-started/introduction',
          label: 'Docs',
          position: 'right',
          activeBaseRegex: 'docs/(?!(typedoc|api-quick-start))',
        },
        {
          href: 'https://github.com/chadian/graphql-mocks',
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
  plugins: [path.resolve(__dirname, './plugins/docusaurus-load-examples.js')],
};

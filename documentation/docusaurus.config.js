module.exports = {
  title: 'graphql-test-resolvers',
  tagline: 'Mock GraphQL APIs',
  url: 'https://github.com/chadian/graphql-test-resolvers',
  baseUrl: '/',
  favicon: 'img/favicon.png',
  organizationName: 'chadian', // Usually your GitHub org/user name.
  projectName: 'graphql-test-resolvers', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'graphql-test-resolvers',
      logo: {
        alt: 'graphql-test-resolvers logo',
        src: 'img/logo.svg',
      },
      links: [
        {
          to: 'docs/introduction',
          label: 'Docs',
          position: 'left',
          // activeBaseRegex: 'docs/(?!api-quick-start)',
          activeBaseRegex: 'docs/(?!(typedoc|api-quick-start))',
        },
        {
          to: 'docs/api-quick-start',
          label: 'API',
          position: 'left',
          activeBaseRegex: 'docs/(typedoc|api-quick-start)',
        },
        {
          href: 'https://github.com/chadian/graphql-test-resolvers',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} <a href="http://www.sticksnglue.com">sticksnglue</a>`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // It is recommended to set document id as docs home page (`docs/` path).
          homePageId: 'doc1',
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};

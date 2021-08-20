module.exports = function (context, options) {
  return {
    name: 'docusaurus-plausible-analytics',

    injectHtmlTags() {
      return {
        preBodyTags: [
          {
            tagName: 'script',
            attributes: {
              'data-domain': 'graphql-mocks.com',
              defer: true,
              src: 'https://plausible.io/js/plausible.js',
            },
          },
        ],
      };
    },
  };
};

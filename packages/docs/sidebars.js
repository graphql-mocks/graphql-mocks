module.exports = {
  docs: [
    {
      'Getting Started': [
        'getting-started/introduction',
        'getting-started/installation',
        'getting-started/create-handler',
        'getting-started/quick-example',
      ],
    },
    'concepts',
    {
      'Resolver & Wrappers ': [
        'resolver/using-resolvers',
        'resolver/introducing-wrappers',
        'resolver/applying-wrappers',
        'resolver/available-wrappers',
        'resolver/creating-wrappers',
      ],
    },
    {
      'Resolver Map & Middlewares': [
        'resolver-map/using-resolver-maps',
        'resolver-map/introducing-middlewares',
        'resolver-map/managing-resolvers',
        'resolver-map/available-middlewares',
        'resolver-map/creating-middlewares',
      ],
    },
    {
      Highlight: [
        'highlight/introducing-highlight',
        'highlight/available-highlighters',
        'highlight/creating-highlighters',
      ],
    },
    {
      ['GraphQL Paper']: [
        'paper/introducing-paper',
        'paper/installation',
        'paper/querying-data',
        'paper/mutating-data',
      ],
    },
    { Guides: ['guides/automatic-filtering', 'guides/relay-pagination', 'guides/mirage-js', 'guides/pack'] },
  ],
};

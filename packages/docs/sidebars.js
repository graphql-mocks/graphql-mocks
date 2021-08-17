module.exports = {
  docs: [
    {
      'Getting Started': [
        'getting-started/introduction',
        'getting-started/installation',
        'getting-started/create-handler',
        'getting-started/concepts',
        'getting-started/quick-example',
      ],
    },
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
        'paper/operations',
        'paper/events',
        'paper/hooks',
        'paper/validations',
        'paper/technical-notes',
        {
          'GraphQL Paper Guides': ['paper/guides/factories', 'paper/guides/with-graphql', 'paper/guides/managing-ids'],
        },
      ],
    },
    {
      Guides: [
        'guides/paper',
        'guides/automatic-filtering',
        'guides/relay-pagination',
        'guides/pack',
        'guides/mirage-js',
      ],
    },
  ],
};

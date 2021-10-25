module.exports = {
  docs: [
    {
      'Getting Started': [
        'getting-started/introduction',
        'getting-started/installation',
        'getting-started/concepts',
        'getting-started/quick-example',
      ],
    },
    {
      'GraphQL Handler': ['handler/introducing-handler', 'handler/using-middlewares', 'handler/handler-state'],
    },
    {
      ['Network Handling']: ['network/introducing-network-handlers', 'network/express', 'network/msw', 'network/nock'],
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
        'guides/managing-context',
        'guides/automatic-filtering',
        'guides/relay-pagination',
        'guides/faker',
        'guides/pack',
        'guides/mirage-js',
      ],
    },
  ],
};

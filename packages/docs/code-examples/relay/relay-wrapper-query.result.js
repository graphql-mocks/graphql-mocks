export default {
  data: {
    actors: {
      edges: [
        {
          node: {
            id: '1',
            name: 'Suzy Bishop',
          },
        },
        {
          node: {
            id: '2',
            name: 'Eli Cash',
          },
        },
      ],
      pageInfo: {
        endCursor: '2',
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: '1',
      },
    },
  },
};

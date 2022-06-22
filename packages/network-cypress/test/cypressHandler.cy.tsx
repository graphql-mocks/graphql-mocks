import axios from 'axios';
import { GraphQLHandler } from 'graphql-mocks';
import { cypressHandler } from '../src';

const graphqlSchema = `
type User {
    id: ID!
    name: String
    email: String
}

type Query {
    users: [User]
    user(id: ID!): User
}
`;

const db = {
  users: [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
  ],
};

const graphqlHandler = new GraphQLHandler({
  resolverMap: {
    Query: {
      users: () => db.users,
      user: (_, { id }) => db.users.find((user) => user.id === id),
    },
  },
  dependencies: {
    graphqlSchema,
  },
});

beforeEach(() => {
  cy.intercept('POST', '/graphql', cypressHandler(graphqlHandler)).as('graphql');
});

it('should handle incoming requests', () => {
  const query = `
    query GetAllUsers {
      users {
        id
        name
        email
      }
    }
  `;

  axios.post('/graphql', { query });

  cy.wait('@graphql')
    .its('request')
    .then((request) => {
      expect(request?.body).to.deep.equal({ query });
    });

  cy.get('@graphql')
    .its('response')
    .then((response) => {
      expect(response?.body).to.deep.equal({
        data: {
          users: db.users,
        },
      });
    });
});

it('should handle incoming requests with variables', () => {
  const query = `
    query GetUserByID ($id: ID!) {
      user (id: $id) {
        id
        name
        email
      }
    }
  `;

  const variables = {
    id: '1',
  };

  axios.post('/graphql', { query, variables });

  cy.wait('@graphql')
    .its('request')
    .then((request) => {
      expect(request?.body).to.deep.equal({ query, variables });
    });

  cy.get('@graphql')
    .its('response')
    .then((response) => {
      expect(response?.body).to.deep.equal({
        data: {
          user: db.users[0],
        },
      });
    });
});

it("should return an error if request doesn't contain body", () => {
  cy.on('uncaught:exception', (error) => {
    return error.name !== 'AxiosError';
  });

  axios.post('/graphql');

  cy.wait('@graphql')
    .its('request')
    .then((request) => {
      expect(request?.body).to.deep.equal('');
    });

  cy.get('@graphql')
    .its('response')
    .then((response) => {
      expect(response?.body).to.deep.equal({
        errors: [
          {
            message: `No request body provided in the request but it's required for querying with graphql-mocks`,
          },
        ],
      });
    });
});

it("should return an error if request body doesn't contain any query", () => {
  cy.on('uncaught:exception', (error) => {
    return error.name !== 'AxiosError';
  });

  axios.post('/graphql', {});

  cy.wait('@graphql')
    .its('request')
    .then((request) => {
      expect(request?.body).to.deep.equal({});
    });

  cy.get('@graphql')
    .its('response')
    .then((response) => {
      expect(response?.body).to.deep.equal({
        errors: [
          {
            message: `No "query" provided in request body but it's required for querying with graphql-mocks`,
          },
        ],
      });
    });
});

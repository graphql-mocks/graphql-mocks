import { expect } from 'chai';
import { GraphQLHandler } from 'graphql-mocks';
import { extractDependencies } from 'graphql-mocks/resolver';
import { Paper } from '../../src/index';

const graphqlSchema = `
  schema {
    query: Query
    mutation: Mutation
  }

  type Query {
    apps: [App!]!
  }

  type Mutation {
    addApp(input: AddAppInput!): App!
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Team {
    id: ID!
    name: String!
  }

  union Owner = User | Team

  type App {
    id: ID!
    name: String!
    owner: Owner!
  }

  input AddAppInput {
    name: String!
    userId: ID
    teamId: ID
  }
`;

describe('graphql-mocks and GraphQL Paper integration', () => {
  let paper: Paper;
  let handler: GraphQLHandler;

  beforeEach(async () => {
    const generateId = () => Math.floor(Math.random() * 10000);

    paper = new Paper(graphqlSchema);

    paper.hooks.afterTransaction.push(({ getStore }) => {
      const store = getStore();
      store.App.filter((app) => !app.id).forEach((app) => (app.id = `app-id-${generateId()}`));
    });

    await paper.mutate(({ create }) => {
      const team = create('Team', {
        id: `team-id-${generateId()}`,
        name: 'Team Purple',
      });

      create('App', {
        name: 'octothorp',
        owner: team,
      });
    });

    handler = new GraphQLHandler({
      resolverMap: {
        Query: {
          apps(_, __, context) {
            const { paper } = extractDependencies<{ paper: Paper }>(context, ['paper']);
            return paper.data.App;
          },
        },
        Mutation: {
          async addApp(_, { input: { name, teamId, userId } }, context) {
            const { paper } = extractDependencies<{ paper: Paper }>(context, ['paper']);

            if (teamId && userId) {
              throw new Error('Only a teamId or userId can be passed in, not both');
            }

            let owner: unknown;
            if (teamId) {
              owner = paper.data.Team.find((team) => team.id === teamId);
              if (!owner) {
                throw new Error(`addApp mutation error: no team found with id "${teamId}"`);
              }
            }

            if (userId) {
              owner = paper.data.User.find((user) => user.id === userId);
              if (!owner) {
                throw new Error(`addApp mutation error: no user found with id "${userId}"`);
              }
            }

            return paper.mutate(({ create }) => {
              return create('App', {
                id: `app-id-${generateId()}`,
                name,
                owner,
              });
            });
          },
        },
      },
      dependencies: { paper, graphqlSchema },
    });
  });

  it('can retrieve paper data and its connections', async () => {
    const result = await handler.query(`
      query {
        apps {
          id
          name
          owner {
            ... on Team {
              id
              name
              __typename
            }

            ... on User {
              id
              name
              __typename
            }
          }
        }
      }
    `);

    expect(result.data?.apps?.[0]?.id).to.include('app-id');
    expect(result.data?.apps?.[0]?.name).to.equal('octothorp');
    expect(result.data?.apps?.[0]?.owner?.__typename).to.equal('Team');
    expect(result.data?.apps?.[0]?.owner?.id).to.include('team-id');
    expect(result.data?.apps?.[0]?.owner?.name).to.equal('Team Purple');
  });

  it('can handle mutations with paper and connections', async () => {
    const team = paper.data.Team[0];

    const result = await handler.query(
      `
      mutation ($input: AddAppInput!) {
        addApp(input: $input) {
          id
          name
          owner {
            ... on Team {
              id
              name
              __typename
            }

            ... on User {
              id
              name
              __typename
            }
          }
        }
      }
    `,
      {
        input: {
          name: 'vorfreude',
          teamId: team.id,
        },
      },
    );

    expect(result?.data?.addApp.id).to.include('app-id-');
    expect(result?.data?.addApp.name).to.equal('vorfreude');
    expect(result?.data?.addApp.owner.__typename).to.equal('Team');
    expect(result?.data?.addApp.owner.id).to.include('team-id-');
    expect(result?.data?.addApp.owner.name).to.equal('Team Purple');
  });
});

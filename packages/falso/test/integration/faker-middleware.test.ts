import { GraphQLHandler } from 'graphql-mocks';
import { falsoMiddleware } from '../../src/index';
import { expect } from 'chai';

const graphqlSchema = `
  schema {
    query: Query
  }

  type Query {
    person: Person!,
    animal: Animal!,
  }

  type Person {
    id: ID!
    name: String!
    city: String!
    pet: Animal!
  }

  type Animal {
    id: ID!
    kind: String!
  }
`;

describe('falso-middleware', () => {
  it('resolves with a graphql handler', async () => {
    const handler = new GraphQLHandler({
      resolverMap: {
        Person: {
          pets() {
            return {
              id: 'resolved static person.animal.id',
              kind: 'resolved static person.animal.kind',
            };
          },
        },

        Animal: {
          id() {
            return 'resolved static animal.id';
          },
          kind() {
            return 'resolved static animal.kind';
          },
        },
      },
      middlewares: [falsoMiddleware()],
      dependencies: {
        graphqlSchema,
      },
    });

    const result = await handler.query(`
      {
        person {
          id
          name
          city
          pet {
            id
            kind
          }
        }

        animal {
          id
          kind
        }
      }
    `);

    expect(typeof result.data?.person.id).to.equal('string');
    expect(typeof result.data?.person.name).to.equal('string');
    expect(typeof result.data?.person.city).to.equal('string');

    expect(result.data?.animal).to.deep.equal({
      id: 'resolved static animal.id',
      kind: 'resolved static animal.kind',
    });

    expect(result.data?.person.pet).to.deep.equal(
      {
        id: 'resolved static animal.id',
        kind: 'resolved static animal.kind',
      },
      'it uses static resolvers for connected types',
    );
  });
});

import { GraphQLHandler } from 'graphql-mocks';
import { falsoMiddleware } from '../../src/index';
import { expect } from 'chai';

const graphqlSchema = `
  schema {
    query: Query
  }

  type Query {
    person: Person!
    animal: Animal!
    alive: Alive!
    alives: [Alive!]!
    people: [Person!]!
  }

  type Person implements HasLegs {
    id: ID!
    name: String!
    city: String!
    pet: Animal!
    numberOfLegs: Int!
  }

  type Animal implements HasLegs {
    id: ID!
    kind: String!
    numberOfLegs: Int!
  }

  interface HasLegs {
    numberOfLegs: Int!
  }

  union Alive = Person | Animal
`;

describe('falso-middleware', () => {
  let handler: GraphQLHandler;

  beforeEach(() => {
    handler = new GraphQLHandler({
      resolverMap: {
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
  });

  it('resolves with a graphql handler', async () => {
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

  it('resolves with abstract types', async () => {
    const result = await handler.query(`
      {
        person {
          numberOfLegs
        }

        people {
          numberOfLegs
          pet {
            numberOfLegs
          }
        }


        animal {
          numberOfLegs
        }

        alive {
          __typename

          ... on Person {
            name
            city
            numberOfLegs
          }

          ... on Animal {
            kind
            numberOfLegs
          }
        }

        alives {
          __typename

          ... on Person {
            name
            city
            numberOfLegs
          }

          ... on Animal {
            kind
            numberOfLegs
          }
        }
      }
    `);

    expect(typeof result.data.person.numberOfLegs).to.equal('number');
    expect(typeof result.data.animal.numberOfLegs).to.equal('number');
    expect(typeof result.data.people[0].numberOfLegs).to.equal('number');
    expect(typeof result.data.people[0].pet.numberOfLegs).to.equal('number');

    const typenames = ['Person', 'Animal'];
    const [personTypeName, animalTypeName] = typenames;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const testAliveType = (alive: Record<string, any>) => {
      expect(alive.__typename).to.be.oneOf(typenames);

      if (alive.__typename === personTypeName) {
        expect(alive.name).to.exist;
        expect(alive.city).to.exist;
        expect(alive.numberOfLegs).to.exist;
      }

      if (alive.__typename === animalTypeName) {
        expect(alive.kind).to.exist;
        expect(alive.numberOfLegs).to.exist;
      }
    };

    testAliveType(result.data.alive);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result.data.alives.forEach((alive: Record<string, any>) => testAliveType(alive));
  });
});

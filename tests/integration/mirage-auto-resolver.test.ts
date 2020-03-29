import { expect } from 'chai';
import { buildSchema } from 'graphql';
import defaultResolvers from './mirage-static-resolvers';
import { patchWithAutoTypesWrapper } from '../../src/mirage/wrappers/patch-auto-types';
import { patchAutoUnionsInterfaces } from '../../src/mirage/wrappers/patch-auto-unions-interfaces';
import { server as mirageServer } from './mirage-sample';
import defaultScenario from './mirage-sample/scenarios/default';
import { buildHandler, typeDefs } from './executable-schema';
import { pack } from '../../src/resolver-map/pack';

const schema = buildSchema(typeDefs);

const wrappers = [patchWithAutoTypesWrapper(schema), patchAutoUnionsInterfaces(schema)];

describe('auto resolving from mirage', function() {
  let resolvers: any;
  let graphQLHandler: any;

  this.beforeEach(() => {
    mirageServer.db.loadData(defaultScenario);
    const packed = pack(defaultResolvers, wrappers, {
      dependencies: {
        mirageServer,
        graphqlMirageMappings: [
          {
            mirage: { modelName: 'Person', attrName: 'friends' },
            graphql: { typeName: 'Person', fieldName: 'paginatedFriends' },
          },
          {
            mirage: { modelName: 'Person', attrName: 'friends' },
            graphql: { typeName: 'Query', fieldName: 'allPersonsPaginated' },
          },
        ],
      },
    });
    resolvers = packed.resolvers;
    graphQLHandler = buildHandler(resolvers);
  });

  this.afterEach(() => {
    mirageServer.db.emptyData();
    resolvers = undefined;
    graphQLHandler = undefined;
  });

  it('has missing resolvers that are filled by #patchWithAutoResolvers', function() {
    expect(defaultResolvers.Post).to.equal(undefined);
    expect(resolvers.Post).to.not.equal(undefined);

    expect(defaultResolvers.Comment).to.equal(undefined);
    expect(resolvers.Comment).to.not.equal(undefined);
  });

  it('can handle a simple auto look up', async function() {
    const query = `query {
      person(id: 1) {
        id
        name
        posts {
          body
        }
      }
    }`;

    const result = await graphQLHandler(query);
    expect(result).to.deep.equal({
      data: {
        person: {
          id: '1',
          name: 'Fred Flinstone',
          posts: [
            {
              body:
                "They're the modern stone age family. From the town of Bedrock. They're a page right out of history",
            },
          ],
        },
      },
    });
  });

  // Person
  //   has Posts
  //     (author should match the Person)
  //     has Comments
  //       (comment author could be different than the Person who wrote the post)
  //
  // the resolver should be able to handle lookups for a Person whether the parent
  // is an author of a post or an author of a nested comment

  it('can handle a first generation parent type (person in posts.author)', async function() {
    const query = `query {
      person(id: 1) {
        id
        name
        posts {
          author {
            id
            name
          }
        }
      }
    }`;

    const result = await graphQLHandler(query);

    expect(result.data!.person.id).to.equal(result.data!.person.posts[0].author.id);
    expect(result.data!.person.name).to.equal(result.data!.person.posts[0].author.name);
  });

  it('can handle a second generation parent type (person in posts.comments.author)', async function() {
    const query = `query {
      person(id: 1) {
        id
        name
        posts {
          comments {
            body
            author {
              name
            }
          }
        }
      }
    }`;

    const result = await graphQLHandler(query);
    expect(result.data!.person.posts[0].comments[0].body).to.equal('I love the town of Bedrock!');
    expect(result.data!.person.posts[0].comments[0].author.name).to.equal('Barney Rubble');
  });

  it('can resolve a union type', async function() {
    const query = `query {
      allPersons {
        id
        name

        transportation {
          __typename

          ... on Bike {
            brand
          }

          ... on Car {
            make
            model
          }

          ... on PublicTransit {
            primary
          }
        }
      }
    }`;

    const result = await graphQLHandler(query);
    const [firstPerson, secondPerson] = result.data!.allPersons;

    expect(firstPerson.name).to.equal('Fred Flinstone');
    expect(firstPerson.transportation.__typename).to.equal('Bike');
    expect(firstPerson.transportation.brand).to.equal('Bianchi');

    expect(secondPerson.name).to.equal('Barney Rubble');
    expect(secondPerson.transportation.__typename).to.equal('PublicTransit');
    expect(secondPerson.transportation.primary).to.equal('Subway');
  });

  it('can resolve an interface type', async function() {
    const query = `query {
      allPersons {
        id
        name

        hobbies {
          __typename

          name
          requiresEquipment

          ... on SportsHobby {
            hasMultiplePlayers
          }

          ... on CulinaryHobby {
            requiresOven
            requiresStove
          }

          ... on MakerHobby {
            makerType
          }
        }
      }
    }`;

    const result = await graphQLHandler(query);
    const [firstPerson, secondPerson] = result.data!.allPersons;

    expect(firstPerson.name).to.equal('Fred Flinstone');
    expect(firstPerson.hobbies).to.deep.equal([
      {
        __typename: 'CulinaryHobby',
        name: 'Cooking',
        requiresEquipment: true,
        requiresOven: false,
        requiresStove: true,
      },
      {
        __typename: 'CulinaryHobby',
        name: 'Baking',
        requiresEquipment: true,
        requiresOven: true,
        requiresStove: false,
      },
      {
        __typename: 'SportsHobby',
        hasMultiplePlayers: false,
        name: 'Running',
        requiresEquipment: false,
      },
    ]);

    expect(secondPerson.name).to.equal('Barney Rubble');
    expect(secondPerson.hobbies).to.deep.equal([
      {
        __typename: 'MakerHobby',
        makerType: 'Textile',
        name: 'Knitting',
        requiresEquipment: true,
      },
      {
        __typename: 'SportsHobby',
        hasMultiplePlayers: true,
        name: 'Soccer',
        requiresEquipment: true,
      },
    ]);
  });

  it('can resolve an enum type', async function() {
    const query = `query {
      allPersons {
        id
        name
        favoriteColor
      }
    }`;

    const result = await graphQLHandler(query);
    const [firstPerson, secondPerson] = result.data!.allPersons;

    expect(firstPerson.name).to.equal('Fred Flinstone');
    expect(firstPerson.favoriteColor).to.equal('Yellow');

    expect(secondPerson.name).to.equal('Barney Rubble');
    expect(secondPerson.favoriteColor).to.equal('Green');
  });

  it('can resolve a list type', async function() {
    const query = `query {
      allPersons {
        name
        hobbies {
          name
        }
      }
    }`;

    const result = await graphQLHandler(query);
    const [firstPerson, secondPerson] = result.data!.allPersons;

    expect(firstPerson.name).to.equal('Fred Flinstone');
    expect(firstPerson.hobbies).to.deep.equal([
      {
        name: 'Cooking',
      },
      {
        name: 'Baking',
      },
      {
        name: 'Running',
      },
    ]);

    expect(secondPerson.name).to.equal('Barney Rubble');
    expect(secondPerson.hobbies).to.deep.equal([
      {
        name: 'Knitting',
      },
      {
        name: 'Soccer',
      },
    ]);
  });

  describe('Relay Connections', () => {
    it('can resolve a root-level relay connection', async () => {
      const query = `query {
        allPersonsPaginated(first: 2) {
          edges {
            cursor
            node {
              id
              name
            }
          }
          pageInfo {
            endCursor
            hasNextPage
            hasPreviousPage
            startCursor
          }
        }
      }`;

      const result = await graphQLHandler(query);
      debugger;
      const edges = result.data.allPersonsPaginated.edges;
      const pageInfo = result.data.allPersonsPaginated.pageInfo;
      const firstPersonEdge = edges[0];
      const secondPersonEdge = edges[1];

      expect(firstPersonEdge.cursor).to.equal('model:person(1)');
      expect(firstPersonEdge.node.id).to.equal('1');
      expect(firstPersonEdge.node.name).to.equal('Fred Flinstone');

      expect(secondPersonEdge.cursor).to.equal('model:person(2)');
      expect(secondPersonEdge.node.id).to.equal('2');
      expect(secondPersonEdge.node.name).to.equal('Barney Rubble');

      expect(pageInfo).to.deep.equal({
        endCursor: 'model:person(2)',
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: 'model:person(1)',
      });
    });

    it('can resolve a type relay connection', async () => {
      const query = `query {
        allPersons {
          id
          name
          paginatedFriends(first: 1) {
            edges {
              cursor
              node {
                name
              }
            }
            pageInfo {
              startCursor
              endCursor
              hasPreviousPage
              hasNextPage
            }
          }
        }
      }`;

      const result = await graphQLHandler(query);
      const firstPerson = result.data.allPersons[0];

      expect(firstPerson.name).to.equal('Fred Flinstone');
      expect(firstPerson.id).to.equal('1');
      expect(firstPerson.paginatedFriends.edges.length).to.equal(1);
      expect(firstPerson.paginatedFriends.edges[0].cursor).to.equal('model:person(2)');
      expect(firstPerson.paginatedFriends.edges[0].node.name).to.equal('Barney Rubble');
      expect(firstPerson.paginatedFriends.pageInfo).to.deep.equal({
        endCursor: 'model:person(2)',
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: 'model:person(2)',
      });
    });
  });
});

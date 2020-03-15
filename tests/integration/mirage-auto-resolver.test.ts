import { expect } from 'chai';
import { buildSchema } from 'graphql';
import defaultResolvers from './mirage-static-resolvers';
import { patchWithAutoResolvers } from '../../src/mirage/wrappers/patch-with-auto';
import { server as mirageServer } from './mirage-sample';
import defaultScenario from './mirage-sample/scenarios/default';
import { buildHandler, typeDefs } from './executable-schema';
import { addMirageToContext } from '../../src/mirage/wrappers/add-context';
import { pack } from '../../src/resolver-map/pack';

const schema = buildSchema(typeDefs);

const wrappers = [addMirageToContext(mirageServer), patchWithAutoResolvers(schema)];

const { resolvers } = pack(defaultResolvers, wrappers);

const graphQLHandler = buildHandler(resolvers);

describe('auto resolving from mirage', function() {
  this.beforeEach(() => {
    mirageServer.db.loadData(defaultScenario);
  });

  this.afterEach(() => {
    mirageServer.db.emptyData();
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
});

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { expect } from 'chai';
import defaultResolvers from './test-helpers/mirage-static-resolvers';
import { mirageMiddleware } from '../../src';
import { server as mirageServer } from './test-helpers/mirage-sample';
import defaultScenario from './test-helpers/mirage-sample/fixtures';
import { graphqlSchema } from './test-helpers/test-schema';
import { GraphQLHandler } from 'graphql-mocks';

describe('integration/mirage-auto-resolver', function () {
  let graphQLHandler: GraphQLHandler;

  beforeEach(async function () {
    mirageServer.db.loadData(defaultScenario);

    graphQLHandler = new GraphQLHandler({
      resolverMap: defaultResolvers,
      middlewares: [mirageMiddleware()],
      dependencies: {
        mirageServer,
        graphqlSchema: graphqlSchema,
      },
    });
  });

  afterEach(function () {
    mirageServer.db.emptyData();
    (graphQLHandler as unknown) = undefined;
  });

  it('can handle a type look up', async function () {
    const query = `query {
      person(id: 1) {
        id
        name
        posts {
          body
        }
      }
    }`;

    const result = await graphQLHandler.query(query);
    expect(result).to.deep.equal({
      data: {
        person: {
          id: '1',
          name: 'Fred Flinstone',
          posts: [
            {
              body: "They're the modern stone age family. From the town of Bedrock. They're a page right out of history",
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

  it('can handle a first generation parent type (person in posts.author)', async function () {
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

    const result = await graphQLHandler.query(query);

    expect(result.data!.person.id).to.equal(result.data!.person.posts[0].author.id);
    expect(result.data!.person.name).to.equal(result.data!.person.posts[0].author.name);
  });

  it('can handle a second generation parent type (person in posts.comments.author)', async function () {
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

    const result = await graphQLHandler.query(query);
    expect(result.data!.person.posts[0].comments[0].body).to.equal('I love the town of Bedrock!');
    expect(result.data!.person.posts[0].comments[0].author.name).to.equal('Barney Rubble');
  });

  it('can resolve a union type', async function () {
    const query = `query {
      allPersons {
        id
        name

        transportation {
          __typename

          ... on Bicycle {
            brand
          }

          ... on Automobile {
            make
            model
          }

          ... on PublicTransit {
            primary
          }
        }
      }
    }`;

    const result = await graphQLHandler.query(query);
    const [fred, barnie, wilma] = result.data!.allPersons;

    expect(fred.name).to.equal('Fred Flinstone');
    expect(fred.transportation.__typename).to.equal('Bicycle');
    expect(fred.transportation.brand).to.equal('Bianchi');

    expect(barnie.name).to.equal('Barney Rubble');
    expect(barnie.transportation.__typename).to.equal('PublicTransit');
    expect(barnie.transportation.primary).to.equal('Subway');

    expect(wilma.name).to.equal('Wilma Flinstone');
    expect(wilma.transportation.__typename).to.equal('Automobile');
    expect(wilma.transportation.make).to.equal('Volkwagen');
    expect(wilma.transportation.model).to.equal('Golf');
  });

  it('can resolve an interface type', async function () {
    // This test handles a few different auto-resolving cases.
    // Case #1. parent mirage model name, looked up as GraphQL Type
    // Case #2. Looking at all types that use the interface and find a type
    // that shares the most common fields

    // Case #1 pre-checks
    expect(graphqlSchema.getType('SportsHobby')).to.equal(undefined, 'SportsHobby does not exist on schema');
    expect(mirageServer.schema.all('SportsHobby').length).to.be.greaterThan(
      0,
      'SportsHobby does exist as model on mirage',
    );
    expect(graphqlSchema.getType('AthleticHobby')).to.not.equal(undefined, 'AthleticHobby does exist on the schema');
    expect(() => mirageServer.schema.all('AthleticHobby')).to.throw(
      `Mirage: You're trying to find model(s) of type AthleticHobby but this collection doesn't exist in the database`,
      'AthleticHobby does exist as a mirage model',
    );

    // Case #3 pre-checks
    expect(graphqlSchema.getType('CulinaryHobby')).to.equal(undefined, 'CulinaryHobby does not exist on schema');
    expect(mirageServer.schema.all('CulinaryHobby').length).to.be.greaterThan(
      0,
      'CulinaryHobby does exist as model on mirage',
    );
    expect(graphqlSchema.getType('CookingHobby')).to.not.equal(undefined, 'CookingHobby does exist on the schema');
    expect(() => mirageServer.schema.all('CookingHobby')).to.throw(
      `Mirage: You're trying to find model(s) of type CookingHobby but this collection doesn't exist in the database`,
      'CookingHobby does exist as a mirage model',
    );

    const query = `query {
      allPersons {
        id
        name

        hobbies {
          __typename

          name
          requiresEquipment

          ... on AthleticHobby {
            hasMultiplePlayers
          }

          ... on CookingHobby {
            requiresOven
            requiresStove
          }

          ... on MakerHobby {
            makerType
          }
        }
      }
    }`;

    const result = await graphQLHandler.query(query);
    const [firstPerson, secondPerson] = result.data!.allPersons;

    expect(firstPerson.name).to.equal('Fred Flinstone');
    expect(firstPerson.hobbies).to.deep.equal([
      {
        __typename: 'CookingHobby',
        name: 'Cooking',
        requiresEquipment: true,
        requiresOven: false,
        requiresStove: true,
      },
      {
        __typename: 'CookingHobby',
        name: 'Baking',
        requiresEquipment: true,
        requiresOven: true,
        requiresStove: false,
      },
      {
        __typename: 'AthleticHobby',
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
        __typename: 'AthleticHobby',
        hasMultiplePlayers: true,
        name: 'Soccer',
        requiresEquipment: true,
      },
    ]);
  });

  it('can resolve an enum type', async function () {
    const query = `query {
      allPersons {
        id
        name
        favoriteColor
      }
    }`;

    const result = await graphQLHandler.query(query);
    const [firstPerson, secondPerson] = result.data!.allPersons;

    expect(firstPerson.name).to.equal('Fred Flinstone');
    expect(firstPerson.favoriteColor).to.equal('Yellow');

    expect(secondPerson.name).to.equal('Barney Rubble');
    expect(secondPerson.favoriteColor).to.equal('Green');
  });

  it('can resolve a list type', async function () {
    const query = `query {
      allPersons {
        name
        hobbies {
          name
        }
      }
    }`;

    const result = await graphQLHandler.query(query);
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

  it('can resolve non-null types', async function () {
    const query = `query {
      allPersons {
        name
        favoriteColor
      }
    }`;

    const result = await graphQLHandler.query(query);
    const [fred, barney, wilma] = result.data!.allPersons;

    expect(fred).to.deep.equal({
      name: 'Fred Flinstone',
      favoriteColor: 'Yellow',
    });
    expect(barney).to.deep.equal({
      name: 'Barney Rubble',
      favoriteColor: 'Green',
    });
    expect(wilma).to.deep.equal({
      name: 'Wilma Flinstone',
      favoriteColor: 'Red',
    });
  });

  it('can resolve null types', async function () {
    const query = `query {
      allPersons {
        name
        leastFavoriteColor
      }
    }`;

    const result = await graphQLHandler.query(query);
    const [fred, barney, wilma] = result.data!.allPersons;

    expect(fred).to.deep.equal({
      name: 'Fred Flinstone',
      leastFavoriteColor: 'Blue',
    });
    expect(barney).to.deep.equal({
      name: 'Barney Rubble',
      leastFavoriteColor: null,
    });
    expect(wilma).to.deep.equal({
      name: 'Wilma Flinstone',
      leastFavoriteColor: null,
    });
  });

  context('Middleware Options', function () {
    const allPersonsQuery = `
      {
        allPersons {
          name
        }
      }
    `;

    context('with Query.allPersons included', function () {
      beforeEach(async function () {
        graphQLHandler = new GraphQLHandler({
          middlewares: [
            mirageMiddleware({
              highlight: [['Query', 'allPersons']],
            }),
          ],
          dependencies: {
            mirageServer,
            graphqlSchema: graphqlSchema,
          },
        });
      });

      it('can query on the auto-resolvers patched in by in the `highlight` option', async function () {
        expect(await graphQLHandler.query(allPersonsQuery)).to.deep.equal({
          data: {
            allPersons: [
              {
                name: 'Fred Flinstone',
              },
              {
                name: 'Barney Rubble',
              },
              {
                name: 'Wilma Flinstone',
              },
              {
                name: 'Betty Rubble',
              },
            ],
          },
        });
      });
    });

    context('with Query.allPersons excluded', function () {
      beforeEach(async function () {
        graphQLHandler = new GraphQLHandler({
          middlewares: [
            mirageMiddleware({
              highlight: (h) => h.exclude(['Query', 'allPersons']),
            }),
          ],
          dependencies: {
            mirageServer,
            graphqlSchema: graphqlSchema,
          },
        });
      });

      it('can not query on excluded auto-resolvers ', async function () {
        expect((await graphQLHandler.query(allPersonsQuery))?.errors?.[0]?.message).to.include(
          'Cannot return null for non-nullable field Query.allPersons',
        );
      });
    });
  });
});

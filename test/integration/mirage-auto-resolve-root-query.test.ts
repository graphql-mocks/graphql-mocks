/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Model, Server } from 'miragejs';
import { expect } from 'chai';
import { patchAutoFieldResolvers } from '../../src/mirage/middleware/patch-auto-field-resolvers';
import { createGraphQLHandler } from '../../src/graphql';
import { MirageGraphQLMapper } from '../../src/mirage/mapper';

// patchAutoFieldResolvers middleware covers both auto-resolving of
// root queries and graphql object types. This test focuses on the
// feature of auto-resolving fields on graphql root query type and its
// fields, provided by patchAutoFieldResolvers
describe('integration/mirage-auto-resolve-root-query', function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mirageServer: Server;

  beforeEach(() => {
    mirageServer = new Server({
      models: {
        person: Model.extend({}),
      },
    });
  });

  afterEach(() => {
    (mirageServer as any) = null;
  });

  describe('scalar types', () => {
    it('can return a scalar using a filter field', async function () {
      const mirageMapper = new MirageGraphQLMapper().addFieldFilter(['Query', 'personName'], () => 'Grace Hopper');

      const handler = await createGraphQLHandler(
        {},
        {
          middlewares: [patchAutoFieldResolvers()],
          dependencies: {
            mirageMapper,
            mirageServer,
            graphqlSchema: `
            schema {
              query: Query
            }

            type Query {
              # a list of persons
              personName: String!
            }`,
          },
        },
      );

      const result = await handler.query(`{
        personName
      }`);

      expect(result.data).to.deep.equal({ personName: 'Grace Hopper' });
    });

    it('can return a list of scalars using a filter field', async function () {
      const mirageMapper = new MirageGraphQLMapper().addFieldFilter(['Query', 'personNames'], () => [
        'Grace Hopper',
        'Anita Borg',
      ]);

      const handler = await createGraphQLHandler(
        {},
        {
          middlewares: [patchAutoFieldResolvers()],
          dependencies: {
            mirageMapper,
            mirageServer,
            graphqlSchema: `
            schema {
              query: Query
            }

            type Query {
              # a list of persons
              personNames: [String!]!
            }`,
          },
        },
      );

      const result = await handler.query(`{
        personNames
      }`);

      expect(result.data).to.deep.equal({ personNames: ['Grace Hopper', 'Anita Borg'] });
    });

    it('throws an error when a field filter is not provided', async function () {
      const handler = await createGraphQLHandler(
        {},
        {
          middlewares: [patchAutoFieldResolvers()],
          dependencies: {
            mirageServer,
            graphqlSchema: `
            schema {
              query: Query
            }

            type Query {
              # a list of persons
              personName: String
            }`,
          },
        },
      );

      const result = await handler.query(`{
        personName
      }`);

      expect(result.errors?.length).to.equal(1);
      expect(result.errors?.[0]?.message).to.deep.equal(
        'Scalars cannot be auto-resolved with mirage from the root query type. Query.personName resolves to a scalar, or a list, of type String. Try adding a field filter for this field and returning a value for this field.',
      );
    });
  });

  // plural case
  describe('list type of object types', () => {
    beforeEach(() => {
      mirageServer.schema.create<any, any, any>('person', {
        name: 'wilma',
      });

      mirageServer.schema.create<any, any, any>('person', {
        name: 'betty',
      });

      mirageServer.schema.create<any, any, any>('person', {
        name: 'fred',
      });

      mirageServer.schema.create<any, any, any>('person', {
        name: 'barney',
      });
    });

    const graphqlSchema = `
      schema {
        query: Query
      }

      type Query {
        # a list of persons
        allPeople: [Person!]
      }

      type Person {
        name: String!
      }
    `;

    it('by default returns an array of all models', async function () {
      const handler = await createGraphQLHandler(
        {},
        {
          middlewares: [patchAutoFieldResolvers()],
          dependencies: {
            mirageServer,
            graphqlSchema,
          },
        },
      );

      const result = await handler.query(`{
      allPeople {
        name
      }
    }`);

      expect(result).to.deep.equal({
        data: {
          allPeople: [{ name: 'wilma' }, { name: 'betty' }, { name: 'fred' }, { name: 'barney' }],
        },
      });
    });

    it('uses mirage models from a mapper field filter', async function () {
      const mirageMapper = new MirageGraphQLMapper().addFieldFilter(['Query', 'allPeople'], (models) => {
        return models.filter((model: any) => ['wilma', 'fred'].includes(model.name));
      });

      const handler = await createGraphQLHandler(
        {},
        {
          middlewares: [patchAutoFieldResolvers()],
          dependencies: {
            mirageServer,
            mirageMapper,
            graphqlSchema,
          },
        },
      );

      const result = await handler.query(`{
        allPeople {
          name
        }
      }`);

      expect(result).to.deep.equal({
        data: {
          allPeople: [{ name: 'wilma' }, { name: 'fred' }],
        },
      });
    });

    it('uses pojos from a mapper field filter', async function () {
      const mirageMapper = new MirageGraphQLMapper().addFieldFilter(['Query', 'allPeople'], () => {
        return [{ name: 'Ada Lovelace' }, { name: 'Grace Hopper' }];
      });

      const handler = await createGraphQLHandler(
        {},
        {
          middlewares: [patchAutoFieldResolvers()],
          dependencies: {
            mirageServer,
            mirageMapper,
            graphqlSchema,
          },
        },
      );

      const result = await handler.query(`{
        allPeople {
          name
        }
      }`);

      expect(result).to.deep.equal({
        data: {
          allPeople: [{ name: 'Ada Lovelace' }, { name: 'Grace Hopper' }],
        },
      });
    });

    it('uses null from a mapper field filter', async function () {
      const mirageMapper = new MirageGraphQLMapper().addFieldFilter(['Query', 'allPeople'], () => {
        return null;
      });

      const handler = await createGraphQLHandler(
        {},
        {
          middlewares: [patchAutoFieldResolvers()],
          dependencies: {
            mirageServer,
            mirageMapper,
            graphqlSchema,
          },
        },
      );

      const result = await handler.query(`{
        allPeople {
          name
        }
      }`);

      expect(result).to.deep.equal({
        data: {
          allPeople: null,
        },
      });
    });
  });

  // singular case
  describe('singular object type', () => {
    const graphqlSchema = `
      schema {
        query: Query
      }

      type Query {
        # singular person
        person: Person
      }

      type Person {
        name: String!
      }
    `;

    it('returns the only model when one exists', async function () {
      mirageServer.schema.create<any, any, any>('person', {
        name: 'fred',
      });

      const handler = await createGraphQLHandler(
        {},
        {
          middlewares: [patchAutoFieldResolvers()],
          dependencies: {
            mirageServer,
            graphqlSchema,
          },
        },
      );

      const result = await handler.query(`{
          person {
            name
          }
        }`);

      expect(result).to.deep.equal({
        data: {
          person: { name: 'fred' },
        },
      });
    });

    it('returns null when there are no models', async function () {
      const handler = await createGraphQLHandler(
        {},
        {
          middlewares: [patchAutoFieldResolvers()],
          dependencies: {
            mirageServer,
            graphqlSchema,
          },
        },
      );

      const result = await handler.query(`{
          person {
            name
          }
        }`);

      expect(result).to.deep.equal({
        data: {
          person: null,
        },
      });
    });

    it('returns null from field filter', async function () {
      const mirageMapper = new MirageGraphQLMapper().addFieldFilter(['Query', 'person'], () => null);

      const handler = await createGraphQLHandler(
        {},
        {
          middlewares: [patchAutoFieldResolvers()],
          dependencies: {
            mirageMapper,
            mirageServer,
            graphqlSchema,
          },
        },
      );

      const result = await handler.query(`{
          person {
            name
          }
        }`);

      expect(result).to.deep.equal({
        data: {
          person: null,
        },
      });
    });

    it('returns pojo from field filter', async function () {
      const mirageMapper = new MirageGraphQLMapper().addFieldFilter(['Query', 'person'], () => ({
        name: 'Grace Hopper',
      }));

      const handler = await createGraphQLHandler(
        {},
        {
          middlewares: [patchAutoFieldResolvers()],
          dependencies: {
            mirageMapper,
            mirageServer,
            graphqlSchema,
          },
        },
      );

      const result = await handler.query(`{
          person {
            name
          }
        }`);

      expect(result).to.deep.equal({
        data: {
          person: { name: 'Grace Hopper' },
        },
      });
    });

    describe('when multiple models exist', () => {
      beforeEach(() => {
        mirageServer = new Server({
          models: {
            person: Model.extend({}),
          },
        });

        mirageServer.schema.create<any, any, any>('person', {
          name: 'wilma',
        });

        mirageServer.schema.create<any, any, any>('person', {
          name: 'betty',
        });
      });

      it('when no field filter exists it throws an error', async function () {
        const handler = await createGraphQLHandler(
          {},
          {
            middlewares: [patchAutoFieldResolvers()],
            dependencies: {
              mirageServer,
              graphqlSchema,
            },
          },
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result: any = await handler.query(`{
          person {
            name
          }
        }`);

        expect(result.data?.person).to.equal(null);
        expect(result.errors?.length).to.equal(1);
        expect(result.errors[0].message).to.contain(
          'Tried to a coerce singular result but got an array of more than one result.',
        );
      });

      describe('when a field filter exists', () => {
        it('uses singular result from field filter', async function () {
          const mirageMapper = new MirageGraphQLMapper().addFieldFilter(['Query', 'person'], (models) => {
            return models[0];
          });

          const handler = await createGraphQLHandler(
            {},
            {
              middlewares: [patchAutoFieldResolvers()],
              dependencies: {
                mirageServer,
                graphqlSchema,
                mirageMapper,
              },
            },
          );

          const result = await handler.query(`{
            person {
              name
            }
          }`);

          expect(result).to.deep.equal({
            data: {
              person: {
                name: 'wilma',
              },
            },
          });
        });

        it('throws an error when field filter returns more than one result', async function () {
          const mirageMapper = new MirageGraphQLMapper().addFieldFilter(['Query', 'person'], (models) => {
            return models;
          });

          const handler = await createGraphQLHandler(
            {},
            {
              middlewares: [patchAutoFieldResolvers()],
              dependencies: {
                mirageServer,
                graphqlSchema,
                mirageMapper,
              },
            },
          );

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const result: any = await handler.query(`{
            person {
              name
            }
          }`);

          expect(result.data?.person).to.equal(null);
          expect(result.errors?.length).to.equal(1);

          // this error message is slightly different than for no field filter
          // as it calls out that the field filter is returning multiple results
          // when only one is expected
          expect(result.errors[0].message).to.contain(
            'Tried to a coerce singular result but got an array of more than one result.',
          );
        });
      });
    });
  });
});

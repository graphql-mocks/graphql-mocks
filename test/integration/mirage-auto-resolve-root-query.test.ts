/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Model, Server } from 'miragejs';
import { expect } from 'chai';
import { mirageMiddleware } from '../../src/mirage';
import { GraphQLHandler } from '../../src/graphql';

describe('integration/mirage-auto-resolve-root-query', function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mirageServer: Server;

  beforeEach(function () {
    mirageServer = new Server({
      models: {
        person: Model.extend({}),
      },
    });
  });

  afterEach(function () {
    (mirageServer as any) = null;
  });

  // plural case
  describe('list type of object types', function () {
    beforeEach(function () {
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
      const handler = new GraphQLHandler({
        middlewares: [mirageMiddleware()],
        dependencies: {
          mirageServer,
          graphqlSchema,
        },
      });

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
  });

  // singular case
  describe('singular object type', function () {
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

      const handler = new GraphQLHandler({
        middlewares: [mirageMiddleware()],
        dependencies: {
          mirageServer,
          graphqlSchema,
        },
      });

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
      const handler = new GraphQLHandler({
        middlewares: [mirageMiddleware()],
        dependencies: {
          mirageServer,
          graphqlSchema,
        },
      });

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

    describe('when multiple models exist', function () {
      beforeEach(function () {
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
        const handler = new GraphQLHandler({
          middlewares: [mirageMiddleware()],
          dependencies: {
            mirageServer,
            graphqlSchema,
          },
        });

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
    });
  });
});

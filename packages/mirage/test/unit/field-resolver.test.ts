import { mirageFieldResolver } from '../../src';
import {
  GraphQLSchema,
  buildSchema,
  GraphQLNonNull,
  GraphQLString,
  GraphQLResolveInfo,
  GraphQLObjectType,
} from 'graphql';
import { expect } from 'chai';
import { Model, Server, belongsTo, ModelInstance, hasMany, Registry } from 'miragejs';
import { generatePackOptions } from '../test-helpers';

describe('mirage/field-resolver', function () {
  let mirageServer: Server;
  let schema: GraphQLSchema;

  beforeEach(function () {
    mirageServer = new Server({
      models: {
        user: Model.extend({
          favoriteMovie: belongsTo('movie'),
        }),
        movie: Model.extend({}),
      },
    });

    schema = buildSchema(`
      type User {
        name: String!
        favoriteFood: String!
        favoriteMovie: Movie!
      }

      type Movie {
        name: String!
      }
    `);
  });

  it('resolves a simple scalar field from a parent', async function () {
    const user = mirageServer.create('user', {
      id: '1',
      name: 'George',
    });

    const context = {
      pack: generatePackOptions({ dependencies: { mirageServer, graphqlSchema: schema } }),
    };

    const info = {
      parentType: schema?.getType('User'),
      fieldName: 'name',
      returnType: new GraphQLNonNull(GraphQLString),
    };

    const result = mirageFieldResolver(user, {}, context, info as GraphQLResolveInfo);
    expect(result).to.equal('George');
  });

  it('resolves a mirage relationship field from a parent', async function () {
    const starwars = mirageServer.create('movie', { id: '1', name: 'Star Wars: A New Hope' });
    const user = mirageServer.create('user', {
      id: '1',
      name: 'George',
      favoriteMovie: starwars,
    });

    const context = {
      pack: generatePackOptions({ mirageServer, dependencies: { mirageServer, graphqlSchema: schema } }),
    };

    const info = {
      parentType: schema?.getType('User'),
      fieldName: 'favoriteMovie',
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      returnType: new GraphQLNonNull(schema.getType('Movie')!),
    };

    const result = mirageFieldResolver(user, {}, context, info as GraphQLResolveInfo);
    expect(result.name).to.equal('Star Wars: A New Hope');
  });

  context('relay', function () {
    let graphqlSchema: GraphQLSchema;
    let graphqlTypes: {
      Query: GraphQLObjectType;
      SpellConnection: GraphQLObjectType;
      Sourcerer: GraphQLObjectType;
    };

    let mirageServer: Server;
    let resolverContext: Record<string, unknown>;
    let sourcererParent: ModelInstance;
    let abraSpell: ModelInstance;
    let meowSpell: ModelInstance;
    let imperioSpell: ModelInstance;
    let abertoSpell: ModelInstance;
    let morsmordreSpell: ModelInstance;
    let allSpells: ModelInstance[];

    beforeEach(function () {
      graphqlSchema = buildSchema(`
      schema {
        query: Query
      }

      type Query {
        allSpells: SpellConnection!
      }

      type Sourcerer {
        spells(first: Int, last: Int, before: String, after: String): SpellConnection!
      }

      type Spell {
        id: ID!
        incantation: String!
        isEvil: Boolean!
      }

      type SpellConnection {
        edges: [SpellEdge!]!
        pageInfo: SpellPageInfo!
      }

      type SpellEdge {
        cursor: String!
        node: Spell!
      }

      type SpellPageInfo {
        startCursor: String!
        endCursor: String!
        hasNextPage: Boolean!
        hasPreviousPage: Boolean!
      }
    `);

      graphqlTypes = {
        Query: graphqlSchema.getType('Query') as GraphQLObjectType,
        SpellConnection: graphqlSchema.getType('SpellConnection') as GraphQLObjectType,
        Sourcerer: graphqlSchema.getType('Sourcerer') as GraphQLObjectType,
      };

      const Sourcerer = Model.extend({
        spells: hasMany('spell'),
      });
      const Spell = Model.extend({});

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type MyRegistry = Registry<{ spell: typeof Model; sourcerer: typeof Sourcerer }, any>;

      mirageServer = new Server<MyRegistry>({
        models: {
          sourcerer: Sourcerer,
          spell: Spell,
        },
      });

      meowSpell = mirageServer.schema.create('spell', {
        id: '1',
        incantation: 'meow meow',
        isEvil: false,
      });

      abraSpell = mirageServer.schema.create('spell', {
        id: '2',
        incantation: 'abra cadabra',
        isEvil: false,
      });

      imperioSpell = mirageServer.schema.create('spell', {
        id: '3',
        incantation: 'imperio',
        isEvil: true,
      });

      abertoSpell = mirageServer.schema.create('spell', {
        id: '4',
        incantation: 'aberto',
        isEvil: false,
      });

      morsmordreSpell = mirageServer.schema.create('spell', {
        id: '5',
        incantation: 'morsmordre',
        isEvil: true,
      });

      allSpells = [meowSpell, abraSpell, imperioSpell, abertoSpell, morsmordreSpell];

      mirageServer.schema.create('spell', {
        id: '5',
        incantation: 'morsmordre',
        isEvil: true,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sourcererParent = mirageServer.schema.create<any, any, any>('sourcerer', {
        spells: allSpells,
      });

      resolverContext = {
        pack: {
          dependencies: {
            mirageServer,
            graphqlSchema,
          },
        },
      };
    });

    it('resolves relay connections', async function () {
      const args = {
        first: 2,
      };

      const result = await mirageFieldResolver(sourcererParent, args, resolverContext, {
        fieldName: 'spells',
        returnType: graphqlTypes.SpellConnection,
        parentType: graphqlTypes.Sourcerer,
      } as GraphQLResolveInfo);

      expect(result.edges[0].node).to.deep.equal(meowSpell);
      expect(result.edges[1].node).to.deep.equal(abraSpell);
      expect(result.pageInfo.startCursor).to.equal('model:spell(1)');
      expect(result.pageInfo.endCursor).to.equal('model:spell(2)');
      expect(result.pageInfo.hasNextPage).to.equal(true);
      expect(result.pageInfo.hasPreviousPage).to.equal(false);
    });

    it('can return the entire result set as a single page', async function () {
      const args = {
        first: allSpells.length,
      };

      const result = await mirageFieldResolver(sourcererParent, args, resolverContext, {
        fieldName: 'spells',
        returnType: graphqlTypes.SpellConnection,
        parentType: graphqlTypes.Sourcerer,
      } as GraphQLResolveInfo);

      expect(result.edges[0].node).to.deep.equal(meowSpell);
      expect(result.edges[1].node).to.deep.equal(abraSpell);
      expect(result.edges[2].node).to.deep.equal(imperioSpell);
      expect(result.edges[3].node).to.deep.equal(abertoSpell);
      expect(result.edges[4].node).to.deep.equal(morsmordreSpell);
      expect(result.pageInfo.startCursor).to.equal('model:spell(1)');
      expect(result.pageInfo.endCursor).to.equal('model:spell(5)');
      expect(result.pageInfo.hasNextPage).to.equal(false);
      expect(result.pageInfo.hasPreviousPage).to.equal(false);
    });

    describe('first/after', function () {
      it('can return the a page in the middle of the total result set', async function () {
        const args = {
          first: 2,
          after: 'model:spell(2)',
        };

        const result = await mirageFieldResolver(sourcererParent, args, resolverContext, {
          fieldName: 'spells',
          returnType: graphqlTypes.SpellConnection,
          parentType: graphqlTypes.Sourcerer,
        } as GraphQLResolveInfo);

        expect(result.edges[0].node).to.deep.equal(imperioSpell);
        expect(result.edges[1].node).to.deep.equal(abertoSpell);
        expect(result.pageInfo.startCursor).to.equal('model:spell(3)');
        expect(result.pageInfo.endCursor).to.equal('model:spell(4)');
        expect(result.pageInfo.hasNextPage).to.equal(true);
        expect(result.pageInfo.hasPreviousPage).to.equal(true);
      });

      it('can return the last page in a result set', async function () {
        const args = {
          first: 2,
          after: 'model:spell(3)',
        };

        const result = await mirageFieldResolver(sourcererParent, args, resolverContext, {
          fieldName: 'spells',
          returnType: graphqlTypes.SpellConnection,
          parentType: graphqlTypes.Sourcerer,
        } as GraphQLResolveInfo);

        expect(result.edges[0].node).to.deep.equal(abertoSpell);
        expect(result.edges[1].node).to.deep.equal(morsmordreSpell);
        expect(result.pageInfo.startCursor).to.equal('model:spell(4)');
        expect(result.pageInfo.endCursor).to.equal('model:spell(5)');
        expect(result.pageInfo.hasNextPage).to.equal(false);
        expect(result.pageInfo.hasPreviousPage).to.equal(true);
      });

      it('can return the first page in a result set', async function () {
        const args = {
          first: 2,
        };

        const result = await mirageFieldResolver(sourcererParent, args, resolverContext, {
          fieldName: 'spells',
          returnType: graphqlTypes.SpellConnection,
          parentType: graphqlTypes.Sourcerer,
        } as GraphQLResolveInfo);

        expect(result.edges[0].node).to.deep.equal(meowSpell);
        expect(result.edges[1].node).to.deep.equal(abraSpell);
        expect(result.pageInfo.startCursor).to.equal('model:spell(1)');
        expect(result.pageInfo.endCursor).to.equal('model:spell(2)');
        expect(result.pageInfo.hasNextPage).to.equal(true);
        expect(result.pageInfo.hasPreviousPage).to.equal(false);
      });

      it('can return an empty edges for an out-of-bounds result set', async function () {
        const args = {
          first: 1,
          after: 'model:spell(5)',
        };

        const result = await mirageFieldResolver(sourcererParent, args, resolverContext, {
          fieldName: 'spells',
          returnType: graphqlTypes.SpellConnection,
          parentType: graphqlTypes.Sourcerer,
        } as GraphQLResolveInfo);

        expect(result.edges.length).to.equal(0);
        expect(result.pageInfo.hasNextPage).to.equal(false);
        expect(result.pageInfo.hasPreviousPage).to.equal(true);
        expect(result.pageInfo.startCursor).to.equal(null);
        expect(result.pageInfo.endCursor).to.equal(null);
      });

      it('throws an error when a specified after cursor does not exist', async function () {
        const args = {
          first: 1,
          after: 'ANARCHY',
        };

        let e: Error = new Error();
        try {
          await mirageFieldResolver(sourcererParent, args, resolverContext, {
            fieldName: 'spells',
            returnType: graphqlTypes.SpellConnection,
            parentType: graphqlTypes.Sourcerer,
          } as GraphQLResolveInfo);
        } catch (error) {
          e = error;
        }

        expect(e.message).to.contain("ANARCHY doesn't appear to be a valid edge");
      });

      it('throws an error when first is less than 0', async function () {
        const args = {
          first: -1,
        };

        try {
          await mirageFieldResolver(sourcererParent, args, resolverContext, {
            fieldName: 'spells',
            returnType: graphqlTypes.SpellConnection,
            parentType: graphqlTypes.Sourcerer,
          } as GraphQLResolveInfo);
        } catch (error) {
          expect(error.message).to.contain('`first` argument must be greater than or equal to 0');
          return;
        }

        throw 'Test finished without asserting error';
      });
    });

    describe('last/before', function () {
      it('can return the a page in the middle of the total result set', async function () {
        const args = {
          last: 2,
          before: 'model:spell(5)',
        };

        const result = await mirageFieldResolver(sourcererParent, args, resolverContext, {
          fieldName: 'spells',
          returnType: graphqlTypes.SpellConnection,
          parentType: graphqlTypes.Sourcerer,
        } as GraphQLResolveInfo);

        expect(result.edges[0].node).to.deep.equal(imperioSpell);
        expect(result.edges[1].node).to.deep.equal(abertoSpell);
        expect(result.pageInfo.startCursor).to.equal('model:spell(3)');
        expect(result.pageInfo.endCursor).to.equal('model:spell(4)');
        expect(result.pageInfo.hasNextPage).to.equal(true);
        expect(result.pageInfo.hasPreviousPage).to.equal(true);
      });

      it('can return the last page in a result set', async function () {
        const args = {
          last: 2,
        };

        const result = await mirageFieldResolver(sourcererParent, args, resolverContext, {
          fieldName: 'spells',
          parentType: graphqlTypes.Sourcerer,
          returnType: graphqlTypes.SpellConnection,
        } as GraphQLResolveInfo);

        expect(result.edges[0].node).to.deep.equal(abertoSpell);
        expect(result.edges[1].node).to.deep.equal(morsmordreSpell);
        expect(result.pageInfo.startCursor).to.equal('model:spell(4)');
        expect(result.pageInfo.endCursor).to.equal('model:spell(5)');
        expect(result.pageInfo.hasNextPage).to.equal(false);
        expect(result.pageInfo.hasPreviousPage).to.equal(true);
      });

      it('can return the first page in a result set', async function () {
        const args = {
          last: 2,
          before: 'model:spell(3)',
        };

        const result = await mirageFieldResolver(sourcererParent, args, resolverContext, {
          fieldName: 'spells',
          parentType: graphqlTypes.Sourcerer,
          returnType: graphqlTypes.SpellConnection,
        } as GraphQLResolveInfo);

        expect(result.edges[0].node).to.deep.equal(meowSpell);
        expect(result.edges[1].node).to.deep.equal(abraSpell);
        expect(result.pageInfo.startCursor).to.equal('model:spell(1)');
        expect(result.pageInfo.endCursor).to.equal('model:spell(2)');
        expect(result.pageInfo.hasNextPage).to.equal(true);
        expect(result.pageInfo.hasPreviousPage).to.equal(false);
      });

      it('can return an empty edges for an out-of-bounds result set', async function () {
        const args = {
          last: 1,
          before: 'model:spell(1)',
        };

        const result = await mirageFieldResolver(sourcererParent, args, resolverContext, {
          fieldName: 'spells',
          returnType: graphqlTypes.SpellConnection,
          parentType: graphqlTypes.Sourcerer,
        } as GraphQLResolveInfo);

        expect(result.edges.length).to.equal(0);
        expect(result.pageInfo.hasNextPage).to.equal(true);
        expect(result.pageInfo.hasPreviousPage).to.equal(false);
        expect(result.pageInfo.startCursor).to.equal(null);
        expect(result.pageInfo.endCursor).to.equal(null);
      });

      it('throws an error when a specified before cursor does not exist', async function () {
        const args = {
          last: 1,
          before: 'ANARCHY',
        };

        let error = new Error();
        try {
          await mirageFieldResolver(sourcererParent, args, resolverContext, {
            fieldName: 'spells',
            returnType: graphqlTypes.SpellConnection,
            parentType: graphqlTypes.Sourcerer,
          } as GraphQLResolveInfo);
        } catch (e) {
          error = e;
        }

        expect(error.message).to.contain("ANARCHY doesn't appear to be a valid edge");
      });

      it('throws an error when last is less than 0', async function () {
        const args = {
          last: -1,
        };

        let e: Error = new Error();
        try {
          await mirageFieldResolver(sourcererParent, args, resolverContext, {
            fieldName: 'spells',
            returnType: graphqlTypes.SpellConnection,
            parentType: graphqlTypes.Sourcerer,
          } as GraphQLResolveInfo);
        } catch (error) {
          e = error;
        }

        expect(e.message).to.contain('`last` argument must be greater than or equal to 0');
      });
    });
  });
});

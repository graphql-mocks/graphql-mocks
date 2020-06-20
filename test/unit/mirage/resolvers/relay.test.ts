import { mirageObjectResolver } from '../../../../src/mirage/resolvers/object';
import { expect } from 'chai';
import { buildSchema, GraphQLObjectType, GraphQLResolveInfo } from 'graphql';
import { Model, Server, hasMany, ModelInstance, Registry } from 'miragejs';
import { MirageGraphQLMapper } from '../../../../src/mirage/mapper';

describe('mirage/relay', () => {
  let mirageServer: Server;
  let mirageMapper: MirageGraphQLMapper;
  let resolverContext: Record<string, unknown>;
  let sourcererParent: ModelInstance;
  let abraSpell: ModelInstance;
  let meowSpell: ModelInstance;
  let imperioSpell: ModelInstance;
  let abertoSpell: ModelInstance;
  let morsmordreSpell: ModelInstance;
  let allSpells: ModelInstance[];

  const graphqlSchema = buildSchema(`
    schema {
      query: Query
    }

    type Query {
      allSpells: SpellConnection!
    }

    type Sourcerer {
      spells: SpellConnection!
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

  const graphqlTypes = {
    Query: graphqlSchema.getType('Query') as GraphQLObjectType,
    SpellConnection: graphqlSchema.getType('SpellConnection') as GraphQLObjectType,
    Sourcerer: graphqlSchema.getType('Sourcerer') as GraphQLObjectType,
  };

  beforeEach(() => {
    const Sourcerer = Model.extend({
      spells: hasMany('spell'),
    });
    const Spell = Model.extend({});

    type MyRegistry = Registry<{ spell: typeof Model; sourcerer: typeof Sourcerer }, {}>;

    mirageServer = new Server<MyRegistry>({
      models: {
        sourcerer: Sourcerer,
        spell: Spell,
      },
    });

    mirageMapper = new MirageGraphQLMapper().addFieldMapping(['Sourcerer', 'paginatedSpells'], ['Sourcerer', 'spells']);

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
          mirageMapper,
          graphqlSchema,
        },
      },
    };
  });

  it('resolves relay connections', async () => {
    const args = {
      first: 2,
    };

    const result = await mirageObjectResolver(sourcererParent, args, resolverContext, {
      fieldName: 'paginatedSpells',
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

  it('can return the entire result set as a single page', async () => {
    const args = {
      first: allSpells.length,
    };

    const result = await mirageObjectResolver(sourcererParent, args, resolverContext, {
      fieldName: 'paginatedSpells',
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

  describe('first/after', () => {
    it('can return the a page in the middle of the total result set', async () => {
      const args = {
        first: 2,
        after: 'model:spell(2)',
      };

      const result = await mirageObjectResolver(sourcererParent, args, resolverContext, {
        fieldName: 'paginatedSpells',
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

    it('can return the last page in a result set', async () => {
      const args = {
        first: 2,
        after: 'model:spell(3)',
      };

      const result = await mirageObjectResolver(sourcererParent, args, resolverContext, {
        fieldName: 'paginatedSpells',
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

    it('can return the first page in a result set', async () => {
      const args = {
        first: 2,
      };

      const result = await mirageObjectResolver(sourcererParent, args, resolverContext, {
        fieldName: 'paginatedSpells',
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

    it('can return an empty edges for an out-of-bounds result set', async () => {
      const args = {
        first: 1,
        after: 'model:spell(5)',
      };

      const result = await mirageObjectResolver(sourcererParent, args, resolverContext, {
        fieldName: 'paginatedSpells',
        returnType: graphqlTypes.SpellConnection,
        parentType: graphqlTypes.Sourcerer,
      } as GraphQLResolveInfo);

      expect(result.edges.length).to.equal(0);
      expect(result.pageInfo.hasNextPage).to.equal(false);
      expect(result.pageInfo.hasPreviousPage).to.equal(true);
      expect(result.pageInfo.startCursor).to.equal(null);
      expect(result.pageInfo.endCursor).to.equal(null);
    });

    it('throws an error when a specified after cursor does not exist', async () => {
      const args = {
        first: 1,
        after: 'ANARCHY',
      };

      let e: Error = new Error();
      try {
        await mirageObjectResolver(sourcererParent, args, resolverContext, {
          fieldName: 'paginatedSpells',
          returnType: graphqlTypes.SpellConnection,
          parentType: graphqlTypes.Sourcerer,
        } as GraphQLResolveInfo);
      } catch (error) {
        e = error;
      }

      expect(e.message).to.equal("ANARCHY doesn't appear to be a valid edge");
    });

    it('throws an error when first is less than 0', async () => {
      const args = {
        first: -1,
      };

      try {
        await mirageObjectResolver(sourcererParent, args, resolverContext, {
          fieldName: 'paginatedSpells',
          returnType: graphqlTypes.SpellConnection,
          parentType: graphqlTypes.Sourcerer,
        } as GraphQLResolveInfo);
      } catch (error) {
        expect(error.message).to.equal('`first` argument must be greater than or equal to 0');
        return;
      }

      throw 'Test finished without asserting error';
    });
  });

  describe('last/before', () => {
    it('can return the a page in the middle of the total result set', async () => {
      const args = {
        last: 2,
        before: 'model:spell(5)',
      };

      const result = await mirageObjectResolver(sourcererParent, args, resolverContext, {
        fieldName: 'paginatedSpells',
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

    it('can return the last page in a result set', async () => {
      const args = {
        last: 2,
      };

      const result = await mirageObjectResolver(sourcererParent, args, resolverContext, {
        fieldName: 'paginatedSpells',
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

    it('can return the first page in a result set', async () => {
      const args = {
        last: 2,
        before: 'model:spell(3)',
      };

      const result = await mirageObjectResolver(sourcererParent, args, resolverContext, {
        fieldName: 'paginatedSpells',
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

    it('can return an empty edges for an out-of-bounds result set', async () => {
      const args = {
        last: 1,
        before: 'model:spell(1)',
      };

      const result = await mirageObjectResolver(sourcererParent, args, resolverContext, {
        fieldName: 'paginatedSpells',
        returnType: graphqlTypes.SpellConnection,
        parentType: graphqlTypes.Sourcerer,
      } as GraphQLResolveInfo);

      expect(result.edges.length).to.equal(0);
      expect(result.pageInfo.hasNextPage).to.equal(true);
      expect(result.pageInfo.hasPreviousPage).to.equal(false);
      expect(result.pageInfo.startCursor).to.equal(null);
      expect(result.pageInfo.endCursor).to.equal(null);
    });

    it('throws an error when a specified before cursor does not exist', async () => {
      const args = {
        last: 1,
        before: 'ANARCHY',
      };

      let error = new Error();
      try {
        await mirageObjectResolver(sourcererParent, args, resolverContext, {
          fieldName: 'paginatedSpells',
          returnType: graphqlTypes.SpellConnection,
          parentType: graphqlTypes.Sourcerer,
        } as GraphQLResolveInfo);
      } catch (e) {
        error = e;
      }

      expect(error.message).to.equal("ANARCHY doesn't appear to be a valid edge");
    });

    it('throws an error when last is less than 0', async () => {
      const args = {
        last: -1,
      };

      let e: Error = new Error();
      try {
        await mirageObjectResolver(sourcererParent, args, resolverContext, {
          fieldName: 'paginatedSpells',
          returnType: graphqlTypes.SpellConnection,
          parentType: graphqlTypes.Sourcerer,
        } as GraphQLResolveInfo);
      } catch (error) {
        e = error;
      }

      expect(e.message).to.equal('`last` argument must be greater than or equal to 0');
    });
  });

  describe('mapping from graphql -> mirage', () => {
    describe('with a previously resolved parent provided', () => {
      beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sourcererParent = mirageServer.schema.create<any, any, any>('sourcerer', {
          spells: [abertoSpell, abraSpell],
        });
      });

      it('can use mapping to pull correct fields', async () => {
        // this occurs when a mapping is  found for the graphql field
        // and is used to find the corresponding mirage model and attr name
        const mappedGraphQLField = 'paginatedSpells';
        const args = {
          first: 2,
        };

        const result = await mirageObjectResolver(sourcererParent, args, resolverContext, {
          fieldName: mappedGraphQLField,
          parentType: graphqlTypes.Sourcerer,
          returnType: graphqlTypes.SpellConnection,
        } as GraphQLResolveInfo);

        expect(result.edges[0].node).to.deep.equal(abertoSpell);
        expect(result.edges[1].node).to.deep.equal(abraSpell);
      });

      it('can fallback to a matching graphql field name <-> mirage attr name', async () => {
        // this occurs when a mapping is not found but the field being resolved
        // matches the same name as the name as the attr on the model in mirage

        const matchingFieldAndAttrName = 'spells';
        const args = {
          first: 2,
        };

        const result = await mirageObjectResolver(sourcererParent, args, resolverContext, {
          fieldName: matchingFieldAndAttrName,
          parentType: graphqlTypes.Sourcerer,
          returnType: graphqlTypes.SpellConnection,
        } as GraphQLResolveInfo);

        expect(result.edges[0].node).to.deep.equal(abertoSpell);
        expect(result.edges[1].node).to.deep.equal(abraSpell);
      });
    });
  });
});

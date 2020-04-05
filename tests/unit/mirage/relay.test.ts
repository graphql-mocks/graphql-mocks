import { mirageRelayResolver } from '../../../src/mirage/resolvers/relay';
import { expect } from 'chai';
import { buildSchema } from 'graphql';
import { Model, Server, hasMany, ModelInstance, Registry, HasMany } from 'miragejs';

describe('mirage/relay', () => {
  let mirageServer: Server;
  let mappings: any[];
  let resolverContext: any;
  let sourcererParent: ModelInstance | null;
  let abraSpell: ModelInstance;
  let meowSpell: ModelInstance;
  let imperioSpell: ModelInstance;
  let abertoSpell: ModelInstance;
  let morsmordreSpell: ModelInstance;
  let allSpells: ModelInstance[];
  const nullParent = null;

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
    Query: graphqlSchema.getType('Query'),
    SpellConnection: graphqlSchema.getType('SpellConnection'),
    Sourcerer: graphqlSchema.getType('Sourcerer'),
  };

  beforeEach(() => {
    const registryHasMany: HasMany<MyRegistry> = hasMany;
    const Sourcerer = Model.extend({
      spells: registryHasMany<'spell'>('spell'),
    });
    const Spell = Model.extend({});

    type MyRegistry = Registry<{ spell: typeof Model; sourcerer: typeof Sourcerer }, {}>;

    mirageServer = new Server<MyRegistry>({
      models: {
        sourcerer: Sourcerer,
        spell: Spell,
      },
    });

    mappings = [
      {
        mirage: { modelName: 'Sourcerer', attrName: 'spells' },
        graphql: { typeName: 'Sourcerer', fieldName: 'paginatedSpells' },
      },
      {
        mirage: { modelName: 'Spell', attrName: '' },
        graphql: { typeName: 'Query', fieldName: 'allSpells' },
      },
    ];

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

    sourcererParent = mirageServer.schema.create<any, any, any>('sourcerer', {
      spells: allSpells,
    });

    resolverContext = {
      pack: {
        dependencies: {
          mirageServer,
          graphqlMirageMappings: mappings,
        },
      },
    };
  });

  it('resolves relay connections', () => {
    const args = {
      first: 2,
    };

    const result = mirageRelayResolver(nullParent, args, resolverContext, {
      fieldName: 'paginatedSpells',
      returnType: graphqlTypes.SpellConnection,
      parentType: graphqlTypes.Query,
    });

    expect(result.edges[0].node).to.deep.equal(meowSpell);
    expect(result.edges[1].node).to.deep.equal(abraSpell);
    expect(result.pageInfo.startCursor).to.equal('model:spell(1)');
    expect(result.pageInfo.endCursor).to.equal('model:spell(2)');
    expect(result.pageInfo.hasNextPage).to.equal(true);
    expect(result.pageInfo.hasPreviousPage).to.equal(false);
  });

  it('can return the entire result set as a single page', () => {
    const args = {
      first: allSpells.length,
    };

    const result = mirageRelayResolver(nullParent, args, resolverContext, {
      fieldName: 'paginatedSpells',
      returnType: graphqlTypes.SpellConnection,
      parentType: graphqlTypes.Query,
    });

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
    it('can return the a page in the middle of the total result set', () => {
      const args = {
        first: 2,
        after: 'model:spell(2)',
      };

      const result = mirageRelayResolver(nullParent, args, resolverContext, {
        fieldName: 'paginatedSpells',
        returnType: graphqlTypes.SpellConnection,
        parentType: graphqlTypes.Query,
      });

      expect(result.edges[0].node).to.deep.equal(imperioSpell);
      expect(result.edges[1].node).to.deep.equal(abertoSpell);
      expect(result.pageInfo.startCursor).to.equal('model:spell(3)');
      expect(result.pageInfo.endCursor).to.equal('model:spell(4)');
      expect(result.pageInfo.hasNextPage).to.equal(true);
      expect(result.pageInfo.hasPreviousPage).to.equal(true);
    });

    it('can return the last page in a result set', () => {
      const args = {
        first: 2,
        after: 'model:spell(3)',
      };

      const result = mirageRelayResolver(nullParent, args, resolverContext, {
        fieldName: 'paginatedSpells',
        returnType: graphqlTypes.SpellConnection,
        parentType: graphqlTypes.Query,
      });

      expect(result.edges[0].node).to.deep.equal(abertoSpell);
      expect(result.edges[1].node).to.deep.equal(morsmordreSpell);
      expect(result.pageInfo.startCursor).to.equal('model:spell(4)');
      expect(result.pageInfo.endCursor).to.equal('model:spell(5)');
      expect(result.pageInfo.hasNextPage).to.equal(false);
      expect(result.pageInfo.hasPreviousPage).to.equal(true);
    });

    it('can return the first page in a result set', () => {
      const args = {
        first: 2,
      };

      const result = mirageRelayResolver(nullParent, args, resolverContext, {
        fieldName: 'paginatedSpells',
        returnType: graphqlTypes.SpellConnection,
        parentType: graphqlTypes.Query,
      });

      expect(result.edges[0].node).to.deep.equal(meowSpell);
      expect(result.edges[1].node).to.deep.equal(abraSpell);
      expect(result.pageInfo.startCursor).to.equal('model:spell(1)');
      expect(result.pageInfo.endCursor).to.equal('model:spell(2)');
      expect(result.pageInfo.hasNextPage).to.equal(true);
      expect(result.pageInfo.hasPreviousPage).to.equal(false);
    });
  });

  describe('last/before', () => {
    it('can return the a page in the middle of the total result set', () => {
      const args = {
        last: 2,
        before: 'model:spell(5)',
      };

      const result = mirageRelayResolver(nullParent, args, resolverContext, {
        fieldName: 'paginatedSpells',
        returnType: graphqlTypes.SpellConnection,
        parentType: graphqlTypes.Query,
      });

      expect(result.edges[0].node).to.deep.equal(imperioSpell);
      expect(result.edges[1].node).to.deep.equal(abertoSpell);
      expect(result.pageInfo.startCursor).to.equal('model:spell(3)');
      expect(result.pageInfo.endCursor).to.equal('model:spell(4)');
      expect(result.pageInfo.hasNextPage).to.equal(true);
      expect(result.pageInfo.hasPreviousPage).to.equal(true);
    });

    it('can return the last page in a result set', () => {
      const args = {
        last: 2,
      };

      const result = mirageRelayResolver(nullParent, args, resolverContext, {
        fieldName: 'paginatedSpells',
        parentType: graphqlTypes.Query,
        returnType: graphqlTypes.SpellConnection,
      });

      expect(result.edges[0].node).to.deep.equal(abertoSpell);
      expect(result.edges[1].node).to.deep.equal(morsmordreSpell);
      expect(result.pageInfo.startCursor).to.equal('model:spell(4)');
      expect(result.pageInfo.endCursor).to.equal('model:spell(5)');
      expect(result.pageInfo.hasNextPage).to.equal(false);
      expect(result.pageInfo.hasPreviousPage).to.equal(true);
    });

    it('can return the first page in a result set', () => {
      const args = {
        last: 2,
        before: 'model:spell(3)',
      };

      const result = mirageRelayResolver(nullParent, args, resolverContext, {
        fieldName: 'paginatedSpells',
        parentType: graphqlTypes.Query,
        returnType: graphqlTypes.SpellConnection,
      });

      expect(result.edges[0].node).to.deep.equal(meowSpell);
      expect(result.edges[1].node).to.deep.equal(abraSpell);
      expect(result.pageInfo.startCursor).to.equal('model:spell(1)');
      expect(result.pageInfo.endCursor).to.equal('model:spell(2)');
      expect(result.pageInfo.hasNextPage).to.equal(true);
      expect(result.pageInfo.hasPreviousPage).to.equal(false);
    });
  });

  describe('mapping from graphql -> mirage', () => {
    describe('with a previously resolved parent provided', () => {
      beforeEach(() => {
        sourcererParent = mirageServer.schema.create<any, any, any>('sourcerer', {
          spells: [abertoSpell, abraSpell],
        });
      });

      it('can use mapping to pull correct fields', () => {
        // this occurs when a mapping is  found for the graphql field
        // and is used to find the corresponding mirage model and attr name
        const mappedGraphQLField = 'paginatedSpells';
        const args = {
          first: 2,
        };

        const result = mirageRelayResolver(sourcererParent, args, resolverContext, {
          fieldName: mappedGraphQLField,
          parentType: graphqlTypes.Sourcerer,
          returnType: graphqlTypes.SpellConnection,
        });

        expect(result.edges[0].node).to.deep.equal(abertoSpell);
        expect(result.edges[1].node).to.deep.equal(abraSpell);
      });

      it('can fallback to a matching graphql field name <-> mirage attr name', () => {
        // this occurs when a mapping is not found but the field being resolved
        // matches the same name as the name as the attr on the model in mirage

        const matchingFieldAndAttrName = 'spells';
        const args = {
          first: 2,
        };

        const result = mirageRelayResolver(sourcererParent, args, resolverContext, {
          fieldName: matchingFieldAndAttrName,
          parentType: graphqlTypes.Sourcerer,
          returnType: graphqlTypes.SpellConnection,
        });

        expect(result.edges[0].node).to.deep.equal(abertoSpell);
        expect(result.edges[1].node).to.deep.equal(abraSpell);
      });
    });

    describe('with a previously resolved parent ** NOT ** provided', () => {
      it('can use mapping to find the correct mirage model', () => {
        const mappedGraphQLField = 'allSpells';
        const args = {
          first: 5,
        };

        const result = mirageRelayResolver(nullParent, args, resolverContext, {
          fieldName: mappedGraphQLField,
          parentType: graphqlTypes.Query, // top-level resolver
          returnType: graphqlTypes.SpellConnection,
        });

        expect(result.edges.length).to.deep.equal(allSpells.length);
        expect(result.edges.map(({ node }: any) => node)).to.deep.equal(allSpells);
      });

      it('can fallback to a matching mirage model by removing Connection from return type', () => {
        const matchingFieldAndAttrName = 'spells';
        const args = {
          first: 5,
        };

        const result = mirageRelayResolver(nullParent, args, resolverContext, {
          fieldName: matchingFieldAndAttrName,
          parentType: graphqlTypes.Query, // top-level resolver
          returnType: graphqlTypes.SpellConnection,
        });

        expect(result.edges.length).to.deep.equal(allSpells.length);
        expect(result.edges.map(({ node }: any) => node)).to.deep.equal(allSpells);
      });
    });
  });
});

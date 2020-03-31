import { mirageRelayResolver } from '../../../src/mirage/resolvers/relay';
import { expect } from 'chai';
import { buildSchema, GraphQLSchema } from 'graphql';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Model, Server, hasMany } = require('miragejs');

describe('mirage/relay', () => {
  describe('#mirageRelayResolver', () => {
    let mirageServer: any;
    let mappings: any[];
    let graphqlSchema: GraphQLSchema;
    let graphqlContext: any;
    let undefinedParent: any;
    let abraSpellModel: any;
    let meowSpellModel: any;
    let imperioSpellModel: any;
    let abertoSpellModel: any;
    let morsmordreSpellModel: any;
    let allSpellModels: any[];

    beforeEach(() => {
      mirageServer = new Server({
        models: {
          sourcerer: Model.extend({
            spells: hasMany('Spell'),
          }),
          spell: Model,
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

      graphqlSchema = buildSchema(`
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

      meowSpellModel = mirageServer.schema.spells.create({
        id: '1',
        incantation: 'meow meow',
        isEvil: false,
      });

      abraSpellModel = mirageServer.schema.spells.create({
        id: '2',
        incantation: 'abra cadabra',
        isEvil: false,
      });

      imperioSpellModel = mirageServer.schema.spells.create({
        id: '3',
        incantation: 'imperio',
        isEvil: true,
      });

      abertoSpellModel = mirageServer.schema.spells.create({
        id: '4',
        incantation: 'aberto',
        isEvil: false,
      });

      morsmordreSpellModel = mirageServer.schema.spells.create({
        id: '5',
        incantation: 'morsmordre',
        isEvil: true,
      });

      allSpellModels = [meowSpellModel, abraSpellModel, imperioSpellModel, abertoSpellModel, morsmordreSpellModel];

      undefinedParent = mirageServer.schema.sourcerers.create({
        spells: allSpellModels,
      });

      graphqlContext = {
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

      const result = mirageRelayResolver(undefinedParent, args, graphqlContext, {
        fieldName: 'paginatedSpells',
        parentType: graphqlSchema.getType('Sourcerer'),
      });

      expect(result.edges[0].node).to.deep.equal(meowSpellModel);
      expect(result.edges[1].node).to.deep.equal(abraSpellModel);
      expect(result.pageInfo.startCursor).to.equal('model:spell(1)');
      expect(result.pageInfo.endCursor).to.equal('model:spell(2)');
      expect(result.pageInfo.hasNextPage).to.equal(true);
      expect(result.pageInfo.hasPreviousPage).to.equal(false);
    });

    it('can return the entire result set as a single page', () => {
      const args = {
        first: allSpellModels.length,
      };

      const result = mirageRelayResolver(undefinedParent, args, graphqlContext, {
        fieldName: 'paginatedSpells',
        parentType: graphqlSchema.getType('Sourcerer'),
      });

      expect(result.edges[0].node).to.deep.equal(meowSpellModel);
      expect(result.edges[1].node).to.deep.equal(abraSpellModel);
      expect(result.edges[2].node).to.deep.equal(imperioSpellModel);
      expect(result.edges[3].node).to.deep.equal(abertoSpellModel);
      expect(result.edges[4].node).to.deep.equal(morsmordreSpellModel);
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

        const result = mirageRelayResolver(undefinedParent, args, graphqlContext, {
          fieldName: 'paginatedSpells',
          parentType: graphqlSchema.getType('Sourcerer'),
        });

        expect(result.edges[0].node).to.deep.equal(imperioSpellModel);
        expect(result.edges[1].node).to.deep.equal(abertoSpellModel);
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

        const result = mirageRelayResolver(undefinedParent, args, graphqlContext, {
          fieldName: 'paginatedSpells',
          parentType: graphqlSchema.getType('Sourcerer'),
        });

        expect(result.edges[0].node).to.deep.equal(abertoSpellModel);
        expect(result.edges[1].node).to.deep.equal(morsmordreSpellModel);
        expect(result.pageInfo.startCursor).to.equal('model:spell(4)');
        expect(result.pageInfo.endCursor).to.equal('model:spell(5)');
        expect(result.pageInfo.hasNextPage).to.equal(false);
        expect(result.pageInfo.hasPreviousPage).to.equal(true);
      });

      it('can return the first page in a result set', () => {
        const args = {
          first: 2,
        };

        const result = mirageRelayResolver(undefinedParent, args, graphqlContext, {
          fieldName: 'paginatedSpells',
          parentType: graphqlSchema.getType('Sourcerer'),
        });

        expect(result.edges[0].node).to.deep.equal(meowSpellModel);
        expect(result.edges[1].node).to.deep.equal(abraSpellModel);
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

        const result = mirageRelayResolver(undefinedParent, args, graphqlContext, {
          fieldName: 'paginatedSpells',
          parentType: graphqlSchema.getType('Sourcerer'),
        });

        expect(result.edges[0].node).to.deep.equal(imperioSpellModel);
        expect(result.edges[1].node).to.deep.equal(abertoSpellModel);
        expect(result.pageInfo.startCursor).to.equal('model:spell(3)');
        expect(result.pageInfo.endCursor).to.equal('model:spell(4)');
        expect(result.pageInfo.hasNextPage).to.equal(true);
        expect(result.pageInfo.hasPreviousPage).to.equal(true);
      });

      it('can return the last page in a result set', () => {
        const args = {
          last: 2,
        };

        const result = mirageRelayResolver(undefinedParent, args, graphqlContext, {
          fieldName: 'paginatedSpells',
          parentType: graphqlSchema.getType('Sourcerer'),
        });

        expect(result.edges[0].node).to.deep.equal(abertoSpellModel);
        expect(result.edges[1].node).to.deep.equal(morsmordreSpellModel);
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

        const result = mirageRelayResolver(undefinedParent, args, graphqlContext, {
          fieldName: 'paginatedSpells',
          parentType: graphqlSchema.getType('Sourcerer'),
        });

        expect(result.edges[0].node).to.deep.equal(meowSpellModel);
        expect(result.edges[1].node).to.deep.equal(abraSpellModel);
        expect(result.pageInfo.startCursor).to.equal('model:spell(1)');
        expect(result.pageInfo.endCursor).to.equal('model:spell(2)');
        expect(result.pageInfo.hasNextPage).to.equal(true);
        expect(result.pageInfo.hasPreviousPage).to.equal(false);
      });
    });

    describe('mapping from graphql -> mirage', () => {
      describe('with a previously resolved parent provided', () => {
        beforeEach(() => {
          undefinedParent = mirageServer.schema.sourcerers.create({
            spells: [abertoSpellModel, abraSpellModel],
          });
        });

        it('can use mapping to pull correct fields', () => {
          // this occurs when a mapping is  found for the graphql field
          // and is used to find the corresponding mirage model and attr name
          const mappedGraphQLField = 'paginatedSpells';
          const args = {
            first: 2,
          };

          const result = mirageRelayResolver(undefinedParent, args, graphqlContext, {
            fieldName: mappedGraphQLField,
            parentType: graphqlSchema.getType('Sourcerer'),
          });

          expect(result.edges[0].node).to.deep.equal(abertoSpellModel);
          expect(result.edges[1].node).to.deep.equal(abraSpellModel);
        });

        it('can fallback to a matching graphql field name <-> mirage attr name', () => {
          // this occurs when a mapping is not found but the field being resolved
          // matches the same name as the name as the attr on the model in mirage

          const matchingFieldAndAttrName = 'spells';
          const args = {
            first: 2,
          };

          const result = mirageRelayResolver(undefinedParent, args, graphqlContext, {
            fieldName: matchingFieldAndAttrName,
            parentType: graphqlSchema.getType('Sourcerer'),
          });

          expect(result.edges[0].node).to.deep.equal(abertoSpellModel);
          expect(result.edges[1].node).to.deep.equal(abraSpellModel);
        });
      });
      describe('with a previously resolved parent ** NOT ** provided', () => {
        beforeEach(() => {
          // This happens when you are at a top-level query
          // and nothing has been previously resolved
          undefinedParent = undefined;
        });

        it('can use mapping to find the correct mirage model', () => {
          const mappedGraphQLField = 'allSpells';
          const args = {
            first: 5,
          };

          const result = mirageRelayResolver(undefinedParent, args, graphqlContext, {
            fieldName: mappedGraphQLField,
            parentType: graphqlSchema.getType('Query'), // top-level resolver
            returnType: graphqlSchema.getType('SpellConnection'),
          });

          expect(result.edges.length).to.deep.equal(allSpellModels.length);
          expect(result.edges.map(({ node }: any) => node)).to.deep.equal(allSpellModels);
        });

        it('can fallback to a matching mirage model by removing Connection from return type', () => {
          const matchingFieldAndAttrName = 'spells';
          const args = {
            first: 5,
          };

          const result = mirageRelayResolver(undefinedParent, args, graphqlContext, {
            fieldName: matchingFieldAndAttrName,
            parentType: graphqlSchema.getType('Query'), // top-level resolver
            returnType: graphqlSchema.getType('SpellConnection'),
          });

          expect(result.edges.length).to.deep.equal(allSpellModels.length);
          expect(result.edges.map(({ node }: any) => node)).to.deep.equal(allSpellModels);
        });
      });
    });
  });
});

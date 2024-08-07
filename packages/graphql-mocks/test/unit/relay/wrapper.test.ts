import { GraphQLResolveInfo } from 'graphql';
import { relayWrapper } from '../../../src/relay';
import { createSchema } from '../../../src/graphql/utils';
import { FieldResolver, ResolverArgs, ResolverContext, ResolverInfo, ResolverParent } from '../../../src/types';
import { expect } from 'chai';

function createMockResolverArgs(
  schemaString: string,
  typeName: string,
  fieldName: string,
): [ResolverParent, ResolverArgs, ResolverContext, ResolverInfo] {
  const schema = createSchema(schemaString, { makeCopy: true });
  return [null, {}, {}, { fieldName, parentType: schema.getType(typeName) } as GraphQLResolveInfo];
}

async function createRelayWrappedResolver(
  info: GraphQLResolveInfo,
  resolver: FieldResolver,
  force = false,
  cursorForNode = (cursor: unknown) => JSON.stringify(cursor),
) {
  const type = info.parentType;
  const field = info.parentType.getFields()[info.fieldName];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wrapperOptions = { type, field } as any;
  const wrapped = await relayWrapper({ cursorForNode, force }).wrap(resolver, wrapperOptions);
  return wrapped;
}

describe('relay/wrapper', function () {
  describe('returns original resolver results', function () {
    it('does not relay paginate when the field does not return an object', async function () {
      const schemaString = `
        schema {
          query: Query
        }

        type Query {
          testField: String!
        }
      `;

      const [parent, args, context, info] = createMockResolverArgs(schemaString, 'Query', 'testField');
      const wrapped = await createRelayWrappedResolver(info, () => 'original result');
      const result = await wrapped(parent, args, context, info);
      expect(result).to.equal('original result');
    });

    it('does not relay paginate when the field does not return an object with an edges field', async function () {
      const schemaString = `
        schema {
          query: Query
        }

        type Query {
          items: [Item!]!
        }

        type Item {
          name: String!
        }
      `;

      const items = [{ name: 'button' }, { name: 'thread' }];
      const [parent, args, context, info] = createMockResolverArgs(schemaString, 'Query', 'items');
      const wrapped = await createRelayWrappedResolver(info, () => items);
      const result = await wrapped(parent, args, context, info);
      expect(result).to.deep.equal(items);
    });

    it('does not relay paginate when the field does not have first, last, before, after args', async function () {
      const schemaString = `
        schema {
          query: Query
        }

        type Query {
          # edges does not have first, last, before, after args
          items: ItemConnection!
        }

        type ItemConnection {
          edges: [ItemEdge!]!
        }

        type ItemEdge {
          node: Item!
        }

        type Item {
          name: String!
        }
      `;

      const items = [{ name: 'button' }, { name: 'thread' }];
      const [parent, args, context, info] = createMockResolverArgs(schemaString, 'Query', 'items');
      const wrapped = await createRelayWrappedResolver(info, () => items);
      const result = await wrapped(parent, args, context, info);
      expect(result).to.deep.equal(items);
    });
  });

  describe('returns relay resolver results', function () {
    it('relay paginates when the field is determined to be a relay field', async function () {
      const schemaString = `
        schema {
          query: Query
        }

        type Query {
          items(first: Int, last: Int, before: String, after: String): ItemConnection!
        }

        type ItemConnection {
          edges: [ItemEdge!]!
        }

        type ItemEdge {
          node: Item!
        }

        type Item {
          name: String!
        }
      `;

      const items = [{ name: 'button' }, { name: 'thread' }];
      const [parent, args, context, info] = createMockResolverArgs(schemaString, 'Query', 'items');
      const wrapped = await createRelayWrappedResolver(info, () => items);
      const result = await wrapped(parent, args, context, info);
      expect(result).to.not.deep.equal(items);
      expect(result.edges).to.exist;
      expect(result.edges[0].node).to.deep.equal({ name: 'button' });
      expect(result.edges[1].node).to.deep.equal({ name: 'thread' });
      expect(result.pageInfo).to.exist;
    });

    it('relay paginates when the force option is passed', async function () {
      const schemaString = `
        schema {
          query: Query
        }

        type Query {
          # edges does not have first, last, before, after args
          items: ItemConnection!
        }

        type ItemConnection {
          edges: [ItemEdge!]!
        }

        type ItemEdge {
          node: Item!
        }

        type Item {
          name: String!
        }
      `;

      const items = [{ name: 'button' }, { name: 'thread' }];
      const [parent, args, context, info] = createMockResolverArgs(schemaString, 'Query', 'items');

      // last argument on `createRelayWrappedResolver` sets force to true in creating
      // the wrapped resolver
      const wrapped = await createRelayWrappedResolver(info, () => items, true);

      const result = await wrapped(parent, args, context, info);
      expect(result).to.not.deep.equal(items);
      expect(result.edges).to.exist;
      expect(result.edges[0].node).to.deep.equal({ name: 'button' });
      expect(result.edges[1].node).to.deep.equal({ name: 'thread' });
      expect(result.pageInfo).to.exist;
    });
  });

  context('pagination', function () {
    type Spell = {
      id: string;
      incantation: string;
      isEvil: boolean;
    };

    let schemaString: string;
    let abraSpell: Spell;
    let meowSpell: Spell;
    let imperioSpell: Spell;
    let abertoSpell: Spell;
    let morsmordreSpell: Spell;
    let allSpells: Spell[];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let cursorForNode: (node: any) => any;

    beforeEach(function () {
      schemaString = `
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
    `;

      meowSpell = {
        id: '1',
        incantation: 'meow meow',
        isEvil: false,
      };

      abraSpell = {
        id: '2',
        incantation: 'abra cadabra',
        isEvil: false,
      };

      imperioSpell = {
        id: '3',
        incantation: 'imperio',
        isEvil: true,
      };

      abertoSpell = {
        id: '4',
        incantation: 'aberto',
        isEvil: false,
      };

      morsmordreSpell = {
        id: '5',
        incantation: 'morsmordre',
        isEvil: true,
      };

      allSpells = [meowSpell, abraSpell, imperioSpell, abertoSpell, morsmordreSpell];

      // use the ids on the nodes for the relay cursors
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cursorForNode = (node: any) => node.id;
    });

    it('resolves relay connections', async function () {
      const args = {
        first: 2,
      };

      const [parent, , context, info] = createMockResolverArgs(schemaString, 'Sourcerer', 'spells');
      const wrapped = await createRelayWrappedResolver(info, () => allSpells, false, cursorForNode);
      const result = await wrapped(parent, args, context, info);

      expect(result.edges[0].node).to.deep.equal(meowSpell);
      expect(result.edges[1].node).to.deep.equal(abraSpell);
      expect(result.pageInfo.startCursor).to.equal('1');
      expect(result.pageInfo.endCursor).to.equal('2');
      expect(result.pageInfo.hasNextPage).to.equal(true);
      expect(result.pageInfo.hasPreviousPage).to.equal(false);
    });

    it('can return the entire result set as a single page', async function () {
      const args = {
        first: allSpells.length,
      };

      const [parent, , context, info] = createMockResolverArgs(schemaString, 'Sourcerer', 'spells');
      const wrapped = await createRelayWrappedResolver(info, () => allSpells, false, cursorForNode);
      const result = await wrapped(parent, args, context, info);

      expect(result.edges[0].node).to.deep.equal(meowSpell);
      expect(result.edges[1].node).to.deep.equal(abraSpell);
      expect(result.edges[2].node).to.deep.equal(imperioSpell);
      expect(result.edges[3].node).to.deep.equal(abertoSpell);
      expect(result.edges[4].node).to.deep.equal(morsmordreSpell);
      expect(result.pageInfo.startCursor).to.equal('1');
      expect(result.pageInfo.endCursor).to.equal('5');
      expect(result.pageInfo.hasNextPage).to.equal(false);
      expect(result.pageInfo.hasPreviousPage).to.equal(false);
    });

    describe('first/after', function () {
      it('can return the a page in the middle of the total result set', async function () {
        const args = {
          first: 2,
          after: '2',
        };

        const [parent, , context, info] = createMockResolverArgs(schemaString, 'Sourcerer', 'spells');
        const wrapped = await createRelayWrappedResolver(info, () => allSpells, false, cursorForNode);
        const result = await wrapped(parent, args, context, info);

        expect(result.edges[0].node).to.deep.equal(imperioSpell);
        expect(result.edges[1].node).to.deep.equal(abertoSpell);
        expect(result.pageInfo.startCursor).to.equal('3');
        expect(result.pageInfo.endCursor).to.equal('4');
        expect(result.pageInfo.hasNextPage).to.equal(true);
        expect(result.pageInfo.hasPreviousPage).to.equal(true);
      });

      it('can return the last page in a result set', async function () {
        const args = {
          first: 2,
          after: '3',
        };

        const [parent, , context, info] = createMockResolverArgs(schemaString, 'Sourcerer', 'spells');
        const wrapped = await createRelayWrappedResolver(info, () => allSpells, false, cursorForNode);
        const result = await wrapped(parent, args, context, info);

        expect(result.edges[0].node).to.deep.equal(abertoSpell);
        expect(result.edges[1].node).to.deep.equal(morsmordreSpell);
        expect(result.pageInfo.startCursor).to.equal('4');
        expect(result.pageInfo.endCursor).to.equal('5');
        expect(result.pageInfo.hasNextPage).to.equal(false);
        expect(result.pageInfo.hasPreviousPage).to.equal(true);
      });

      it('can return the first page in a result set', async function () {
        const args = {
          first: 2,
        };

        const [parent, , context, info] = createMockResolverArgs(schemaString, 'Sourcerer', 'spells');
        const wrapped = await createRelayWrappedResolver(info, () => allSpells, false, cursorForNode);
        const result = await wrapped(parent, args, context, info);

        expect(result.edges[0].node).to.deep.equal(meowSpell);
        expect(result.edges[1].node).to.deep.equal(abraSpell);
        expect(result.pageInfo.startCursor).to.equal('1');
        expect(result.pageInfo.endCursor).to.equal('2');
        expect(result.pageInfo.hasNextPage).to.equal(true);
        expect(result.pageInfo.hasPreviousPage).to.equal(false);
      });

      it('can return an empty edges for an out-of-bounds result set', async function () {
        const args = {
          first: 1,
          after: '5',
        };

        const [parent, , context, info] = createMockResolverArgs(schemaString, 'Sourcerer', 'spells');
        const wrapped = await createRelayWrappedResolver(info, () => allSpells, false, cursorForNode);
        const result = await wrapped(parent, args, context, info);

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
          const [parent, , context, info] = createMockResolverArgs(schemaString, 'Sourcerer', 'spells');
          const wrapped = await createRelayWrappedResolver(info, () => allSpells, false, cursorForNode);
          await wrapped(parent, args, context, info);
        } catch (error) {
          e = error as Error;
        }

        expect(e.message).to.contain("ANARCHY doesn't appear to be a valid edge");
      });

      it('throws an error when first is less than 0', async function () {
        const args = {
          first: -1,
        };

        try {
          const [parent, , context, info] = createMockResolverArgs(schemaString, 'Sourcerer', 'spells');
          const wrapped = await createRelayWrappedResolver(info, () => allSpells, false, cursorForNode);
          await wrapped(parent, args, context, info);
        } catch (error) {
          expect((error as Error).message).to.contain('`first` argument must be greater than or equal to 0');
          return;
        }

        throw 'Test finished without asserting error';
      });
    });

    describe('last/before', function () {
      it('can return the a page in the middle of the total result set', async function () {
        const args = {
          last: 2,
          before: '5',
        };

        const [parent, , context, info] = createMockResolverArgs(schemaString, 'Sourcerer', 'spells');
        const wrapped = await createRelayWrappedResolver(info, () => allSpells, false, cursorForNode);
        const result = await wrapped(parent, args, context, info);

        expect(result.edges[0].node).to.deep.equal(imperioSpell);
        expect(result.edges[1].node).to.deep.equal(abertoSpell);
        expect(result.pageInfo.startCursor).to.equal('3');
        expect(result.pageInfo.endCursor).to.equal('4');
        expect(result.pageInfo.hasNextPage).to.equal(true);
        expect(result.pageInfo.hasPreviousPage).to.equal(true);
      });

      it('can return the last page in a result set', async function () {
        const args = {
          last: 2,
        };

        const [parent, , context, info] = createMockResolverArgs(schemaString, 'Sourcerer', 'spells');
        const wrapped = await createRelayWrappedResolver(info, () => allSpells, false, cursorForNode);
        const result = await wrapped(parent, args, context, info);

        expect(result.edges[0].node).to.deep.equal(abertoSpell);
        expect(result.edges[1].node).to.deep.equal(morsmordreSpell);
        expect(result.pageInfo.startCursor).to.equal('4');
        expect(result.pageInfo.endCursor).to.equal('5');
        expect(result.pageInfo.hasNextPage).to.equal(false);
        expect(result.pageInfo.hasPreviousPage).to.equal(true);
      });

      it('can return the first page in a result set', async function () {
        const args = {
          last: 2,
          before: '3',
        };

        const [parent, , context, info] = createMockResolverArgs(schemaString, 'Sourcerer', 'spells');
        const wrapped = await createRelayWrappedResolver(info, () => allSpells, false, cursorForNode);
        const result = await wrapped(parent, args, context, info);

        expect(result.edges[0].node).to.deep.equal(meowSpell);
        expect(result.edges[1].node).to.deep.equal(abraSpell);
        expect(result.pageInfo.startCursor).to.equal('1');
        expect(result.pageInfo.endCursor).to.equal('2');
        expect(result.pageInfo.hasNextPage).to.equal(true);
        expect(result.pageInfo.hasPreviousPage).to.equal(false);
      });

      it('can return an empty edges for an out-of-bounds result set', async function () {
        const args = {
          last: 1,
          before: '1',
        };

        const [parent, , context, info] = createMockResolverArgs(schemaString, 'Sourcerer', 'spells');
        const wrapped = await createRelayWrappedResolver(info, () => allSpells, false, cursorForNode);
        const result = await wrapped(parent, args, context, info);

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
          const [parent, , context, info] = createMockResolverArgs(schemaString, 'Sourcerer', 'spells');
          const wrapped = await createRelayWrappedResolver(info, () => allSpells, false, cursorForNode);
          await wrapped(parent, args, context, info);
        } catch (e) {
          error = e as Error;
        }

        expect(error.message).to.contain("ANARCHY doesn't appear to be a valid edge");
      });

      it('throws an error when last is less than 0', async function () {
        const args = {
          last: -1,
        };

        let e: Error = new Error();
        try {
          const [parent, , context, info] = createMockResolverArgs(schemaString, 'Sourcerer', 'spells');
          const wrapped = await createRelayWrappedResolver(info, () => allSpells, false, cursorForNode);
          await wrapped(parent, args, context, info);
        } catch (error) {
          e = error as Error;
        }

        expect(e.message).to.contain('`last` argument must be greater than or equal to 0');
      });
    });
  });
});

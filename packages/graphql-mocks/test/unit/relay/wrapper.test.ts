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
  const schema = createSchema(schemaString);
  return [null, {}, {}, { fieldName, parentType: schema.getType(typeName) } as GraphQLResolveInfo];
}

async function createRelayWrappedResolver(info: GraphQLResolveInfo, resolver: FieldResolver, force = false) {
  const type = info.parentType;
  const field = info.parentType.getFields()[info.fieldName];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wrapperOptions = { type, field } as any;
  const cursorForNode = (cursor: unknown) => JSON.stringify(cursor);
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
});

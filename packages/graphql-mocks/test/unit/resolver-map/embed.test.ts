import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';
import { embed } from '../../../src/resolver-map/embed';
import { generatePackOptions } from '../../mocks';
import { GraphQLResolveInfo, buildSchema, GraphQLSchema, GraphQLInterfaceType } from 'graphql';
import { FieldResolver, ResolverMap, TypeResolver } from '../../../src/types';
import { field } from '../../../src/highlight/highlighter/field';
import { hi } from '../../../src/highlight';
import { PackOptions } from '../../../src/pack/types';
import { Wrapper } from '../../../src/resolver/types';

describe('resolver-map/embed', function () {
  let schema: GraphQLSchema;
  let resolverToEmbed: FieldResolver & SinonSpy;
  let resolverMap: ResolverMap;
  let packOptions: PackOptions;

  beforeEach(function () {
    schema = buildSchema(`
      schema {
        query: Query
      }

      type Query {
        person: Person!
      }

      type Pet {
        name: String!
      }

      type Person {
        name: String!
        pet: Pet!
      }

      interface Sortable {
        position: Int
      }

      interface Nameable {
        name: String
      }
    `);

    resolverToEmbed = spy();
    resolverMap = {};
    packOptions = generatePackOptions({ dependencies: { graphqlSchema: schema } });
  });

  context('highlight', function () {
    it('can use a highlight callback', async function () {
      const embeddedMiddleware = embed({
        resolver: resolverToEmbed,
        highlight: (h) => h.include(field(['Person', '*'])),
      });

      const embeddedResolverMap = await embeddedMiddleware(resolverMap, packOptions);

      expect(embeddedResolverMap.Person.name).to.be.a('function');
      expect(embeddedResolverMap.Person.pet).to.be.a('function');

      expect(embeddedResolverMap.Query?.person).to.not.be.a('function');
      expect(embeddedResolverMap.Pet?.name).to.not.be.a('function');
    });

    it('can use a highlight instance', async function () {
      const highlight = hi(schema).include(field(['Person', '*']));

      const embeddedMiddleware = embed({
        resolver: resolverToEmbed,
        highlight,
      });

      const embeddedResolverMap = await embeddedMiddleware(resolverMap, packOptions);

      expect(embeddedResolverMap.Person.name).to.be.a('function');
      expect(embeddedResolverMap.Person.pet).to.be.a('function');

      expect(embeddedResolverMap.Query?.person).to.not.be.a('function');
      expect(embeddedResolverMap.Pet?.name).to.not.be.a('function');
    });

    it('can use a reference', async function () {
      const embeddedMiddleware = embed({
        resolver: resolverToEmbed,
        highlight: [['Person', 'name']],
      });

      const embeddedResolverMap = await embeddedMiddleware(resolverMap, packOptions);

      expect(embeddedResolverMap.Person.name).to.be.a('function');

      expect(embeddedResolverMap.Person?.pet).to.not.be.a('function');
      expect(embeddedResolverMap.Query?.person).to.not.be.a('function');
      expect(embeddedResolverMap.Pet?.name).to.not.be.a('function');
    });
  });

  context('embedding a new resolver', function () {
    it('can embed a new resolver', async function () {
      const embeddedMiddleware = embed({
        resolver: resolverToEmbed,
        highlight: (h) => h.include(field(['Person', '*'])),
      });

      const embeddedResolverMap = await embeddedMiddleware(resolverMap, packOptions);

      expect(embeddedResolverMap.Person.name).to.be.a('function');
      expect(embeddedResolverMap.Person.pet).to.be.a('function');
      expect(embeddedResolverMap.Query?.person).to.not.be.a('function');
      expect(embeddedResolverMap.Pet?.name).to.not.be.a('function');
    });

    it('throws an error when trying to embed a new resolver where a resolver already exists and { replace: false }', async function () {
      const originalPersonNameResolver = spy();

      const resolverMap = {
        Person: {
          name: originalPersonNameResolver,
        },
      };

      const embeddedMiddlware = embed({
        highlight: [['Person', 'name']],
        resolver: resolverToEmbed,
      });

      let error: Error | null = null;
      try {
        await embeddedMiddlware(resolverMap, packOptions);
      } catch (e) {
        error = e as Error;
      } finally {
        expect(error?.message).to.contain(
          'Tried to add a new resolver via `embed` at ["Person","name"] but a resolver already exists there.',
        );
      }
    });

    it('can replace an existing resolver with { replace: true }', async function () {
      const originalPersonNameResolver = spy();

      const resolverMap = {
        Person: {
          name: originalPersonNameResolver,
        },
      };

      const embeddedMiddlware = await embed({
        highlight: [['Person', 'name']],
        resolver: resolverToEmbed,
        replace: true,
      });

      expect(resolverMap.Person.name).to.equal(originalPersonNameResolver);

      const embededResolverMap = await embeddedMiddlware(resolverMap, packOptions);

      // make call on Person.name resolver making calls to wrappers as well
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      embededResolverMap.Person.name('parent', 'args' as any, 'context', 'info' as any);

      // because it was swapped out with the `replace: true` it should not be
      // on the resolver map
      expect(originalPersonNameResolver.called).to.be.false;

      // the `replacedPersonNameResolver` was swapped in for the Person.name
      // place and it should have been called
      expect(resolverToEmbed.called).to.be.true;
    });

    it('it can embed a new resolver with wrappers', async function () {
      const resolverWrapper: Wrapper = spy(
        async (resolver) => (
          parent: unknown,
          args: unknown,
          context: unknown,
          info: unknown,
        ): ReturnType<FieldResolver> => resolver(parent, args, context, info),
      );

      const embeddedMiddleware = embed({
        highlight: [['Person', 'name']],
        wrappers: [resolverWrapper],
        resolver: resolverToEmbed,
      });

      expect((resolverWrapper as SinonSpy).called).to.equal(false);

      const embededResolverMap = await embeddedMiddleware(resolverMap, packOptions);

      expect((resolverWrapper as SinonSpy).called).to.equal(true);

      expect(embededResolverMap.Person.name).is.a('function', 'resolver is installed at specified path');
      expect(resolverToEmbed.called).to.equal(false);
      embededResolverMap.Person.name({}, {}, {}, {} as GraphQLResolveInfo);
      expect(resolverToEmbed.called).to.equal(true);
      expect((resolverWrapper as SinonSpy).called).to.equal(true);
    });

    it('can embed a type resolver', async function () {
      const embeddedMiddleware = embed({
        resolver: resolverToEmbed as TypeResolver,
        highlight: ['Nameable', 'Sortable'],
      });

      const embededResolverMap = await embeddedMiddleware(resolverMap, packOptions);

      expect(embededResolverMap.Nameable?.__resolveType).to.exist;
      expect(embededResolverMap.Sortable?.__resolveType).to.exist;

      // for typescript
      if (typeof embededResolverMap.Nameable?.__resolveType !== 'function') {
        throw new Error('hey, this resolver function should exist so I can call it...');
      }

      expect(resolverToEmbed.called).to.equal(false);
      embededResolverMap.Nameable?.__resolveType({}, {}, {} as GraphQLResolveInfo, {} as GraphQLInterfaceType);
      expect(resolverToEmbed.called).to.equal(true);
    });
  });

  context('wrapping an existing resolver', function () {
    it('it can embed wrappers around existing resolvers', async function () {
      const nameFieldResolver = spy();
      const resolverWrapper: Wrapper = spy(async (resolver) => (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        parent: any,
        args: Record<string, unknown>,
        context: Record<string, unknown>,
        info: GraphQLResolveInfo,
      ): FieldResolver => resolver(parent, args, context, info));

      const embeddedResolverMapMiddleware = embed({
        highlight: [['Person', 'name']],
        wrappers: [resolverWrapper],
      });

      const resolverMap = {
        Person: {
          name: nameFieldResolver,
        },
      };

      expect((resolverWrapper as SinonSpy).called).to.equal(false);
      const embededResolverMap = await embeddedResolverMapMiddleware(resolverMap, packOptions);
      expect((resolverWrapper as SinonSpy).called).to.equal(true);

      expect(nameFieldResolver.called).to.equal(false);
      embededResolverMap.Person.name({}, {}, {}, {} as GraphQLResolveInfo);
      expect(nameFieldResolver.called).to.equal(true);
      expect((resolverWrapper as SinonSpy).called).to.equal(true);
    });

    it('quietly does nothing if there is no existing resolver to wrap', async function () {
      const resolverWrapper: Wrapper = spy();
      // empty resolver map with no resolver for Person.name
      const resolverMap = {};
      const embeddedMiddleware = embed({
        highlight: [['Person', 'name']],
        wrappers: [resolverWrapper],
      });

      const embededResolverMap = await embeddedMiddleware(resolverMap, packOptions);

      expect(embededResolverMap).to.deep.equal({});
    });

    it('can wrap an existing type resolver', async function () {
      const existingTypeResolverSpy = spy();
      resolverMap.Nameable = {
        __resolveType: existingTypeResolverSpy,
      };

      const resolverWrapperSpy: Wrapper & SinonSpy = spy((resolver) => resolver);
      const embeddedMiddleware = embed({
        wrappers: [resolverWrapperSpy],
        highlight: ['Nameable', 'Sortable'],
      });

      const embededResolverMap = await embeddedMiddleware(resolverMap, packOptions);

      // for typescript
      if (typeof embededResolverMap.Nameable?.__resolveType !== 'function') {
        throw new Error('hey, this resolver function should exist so I can call it...');
      }

      expect(existingTypeResolverSpy.called).to.equal(false);
      embededResolverMap.Nameable?.__resolveType({}, {}, {} as GraphQLResolveInfo, {} as GraphQLInterfaceType);
      expect(existingTypeResolverSpy.called, 'the original type resolver is called').to.equal(true);
      expect(resolverWrapperSpy.called, 'the wrapper around the original type resolver is called').to.equal(true);
    });
  });

  context('argument errors', function () {
    it('throws if a valid graphql schema is not given', async function () {
      const embeddedMiddleware = embed({
        highlight: [['Person', 'name']],
        resolver: resolverToEmbed,
      });

      packOptions.dependencies.graphqlSchema = 'NOT A GRAPHQL SCHEMA';

      let error: Error | undefined;
      try {
        await embeddedMiddleware(resolverMap, packOptions);
      } catch (e) {
        error = e as Error;
      }

      expect(error?.message).to.match(/"graphqlSchema" is an expected dependency, got type/);
    });
  });
});

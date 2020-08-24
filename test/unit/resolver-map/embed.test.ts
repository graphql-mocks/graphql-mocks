import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';
import { embed } from '../../../src/resolver-map/embed';
import { generatePackOptions } from '../../mocks';
import { GraphQLResolveInfo, buildSchema, GraphQLSchema } from 'graphql';
import { Wrapper, FieldResolver } from '../../../src/types';

describe('resolver-map/embed', function () {
  let schema: GraphQLSchema;

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
    `);
  });

  it('can embed a resolver on multiple targets', async function () {
    const resolver = spy();

    const embeddedMiddleware = embed({
      resolver,
      highlight: ['*', '*'],
    });

    const emptyResolverMap = {};
    const embeddedResolverMap = await embeddedMiddleware(
      emptyResolverMap,
      generatePackOptions({ dependencies: { graphqlSchema: schema } }),
    );

    expect(embeddedResolverMap.Query.person).to.be.a('function');
    expect(embeddedResolverMap.Pet.name).to.be.a('function');
    expect(embeddedResolverMap.Person.name).to.be.a('function');
    expect(embeddedResolverMap.Person.pet).to.be.a('function');
  });

  it('throws an error when trying to replace an existing resolver when { replace: false }', async function () {
    const originalPersonNameResolver = spy();

    const resolverMap = {
      Person: {
        name: originalPersonNameResolver,
      },
    };

    let wrappedResolver: FieldResolver;
    const resolverWrapper: Wrapper = async (resolver: FieldResolver) => {
      wrappedResolver = spy(resolver);
      return wrappedResolver;
    };

    const replacedPersonNameResolver = spy();

    const embeddedMiddlware = embed({
      highlight: ['Person', 'name'],
      wrappers: [resolverWrapper],
      resolver: replacedPersonNameResolver,
    });

    expect(resolverMap.Person.name).to.equal(originalPersonNameResolver);

    let error: Error | null = null;
    try {
      await embeddedMiddlware(resolverMap, generatePackOptions({ dependencies: { graphqlSchema: schema } }));
    } catch (e) {
      error = e;
    } finally {
      expect(error?.message).to.equal(
        'Cannot add resolver to resolver map at ["Person", "name"] when replace is set to false',
      );
    }
  });

  it('can replace an existing resolver with resolver wrappers at a specific target', async function () {
    const originalPersonNameResolver = spy();

    const resolverMap = {
      Person: {
        name: originalPersonNameResolver,
      },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let wrappedResolver: any;
    const resolverWrapper: Wrapper = async (resolver: FieldResolver) => {
      wrappedResolver = spy(resolver);
      return wrappedResolver;
    };

    const replacedPersonNameResolver = spy();

    const embeddedMiddlware = await embed({
      highlight: ['Person', 'name'],
      wrappers: [resolverWrapper],
      resolver: replacedPersonNameResolver,
      replace: true,
    });

    expect(resolverMap.Person.name).to.equal(originalPersonNameResolver);

    const embededResolverMap = await embeddedMiddlware(
      resolverMap,
      generatePackOptions({ dependencies: { graphqlSchema: schema } }),
    );

    // make call on Person.name resolver making calls to wrappers as well
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    embededResolverMap.Person.name('parent', 'args' as any, 'context', 'info' as any);

    // because it was swapped out with the `replace: true` it should not be
    // on the resolver map
    expect(originalPersonNameResolver.called).to.be.false;

    // the `replacedPersonNameResolver` was swapped in for the Person.name
    // place and it should have been called
    expect(replacedPersonNameResolver.called).to.be.true;

    // a wrapper was included and it should have also been called
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((wrappedResolver as any).called).to.be.true;
  });

  it('it can embed a new resolver with wrappers on a specific target', async function () {
    const resolver = spy();
    const resolverWrapper: Wrapper = spy(
      async (resolver) => (
        parent: unknown,
        args: unknown,
        context: unknown,
        info: unknown,
      ): ReturnType<FieldResolver> => resolver(parent, args, context, info),
    );

    const embeddedMiddleware = embed({
      highlight: ['Person', 'name'],
      wrappers: [resolverWrapper],
      resolver,
    });

    const resolverMap = {};

    expect((resolverWrapper as SinonSpy).called).to.equal(false);

    const embededResolverMap = await embeddedMiddleware(
      resolverMap,
      generatePackOptions({ dependencies: { graphqlSchema: schema } }),
    );

    expect((resolverWrapper as SinonSpy).called).to.equal(true);

    expect(embededResolverMap.Person.name).is.a('function', 'resolver is installed at specified path');
    expect(resolver.called).to.equal(false);
    embededResolverMap.Person.name({}, {}, {}, {} as GraphQLResolveInfo);
    expect(resolver.called).to.equal(true);
    expect((resolverWrapper as SinonSpy).called).to.equal(true);
  });

  it('it can embed wrappers around an existing target', async function () {
    const nameFieldResolver = spy();
    const resolverWrapper: Wrapper = spy(async (resolver) => (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parent: any,
      args: Record<string, unknown>,
      context: Record<string, unknown>,
      info: GraphQLResolveInfo,
    ): FieldResolver => resolver(parent, args, context, info));

    const embeddedResolverMapMiddleware = embed({
      highlight: ['Person', 'name'],
      wrappers: [resolverWrapper],
    });

    const resolverMap = {
      Person: {
        name: nameFieldResolver,
      },
    };

    expect((resolverWrapper as SinonSpy).called).to.equal(false);
    const embededResolverMap = await embeddedResolverMapMiddleware(
      resolverMap,
      generatePackOptions({ dependencies: { graphqlSchema: schema } }),
    );
    expect((resolverWrapper as SinonSpy).called).to.equal(true);

    expect(nameFieldResolver.called).to.equal(false);
    embededResolverMap.Person.name({}, {}, {}, {} as GraphQLResolveInfo);
    expect(nameFieldResolver.called).to.equal(true);
    expect((resolverWrapper as SinonSpy).called).to.equal(true);
  });

  it('quietly does nothing if a resolver is not given, nor is on the resolver map', async function () {
    const resolverWrapper: Wrapper = spy();
    // empty resolver map with no resolver for Person.name
    const resolverMap = {};
    const embeddedMiddleware = embed({
      highlight: ['Person', 'name'],
      wrappers: [resolverWrapper],
    });

    const embededResolverMap = await embeddedMiddleware(
      resolverMap,
      generatePackOptions({ dependencies: { graphqlSchema: schema } }),
    );

    expect(embededResolverMap).to.deep.equal({});
  });
});

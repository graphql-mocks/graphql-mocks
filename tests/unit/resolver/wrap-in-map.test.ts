import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';
import { wrapResolverInMap } from '../../../src/resolver/wrap-in-map';
import { ResolverWrapper, Resolver } from '../../../src/types';
import { schema, generatePackOptions } from '../../mocks';
import { GraphQLResolveInfo } from 'graphql';

describe('resolver/wrap-in-map', function () {
  it('it can create a resolver map wrapper using a specified resolver', function () {
    const resolver = spy();
    const resolverWrapper: ResolverWrapper = spy((resolver) => (parent: any, args: any, context: any, info: any) =>
      resolver(parent, args, context, info),
    );

    const wrappedInResolverMapWrapper = wrapResolverInMap('User', 'name', [resolverWrapper], resolver);
    const resolverMap = {};

    expect((resolverWrapper as SinonSpy).called).to.equal(false);
    const wrappedResolverMap = wrappedInResolverMapWrapper(
      resolverMap,
      generatePackOptions({ dependencies: { graphqlSchema: schema } }),
    );
    expect((resolverWrapper as SinonSpy).called).to.equal(true);

    expect(wrappedResolverMap?.User?.name).is.a('function', 'resolver is installed at specified path');
    expect(resolver.called).to.equal(false);
    wrappedResolverMap.User.name({}, {}, {}, {} as GraphQLResolveInfo);
    expect(resolver.called).to.equal(true);
    expect((resolverWrapper as SinonSpy).called).to.equal(true);
  });

  it('it can create a resolver map wrapper using existing resolver on map', function () {
    const nameFieldResolver = spy();
    const resolverWrapper: ResolverWrapper = spy((resolver) => (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parent: any,
      args: Record<string, unknown>,
      context: Record<string, unknown>,
      info: GraphQLResolveInfo,
    ): Resolver => resolver(parent, args, context, info));

    const wrappedInResolverMapWrapper = wrapResolverInMap('User', 'name', [resolverWrapper]);
    const resolverMap = {
      User: {
        name: nameFieldResolver,
      },
    };

    expect((resolverWrapper as SinonSpy).called).to.equal(false);
    const wrappedResolverMap = wrappedInResolverMapWrapper(
      resolverMap,
      generatePackOptions({ dependencies: { graphqlSchema: schema } }),
    );
    expect((resolverWrapper as SinonSpy).called).to.equal(true);

    expect(nameFieldResolver.called).to.equal(false);
    wrappedResolverMap.User.name({}, {}, {}, {} as GraphQLResolveInfo);
    expect(nameFieldResolver.called).to.equal(true);
    expect((resolverWrapper as SinonSpy).called).to.equal(true);
  });

  it('throws an error if the specified resolver does not exist, nor on the resolver map', function () {
    const resolverWrapper: ResolverWrapper = spy();
    // empty resolver map with no resolver for User.name
    const resolverMap = {};
    const wrappedInResolverMapWrapper = wrapResolverInMap('User', 'name', [resolverWrapper]);

    expect(() =>
      wrappedInResolverMapWrapper(resolverMap, generatePackOptions({ dependencies: { graphqlSchema: schema } })),
    ).to.throw(
      'Could not determine resolver to wrap, either pass one into this `wrap`, or have an initial resolver on the resolver map at type: "User", field "name"',
    );
  });
});

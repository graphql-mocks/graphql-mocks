import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';
import { wrap } from '../../../src/resolver/wrap';
import { generatePackOptions, userObjectType, userObjectNameField, nameableInterfaceType } from '../../mocks';
import { GraphQLSchema, GraphQLResolveInfo, GraphQLAbstractType } from 'graphql';
import { BaseWrapperOptions, FieldResolver, TypeResolver } from '../../../src/types';
import { createWrapper } from '../../../src/resolver/create-wrapper';
import { FieldWrapperFunction } from '../../../src/resolver/types';
import { WrapperFor } from '../../../src/resolver/constant';

describe('resolver/wrap', function () {
  let resolverWrapperOptions: BaseWrapperOptions;
  let resolverParent: unknown;
  let resolverArgs: Record<string, unknown>;
  let resolverInfo: GraphQLResolveInfo;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let resolverContext: any;
  let resolver: SinonSpy;
  let internalWrapperSpy: SinonSpy;
  let resolverWrapper: SinonSpy;

  beforeEach(function () {
    resolverWrapperOptions = {
      schema: {} as GraphQLSchema,
      packOptions: generatePackOptions(),
      type: userObjectType,
      field: userObjectNameField,
      resolverMap: {},
    };

    resolverParent = {};
    resolverArgs = {};
    resolverInfo = {} as GraphQLResolveInfo;
    resolverContext = {};

    resolver = spy();
    internalWrapperSpy = spy();
    resolverWrapper = spy(
      (resolver /*, _options*/): FieldResolver => {
        return (parent, args, context, info): ReturnType<typeof resolver> => {
          internalWrapperSpy();
          return resolver(parent, args, context, info);
        };
      },
    );
  });

  it('can wrap a resolver function', async function () {
    const wrappedResolver = await wrap(resolver, [resolverWrapper as FieldWrapperFunction], resolverWrapperOptions);
    expect(resolverWrapper.called).to.be.true;
    expect(resolverWrapper.firstCall.args).to.deep.equal([resolver, resolverWrapperOptions]);

    expect(internalWrapperSpy.called).to.be.false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    wrappedResolver(resolverParent, resolverArgs, resolverContext, resolverInfo as any);
    expect(internalWrapperSpy.called).to.be.true;
    expect(resolver.called).to.be.true;
    expect(resolver.firstCall.args).to.deep.equal([resolverParent, resolverArgs, resolverInfo, resolverContext]);
  });

  it('can wrap a resolver function with multiple resolver wrappers', async function () {
    const wrappedResolver = await wrap(
      resolver,
      // using the same resolverWrapper twice
      [resolverWrapper as FieldWrapperFunction, resolverWrapper as FieldWrapperFunction],
      resolverWrapperOptions,
    );
    expect(resolverWrapper.callCount).to.equal(2);
    expect(internalWrapperSpy.called).to.be.false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    wrappedResolver(resolverParent, resolverArgs, resolverContext, resolverInfo as any);
    expect(internalWrapperSpy.callCount).to.equal(2);
    expect(resolver.callCount).to.equal(1);
    expect(resolver.firstCall.args).to.deep.equal([resolverParent, resolverArgs, resolverInfo, resolverContext]);
  });

  it('throws an error if a wrapper does not return a function', async function () {
    let error: Error | null = null;

    try {
      await wrap(
        resolver,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [(): any => ('resolver wrapper returning a string' as unknown) as FieldResolver],
        resolverWrapperOptions,
      );
    } catch (e) {
      error = e;
    } finally {
      expect(error?.message).to.equal(
        `Wrapper "UNNAMED" was not a function or did not have a wrap method, got string.`,
      );
    }
  });

  context('named wrappers', function () {
    it('can wrap using a named field wrapper', async function () {
      const wrapper = createWrapper('test-wrapper', WrapperFor.FIELD, function (resolver) {
        return (...args): unknown => resolver(...args);
      });

      const wrappedResolver = await wrap(resolver as FieldResolver, [wrapper], resolverWrapperOptions);
      expect(wrappedResolver).to.not.equal(resolver);
      expect(resolver.called).to.be.false;
      wrappedResolver(resolverParent, resolverArgs, resolverContext, resolverInfo);
      expect(resolver.called).to.be.true;
    });

    it('throws on field resolver with type wrapper mismatch', async function () {
      const wrapper = createWrapper('test-wrapper', WrapperFor.TYPE, function (resolver) {
        return resolver;
      });

      let error: Error | undefined;
      try {
        await wrap(resolver as FieldResolver, [wrapper], resolverWrapperOptions);
      } catch (e) {
        error = e;
      }

      expect(error?.message).to.equal(`Wrapper "test-wrapper" is for TYPE resolvers and can't wrap ["User"].`);
    });

    it('can wrap using a named type wrapper', async function () {
      const wrapper = createWrapper('test-wrapper', WrapperFor.TYPE, function (resolver) {
        return (...args): ReturnType<typeof resolver> => resolver(...args);
      });

      resolverWrapperOptions.type = nameableInterfaceType;
      resolverWrapperOptions.field = undefined;

      const wrappedResolver = await wrap(resolver as TypeResolver, [wrapper], resolverWrapperOptions);
      expect(wrappedResolver).to.not.equal(resolver);
      expect(resolver.called).to.be.false;
      wrappedResolver({}, {}, {} as GraphQLResolveInfo, {} as GraphQLAbstractType);
      expect(resolver.called).to.be.true;
    });

    it('throws on type resolver with field wrapper mismatch', async function () {
      const wrapper = createWrapper('test-wrapper', WrapperFor.FIELD, function (resolver) {
        return (...args): unknown => resolver(...args);
      });

      resolverWrapperOptions.type = nameableInterfaceType;
      resolverWrapperOptions.field = undefined;

      let error: Error | undefined;
      try {
        await wrap(resolver as TypeResolver, [wrapper], resolverWrapperOptions);
      } catch (e) {
        error = e;
      }

      expect(error?.message).to.equal(
        `Wrapper "test-wrapper" is for FIELD resolvers and can't wrap ["Nameable", "undefined"].`,
      );
    });
  });
});

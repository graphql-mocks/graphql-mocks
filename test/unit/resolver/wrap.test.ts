import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';
import { wrapResolver } from '../../../src/resolver/wrap';
import { generatePackOptions, userObjectType, userObjectNameField } from '../../mocks';
import { GraphQLSchema } from 'graphql';
import { WrapperOptionsBase, FieldResolver, FieldWrapperFunction } from '../../../src/types';

describe('resolver/wrap', function () {
  let resolverWrapperOptions: WrapperOptionsBase;
  const parent = {};
  const args = {};
  const info = {};
  const context = {};
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
    const wrappedResolver = await wrapResolver(
      resolver,
      [resolverWrapper as FieldWrapperFunction],
      resolverWrapperOptions,
    );
    expect(resolverWrapper.called).to.be.true;
    expect(resolverWrapper.firstCall.args).to.deep.equal([resolver, resolverWrapperOptions]);

    expect(internalWrapperSpy.called).to.be.false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    wrappedResolver(parent, args, context, info as any);
    expect(internalWrapperSpy.called).to.be.true;
    expect(resolver.called).to.be.true;
    expect(resolver.firstCall.args).to.deep.equal([parent, args, info, context]);
  });

  it('can wrap a resolver function with multiple resolver wrappers', async function () {
    const wrappedResolver = await wrapResolver(
      resolver,
      // using the same resolverWrapper twice
      [resolverWrapper as FieldWrapperFunction, resolverWrapper as FieldWrapperFunction],
      resolverWrapperOptions,
    );
    expect(resolverWrapper.callCount).to.equal(2);
    expect(internalWrapperSpy.called).to.be.false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    wrappedResolver(parent, args, context, info as any);
    expect(internalWrapperSpy.callCount).to.equal(2);
    expect(resolver.callCount).to.equal(1);
    expect(resolver.firstCall.args).to.deep.equal([parent, args, info, context]);
  });

  it('throws an error if a wrapper does not return a function', async function () {
    let error: Error | null = null;

    try {
      await wrapResolver(
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
});

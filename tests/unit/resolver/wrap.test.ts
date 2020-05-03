import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';
import { wrapResolver } from '../../../src/resolver/wrap';
import { generatePackOptions, userObjectType, userObjectNameField } from '../../mocks';
import { ResolverWrapper, ResolverWrapperOptions, Resolver } from '../../../src/types';

describe('resolver/wrap', function () {
  let resolverWrapperOptions: ResolverWrapperOptions;
  const parent = {};
  const args = {};
  const info = {};
  const context = {};
  let resolver: SinonSpy;
  let internalWrapperSpy: SinonSpy;
  let resolverWrapper: SinonSpy;

  beforeEach(() => {
    resolverWrapperOptions = {
      packOptions: generatePackOptions(),
      type: userObjectType,
      field: userObjectNameField,
      resolvers: {},
    };

    resolver = spy();
    internalWrapperSpy = spy();
    resolverWrapper = spy((resolver, _options) => {
      return (parent: any, args: any, context: any, info: any) => {
        internalWrapperSpy();
        return resolver(parent, args, context, info);
      };
    });
  });

  it('can wrap a resolver function', function () {
    const wrappedResolver = wrapResolver(resolver, [resolverWrapper as ResolverWrapper], resolverWrapperOptions);
    expect(resolverWrapper.called).to.be.true;
    expect(resolverWrapper.firstCall.args).to.deep.equal([resolver, resolverWrapperOptions]);

    expect(internalWrapperSpy.called).to.be.false;
    wrappedResolver(parent, args, info, context);
    expect(internalWrapperSpy.called).to.be.true;
    expect(resolver.called).to.be.true;
    expect(resolver.firstCall.args).to.deep.equal([parent, args, info, context]);
  });

  it('can wrap a resolver function with multiple resolver wrappers', function () {
    const wrappedResolver = wrapResolver(
      resolver,
      // using the same resolverWrapper twice
      [resolverWrapper as ResolverWrapper, resolverWrapper as ResolverWrapper],
      resolverWrapperOptions,
    );
    expect(resolverWrapper.callCount).to.equal(2);
    expect(internalWrapperSpy.called).to.be.false;
    wrappedResolver(parent, args, info, context);
    expect(internalWrapperSpy.callCount).to.equal(2);
    expect(resolver.callCount).to.equal(1);
    expect(resolver.firstCall.args).to.deep.equal([parent, args, info, context]);
  });

  it('throws an error if a wrapper does not return a function', function () {
    expect(() =>
      wrapResolver(
        resolver,
        [() => ('resolver wrapper returning a string' as unknown) as Resolver],
        resolverWrapperOptions,
      ),
    ).to.throw(`Wrapper: () => 'resolver wrapper returning a string'

This wrapper did not return a function, got string.`);
  });
});

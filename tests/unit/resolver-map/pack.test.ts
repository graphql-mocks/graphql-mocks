import { expect } from 'chai';
import { pack } from '../../../src/resolver-map/pack';
import { ResolverMapWrapper } from '../../../src/types';
import sinon from 'sinon';

describe('wrap', function () {
  it('reduces a set of resolvers', function () {
    const resolvers = {};
    const wrappers: ResolverMapWrapper[] = [
      function (resolvers) {
        resolvers.Type = {};
        // eslint-disable-next-line
        resolvers.Type.field = () => {};

        return resolvers;
      },
    ];

    const { resolvers: wrappedResolvers } = pack(resolvers, wrappers);

    expect(resolvers).to.deep.equal({}, 'original resolvers are untouched');
    expect(wrappedResolvers).to.have.property('Type');
    expect(wrappedResolvers.Type).to.have.property('field');
  });

  it('includes the packOptions in resolver context by default', function () {
    const queryHelloSpy = sinon.spy();
    const wrappers: ResolverMapWrapper[] = [];

    const resolvers = {
      Query: {
        hello: queryHelloSpy,
      },
    };

    const packOptions = {
      state: { value: 'hello world' },
      dependencies: {
        commonDependency: {},
      },
    };

    const { resolvers: wrappedResolvers } = pack(resolvers, wrappers, packOptions);
    wrappedResolvers.Query.hello({}, {}, {}, {});

    expect(queryHelloSpy.called).to.be.true;
    const [, , context] = queryHelloSpy.firstCall.args;
    expect(context.pack).to.deep.equal(packOptions);
  });
});

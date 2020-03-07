import { wrap } from '../../../src/resolver-map/wrap';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { ResolverMap } from '../../../src/types';

const mockPackOptions = { packState: {} };

describe('wrap', function() {
  it('passes arguments through to the wrapper function', function() {
    const resolverMap: ResolverMap = {
      Query: {
        // eslint-disable-next-line
        rootQueryField: () => {},
      },
    };

    const wrapper: any = sinon.spy((resolverMap: any) => resolverMap);
    const wrappedResolvers = wrap(wrapper)(resolverMap, mockPackOptions);

    expect(wrapper.called).to.be.true;
    expect(wrapper.firstCall.args[0]).to.deep.equal(resolverMap, 'first arg is passed through resolver map');
    expect(wrapper.firstCall.args[1]).to.equal(mockPackOptions, 'second arg is passed through pack options');
    expect(wrappedResolvers).to.not.equal(resolverMap, 'it does not strictly equal the original resolver map');
    expect(wrappedResolvers).deep.equals(resolverMap, 'it does deep equal the original resolver map');
  });

  it('throws if a wrapper does not return an object', function() {
    const resolvers = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapper: any = function() {
      return true;
    };

    const wrapped = wrap(wrapper);

    expect(() => {
      wrapped(resolvers, mockPackOptions);
    }).to.throw('wrapper should return a resolver map object, got boolean');
  });
});

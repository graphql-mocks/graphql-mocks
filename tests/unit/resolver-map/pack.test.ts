import { expect } from 'chai';
import { pack } from '../../../src/resolver-map/pack';
import { ResolverMapWrapper } from '../../../src/types';

describe('wrap', function() {
  it('reduces a set of resolvers', function() {
    const resolvers = {};
    const wrappers: ResolverMapWrapper[] = [
      function(resolvers) {
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
});

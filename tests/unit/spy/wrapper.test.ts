import { spyWrapper } from '../../../src/spy/wrapper';
import { pack } from '../../../src/resolver-map/pack';
import { ResolverMap } from '../../../src/types';
import { expect } from 'chai';

describe('spy/wrapper', function () {
  it('provides accesss to spies on resolvers', function () {
    const resolverMap: ResolverMap = {
      Query: {
        // eslint-disable-next-line
        rootQueryField: () => {},
      },
    };

    const { state, resolvers: wrappedResolvers } = pack(resolverMap, [spyWrapper]);

    const rootQueryFieldSpy = state.spies.Query.rootQueryField;
    expect(rootQueryFieldSpy.called).to.equal(false);

    wrappedResolvers.Query.rootQueryField({}, {}, {}, {});
    expect(rootQueryFieldSpy.called).to.equal(true);
  });
});

import { spyWrapper } from '../../../src/spy/wrapper';
import { pack } from '../../../src/resolver-map/pack';
import { ResolverMap } from '../../../src/types';
import { generateEmptyPackOptions } from '../../mocks';
import { expect } from 'chai';

describe('spy/wrapper', function() {
  it('provides accesss to spies on resolvers', function() {
    const resolverMap: ResolverMap = {
      Query: {
        // eslint-disable-next-line
        rootQueryField: () => {},
      },
    };

    const mockPackOptions = generateEmptyPackOptions();
    const { packState, resolvers: wrappedResolvers } = pack(resolverMap, [spyWrapper], generateEmptyPackOptions());

    const rootQueryFieldSpy = packState.spies.Query.rootQueryField;
    expect(rootQueryFieldSpy.called).to.equal(false);

    wrappedResolvers.Query.rootQueryField({}, {}, {}, {});
    expect(rootQueryFieldSpy.called).to.equal(true);
  });
});

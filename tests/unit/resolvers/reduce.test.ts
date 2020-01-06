import {expect} from 'chai';
import reduce from '../../../src/resolvers/reduce';
import { ResolverReducer } from '../../../src/types';

describe('reduece', function() {
  it('reduces a set of resolvers', function() {
    const resolvers = {};
    const reducers: ResolverReducer[] = [
      function(resolvers)  {
        resolvers.Type = {};
        resolvers.Type.field = () => {}

        return resolvers;
      }
    ];

    const reducedResolvers = reduce({resolvers, reducers});

    expect(resolvers).to.deep.equal({}, 'original resolvers are untouched');
    expect(reducedResolvers).to.have.property('Type');
    expect(reducedResolvers.Type).to.have.property('field');
  });

  it('throws if a reducer does not return an object', function() {
    const resolvers = {};
    const reducers: any[] = [
      function()  {
        return true;
      }
    ];

    expect(() => reduce({resolvers, reducers})).to.throw();
  });
});

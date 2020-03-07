import { wrap } from '../../../src/resolver-map/wrap';
import { expect } from 'chai';

const mockPackOptions = { packState: {} };

describe('wrap', function() {
  it('throws if a wrapper does not return an object', function() {
    const resolvers = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapper: any = function() {
      return true;
    };

    const wrapped = wrap(wrapper);

    expect(() => {
      wrapped(resolvers, mockPackOptions);
    }).to.throw();
  });
});

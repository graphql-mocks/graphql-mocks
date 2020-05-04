import { expect } from 'chai';
import { spyWrapper } from '../../../src/spy/wrapper';
import { generatePackOptions, userObjectType, userObjectNameField } from '../../mocks';
import { Resolver } from '../../../src/types';

describe('spy/wrapper', function () {
  it('provides accesss to spies on resolvers', function () {
    const resolverReturnValue = 'resolver return value!';
    const initialResolver = () => resolverReturnValue;
    const packOptions = generatePackOptions();
    const state = packOptions.state;

    const wrappedResolver = spyWrapper(initialResolver as Resolver, {
      resolvers: {},
      type: userObjectType,
      field: userObjectNameField,
      packOptions: packOptions,
    });

    const resolverSpy = state.spies.User.name;
    expect(resolverSpy.called).to.equal(false);

    wrappedResolver({}, {}, {}, {});
    expect(resolverSpy.called).to.equal(true);
    expect(resolverSpy.firstCall.returnValue).to.equal(resolverReturnValue);
  });
});

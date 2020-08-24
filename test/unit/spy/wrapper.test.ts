import { expect } from 'chai';
import { spyWrapper } from '../../../src/spy/wrapper';
import { generatePackOptions, userObjectType, userObjectNameField } from '../../mocks';
import { GraphQLResolveInfo, GraphQLSchema } from 'graphql';
import { FieldResolver } from '../../../src/types';

describe('spy/wrapper', function () {
  it('provides accesss to spies on resolvers', async function () {
    const resolverReturnValue = 'resolver return value!';
    const initialResolver = (): string => resolverReturnValue;
    const packOptions = generatePackOptions();
    const state = packOptions.state;

    const wrappedResolver = await spyWrapper(initialResolver as FieldResolver, {
      schema: {} as GraphQLSchema,
      resolverMap: {},
      type: userObjectType,
      field: userObjectNameField,
      packOptions: packOptions,
    });

    const resolverSpy = state.spies.User.name;
    expect(resolverSpy.called).to.equal(false);

    wrappedResolver({}, {}, {}, {} as GraphQLResolveInfo);
    expect(resolverSpy.called).to.equal(true);
    expect(resolverSpy.firstCall.returnValue).to.equal(resolverReturnValue);
  });
});

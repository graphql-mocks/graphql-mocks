import { expect } from 'chai';
import { spyWrapper } from '../../../src/wrapper';
import { generatePackOptions, userObjectType, userObjectNameField } from '../../mocks';
import { GraphQLResolveInfo, GraphQLSchema } from 'graphql';
import { FieldResolver } from '../../../src/types';

describe('wrapper/spy', function () {
  it('provides accesss to spies on resolvers', async function () {
    const resolverReturnValue = 'resolver return value!';
    const initialResolver = (): string => resolverReturnValue;
    const packOptions = generatePackOptions();
    const state = packOptions.state;

    const wrappedResolver = (await spyWrapper.wrap(initialResolver as FieldResolver, {
      schema: {} as GraphQLSchema,
      resolverMap: {},
      type: userObjectType,
      field: userObjectNameField,
      packOptions: packOptions,
    })) as FieldResolver;

    const resolverSpy = state.spies.User.name;
    expect(resolverSpy.called).to.equal(false);

    wrappedResolver({}, {}, {}, ({} as unknown) as GraphQLResolveInfo);
    expect(resolverSpy.called).to.equal(true);
    expect(resolverSpy.firstCall.returnValue).to.equal(resolverReturnValue);
  });
});

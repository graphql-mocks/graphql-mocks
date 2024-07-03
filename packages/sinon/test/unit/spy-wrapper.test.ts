import { expect } from 'chai';
import { spyWrapper } from '../../src/spy-wrapper';
import { buildSchema, GraphQLObjectType, GraphQLResolveInfo } from 'graphql';
import { FieldResolver } from 'graphql-mocks/types';

describe('spy-wrapper', function () {
  const schema = buildSchema(`
    schema {
      query: Query
    }

    type Query {
      user: User
    }

    type User {
      name: String
    }
  `);

  const userObjectType = schema.getType('User') as GraphQLObjectType;
  const userObjectNameField = userObjectType.getFields().name;

  it('provides accesss to spies on resolvers', async function () {
    const resolverReturnValue = 'resolver return value!';
    const initialResolver = (): string => resolverReturnValue;
    const packOptions = { dependencies: {}, state: {} };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = packOptions.state as any;

    const wrappedResolver = (await spyWrapper.wrap(initialResolver as FieldResolver, {
      schema,
      resolverMap: {},
      type: userObjectType,
      field: userObjectNameField,
      packOptions: packOptions,
    })) as FieldResolver;

    const resolverSpy = state.spies.User.name;
    expect(resolverSpy.called).to.equal(false);

    wrappedResolver({}, {}, {}, {} as unknown as GraphQLResolveInfo);
    expect(resolverSpy.called).to.equal(true);
    expect(resolverSpy.firstCall.returnValue).to.equal(resolverReturnValue);
  });
});

import { logWrapper } from '../../../src/wrapper';
import { ResolverMap, FieldResolver, TypeResolver } from '../../../src/types';
import { expect } from 'chai';
import { stub, SinonStub } from 'sinon';
import { generatePackOptions, userObjectType, userObjectNameField, nameableInterfaceType } from '../../mocks';
import { GraphQLResolveInfo, GraphQLSchema, GraphQLInterfaceType } from 'graphql';

describe('wrapper/log', function () {
  let logStub: SinonStub;

  beforeEach(function () {
    logStub = stub<Console, 'log'>(console, 'log');
  });

  afterEach(function () {
    logStub.restore();
  });

  it('logs details around field resolvers', async function () {
    const initialResolver = (): string => 'hello world';

    const wrappedResolver = (await logWrapper.wrap(initialResolver, {
      schema: {} as unknown as GraphQLSchema,
      resolverMap: {} as ResolverMap,
      type: userObjectType,
      field: userObjectNameField,
      packOptions: generatePackOptions(),
    })) as FieldResolver;

    await wrappedResolver({ parent: 'parent' }, { args: 'args' }, { context: 'context' }, {
      info: 'info',
    } as unknown as GraphQLResolveInfo);

    const logCalls = logStub
      .getCalls()
      .map((call) => call.args[0])
      .join('\n');

    expect(logCalls).to.equal(`--- START: field resolver on User.name ---

parent:
{
  "parent": "parent"
}

args:
{
  "args": "args"
}

result:
"hello world"

--- END: field resolver on User.name ---`);
  });

  it('logs details around type resolvers', async function () {
    const initialResolver = (): string => 'hello world';

    const wrappedResolver = (await logWrapper.wrap(initialResolver, {
      schema: {} as unknown as GraphQLSchema,
      resolverMap: {} as ResolverMap,
      type: nameableInterfaceType,
      packOptions: generatePackOptions(),
    })) as TypeResolver;

    await wrappedResolver(
      { value: 'value' },
      { context: 'context' },
      { info: 'info' } as unknown as GraphQLResolveInfo,
      {
        abstractType: 'abstractType',
      } as unknown as GraphQLInterfaceType,
    );

    const logCalls = logStub
      .getCalls()
      .map((call) => call.args[0])
      .join('\n');

    expect(logCalls).to.equal(`--- START: type resolver on Nameable ---

value:
{
  "value": "value"
}

result:
"hello world"

--- END: type resolver on Nameable ---`);
  });
});

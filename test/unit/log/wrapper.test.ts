import { logWrapper } from '../../../src/log/wrapper';
import { ResolverMap, FieldResolver } from '../../../src/types';
import { expect } from 'chai';
import { stub, SinonStub } from 'sinon';
import { generatePackOptions, userObjectType, userObjectNameField } from '../../mocks';
import { GraphQLResolveInfo, GraphQLSchema } from 'graphql';

describe('log/wrapper', function () {
  let logStub: SinonStub;

  beforeEach(function () {
    logStub = stub<Console, 'log'>(console, 'log');
  });

  afterEach(function () {
    logStub.restore();
  });

  it('logs details around calling resolvers', async function () {
    const initialResolver = (() => ({ 'the result': 'has been returned' })) as FieldResolver;
    const wrappedResolver = await logWrapper(initialResolver, {
      schema: ({} as unknown) as GraphQLSchema,
      resolverMap: {} as ResolverMap,
      type: userObjectType,
      field: userObjectNameField,
      packOptions: generatePackOptions(),
    });

    await wrappedResolver({ parent: 'parent' }, { args: 'args' }, { context: 'context' }, ({
      info: 'info',
    } as unknown) as GraphQLResolveInfo);

    const logCalls = logStub
      .getCalls()
      .map((call) => call.args[0])
      .join('\n');

    expect(logCalls).to.equal(`--- resolver start for User.name---

parent:
{
  "parent": "parent"
}

args:
{
  "args": "args"
}

result:
{
  "the result": "has been returned"
}

--- resolver end for User.name---`);
  });
});

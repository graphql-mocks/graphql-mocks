import { logWrapper } from '../../../src/log/wrapper';
import { ResolverMap, Resolver } from '../../../src/types';
import { expect } from 'chai';
import { stub, SinonStub } from 'sinon';
import { generatePackOptions, userObjectType, userObjectNameField } from '../../mocks';
import { GraphQLResolveInfo } from 'graphql';

describe('log/wrapper', function () {
  let logStub: SinonStub;

  beforeEach(() => {
    logStub = stub<Console, any>(console, 'log');
  });

  afterEach(() => {
    logStub.restore();
  });

  it('logs details around calling resolvers', async function () {
    const initialResolver = (() => ({})) as Resolver;
    const wrappedResolver = logWrapper(initialResolver, {
      resolvers: {} as ResolverMap,
      type: userObjectType,
      field: userObjectNameField,
      packOptions: generatePackOptions(),
    });

    wrappedResolver({ parent: 'parent' }, { args: 'args' }, { context: 'context' }, ({
      info: 'info',
    } as unknown) as GraphQLResolveInfo);

    const logCalls = logStub.getCalls().map((call) => call.args[0]);
    expect(logCalls).to.deep.equal([
      'Resolver for type: "User" field: "name"',
      'parent: {"parent":"parent"}',
      'args: {"args":"args"}',
      `context: {"context":"context"}`,
      'info: {"info":"info"}',
    ]);
  });
});

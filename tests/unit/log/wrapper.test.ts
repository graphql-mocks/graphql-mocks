import { logWrapper } from '../../../src/log/wrapper';
import { pack } from '../../../src/resolver-map/pack';
import { ResolverMap } from '../../../src/types';
import { expect } from 'chai';
import { stub, SinonStub } from 'sinon';

describe('log/wrapper', function() {
  let logStub: SinonStub;

  beforeEach(() => {
    logStub = stub<Console, any>(console, 'log');
  });

  afterEach(() => {
    logStub.restore();
  });

  it('logs details around calling resoslvers', async function() {
    const resolverMap: ResolverMap = {
      Query: {
        // eslint-disable-next-line
        rootQueryField: async () => {
          return {};
        },
      },
    };

    const { resolvers: wrappedResolvers } = pack(resolverMap, [logWrapper]);
    wrappedResolvers.Query.rootQueryField('parent', 'args', 'context', 'info');
    const logCalls = logStub.getCalls().map(call => call.args[0]);
    expect(logCalls).to.deep.equal([
      'Resolver for type: "Query" field: "rootQueryField"',
      'parent: "parent"',
      'args: "args"',
      'context: "context"',
      'info: "info"',
    ]);
  });
});

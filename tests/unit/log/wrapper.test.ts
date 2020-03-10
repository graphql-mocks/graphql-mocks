import { logWrapper } from '../../../src/log/wrapper';
import { pack } from '../../../src/resolver-map/pack';
import { ResolverMap } from '../../../src/types';
import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';

describe('log/wrapper', function() {
  let logSpy: SinonSpy;

  beforeEach(() => {
    logSpy = spy<Console, any>(console, 'log');
  });

  afterEach(() => {
    logSpy.restore();
  });

  it('logs details around calling resolvers', async function() {
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
    const logCalls = logSpy.getCalls().map(call => call.args[0]);
    expect(logCalls).to.deep.equal([
      'Resolver for type: "Query" field: "rootQueryField"',
      'parent: "parent"',
      'args: "args"',
      'context: "context"',
      'info: "info"',
    ]);
  });
});

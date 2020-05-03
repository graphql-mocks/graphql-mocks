import { buildSchema } from 'graphql';
import { logWrapper } from '../../../src/log/wrapper';
import { pack } from '../../../src/resolver-map/pack';
import { ResolverMap } from '../../../src/types';
import { expect } from 'chai';
import { stub, SinonStub } from 'sinon';
import { generatePackOptions } from '../../mocks';
import { wrapEachField } from '../../../src/resolver-map/wrap-each-field';

describe('log/wrapper', function () {
  let logStub: SinonStub;

  beforeEach(() => {
    logStub = stub<Console, any>(console, 'log');
  });

  afterEach(() => {
    logStub.restore();
  });

  it('logs details around calling resolvers', async function () {
    const schema = buildSchema(`type Query { rootQueryField: String!}`);
    const resolverMap: ResolverMap = {
      Query: {
        // eslint-disable-next-line
        rootQueryField: async () => {
          return {};
        },
      },
    };

    const { resolvers: wrappedResolvers } = pack(resolverMap, [wrapEachField([logWrapper])], {
      dependencies: { graphqlSchema: schema },
    });

    wrappedResolvers.Query.rootQueryField(
      { parent: 'parent' },
      { args: 'args' },
      { context: 'context' },
      { info: 'info' },
    );

    const logCalls = logStub.getCalls().map((call) => call.args[0]);
    expect(logCalls).to.deep.equal([
      'Resolver for type: "Query" field: "rootQueryField"',
      'parent: {"parent":"parent"}',
      'args: {"args":"args"}',
      `context: {"context":"context","pack":${JSON.stringify(
        generatePackOptions({ dependencies: { graphqlSchema: schema } }),
      )}}`,
      'info: {"info":"info"}',
    ]);
  });
});

import { buildSchema } from 'graphql';
import { performanceWrapper } from '../../../src/performance/wrapper';
import { pack } from '../../../src/resolver-map/pack';
import { ResolverMap } from '../../../src/types';
import { expect } from 'chai';
import { wrapEachField } from '../../../src/resolver-map/wrap-each-field';

describe('performance/wrapper', function () {
  it('provides accesss to spies on resolvers', async function () {
    const RESOLVER_RUN_TIME_DELAY = 500;
    const graphqlSchema = buildSchema(`type Query {
      rootQueryField: String!
    }`);

    const resolverMap: ResolverMap = {
      Query: {
        // eslint-disable-next-line
        rootQueryField: async () => {
          return new Promise((resolve) => setTimeout(resolve, RESOLVER_RUN_TIME_DELAY));
        },
      },
    };

    const { state, resolvers: wrappedResolvers } = pack(resolverMap, [wrapEachField([performanceWrapper])], {
      dependencies: { graphqlSchema },
    });

    const rootQueryFieldPerformance = state.performance.Query.rootQueryField;
    expect(rootQueryFieldPerformance).to.deep.equal([]);

    await wrappedResolvers.Query.rootQueryField({}, {}, {}, {});
    expect(rootQueryFieldPerformance.length).to.equal(1);

    const [timeElapsed] = rootQueryFieldPerformance;

    expect(timeElapsed).to.be.above(
      RESOLVER_RUN_TIME_DELAY,
      `the resolver takes at least as long as the timeout, took ${timeElapsed}`,
    );
    expect(timeElapsed).to.be.below(
      RESOLVER_RUN_TIME_DELAY + 100,
      `Warning: possibly flakey test, depends on how quick the test runs\n\n the resolver runs within 100ms, took ${timeElapsed}`,
    );
  });
});

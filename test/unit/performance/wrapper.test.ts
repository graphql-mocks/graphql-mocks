import { performanceWrapper } from '../../../src/performance/wrapper';
import { ResolverMap, Resolver } from '../../../src/types';
import { expect } from 'chai';
import { generatePackOptions, userObjectType, userObjectNameField } from '../../mocks';
import { GraphQLResolveInfo } from 'graphql';

describe('performance/wrapper', function () {
  it('provides accesss to spies on resolvers', async function () {
    const RESOLVER_RUN_TIME_DELAY = 250;

    const resolver: Resolver = async () => {
      return new Promise((resolve) => setTimeout(resolve, RESOLVER_RUN_TIME_DELAY));
    };

    const packOptions = generatePackOptions();
    const state = packOptions.state;
    const wrappedResolver = performanceWrapper(resolver, {
      resolvers: {} as ResolverMap,
      type: userObjectType,
      field: userObjectNameField,
      packOptions,
    });

    const nameFieldResolverPerformance = state.performance.User.name;
    expect(nameFieldResolverPerformance).to.deep.equal([]);

    await wrappedResolver({}, {}, {}, {} as GraphQLResolveInfo);
    expect(nameFieldResolverPerformance.length).to.equal(1);

    const [timeElapsed] = nameFieldResolverPerformance;

    console.log(`performance/wrapper resolver took ${timeElapsed}`);
    expect(timeElapsed).to.be.above(RESOLVER_RUN_TIME_DELAY);

    expect(timeElapsed).to.be.below(
      RESOLVER_RUN_TIME_DELAY + 100,
      `Warning: possibly flakey test, depends on how quick the test runs\n\n the resolver runs within 100ms, took ${timeElapsed}`,
    );
  });
});

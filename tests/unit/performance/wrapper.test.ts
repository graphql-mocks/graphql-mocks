import { performanceWrapper } from '../../../src/performance/wrapper';
import { ResolverMap } from '../../../src/types';
import { expect } from 'chai';
import { generatePackOptions, userObjectType, userObjectNameField } from '../../mocks';

describe('performance/wrapper', function () {
  it('provides accesss to spies on resolvers', async function () {
    const RESOLVER_RUN_TIME_DELAY = 500;

    const resolver = async () => {
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

    await wrappedResolver({}, {}, {}, {});
    expect(nameFieldResolverPerformance.length).to.equal(1);

    const [timeElapsed] = nameFieldResolverPerformance;

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

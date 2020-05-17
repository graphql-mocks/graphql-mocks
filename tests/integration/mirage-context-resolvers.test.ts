import { expect } from 'chai';
import { buildHandler, graphqlSchema } from './test-helpers/executable-schema';
import defaultResolvers from './test-helpers/mirage-static-resolvers';
import { server as mirageServer } from './test-helpers/mirage-sample';
import defaultScenario from './test-helpers/mirage-sample/scenarios/default';
import { pack } from '../../src/resolver-map/pack';
import { ResolverMapWrapper } from '../../src/types';

const emptyWrappers: ResolverMapWrapper[] = [];

const { resolvers } = pack(defaultResolvers, emptyWrappers, {
  state: {},
  dependencies: {
    mirageServer,
    graphqlSchema,
  },
});

const graphQLHandler = buildHandler(resolvers);

describe('it can resolve from basic resolvers', function () {
  beforeEach(() => {
    mirageServer.db.loadData(defaultScenario);
  });

  afterEach(() => {
    mirageServer.db.emptyData();
  });

  it('handles a root query (scalar)', async function () {
    const query = `query {
      hello
    }`;

    const result = await graphQLHandler(query);
    expect(result).to.deep.equal({
      data: {
        hello: 'hi',
      },
    });
  });

  it('handles a root query (custom type)', async function () {
    const query = `query {
      person(id: 1) {
        name
        age
      }
    }`;

    const result = await graphQLHandler(query);
    expect(result).to.deep.equal({
      data: {
        person: {
          name: 'Fred Flinstone',
          age: 43,
        },
      },
    });
  });

  it('handles nested objects', async function () {
    const query = `query {
      person(id: 1) {
        name
        age
        friends {
          name
          age
        }
      }
    }`;

    const result = await graphQLHandler(query);
    expect(result).to.deep.equal({
      data: {
        person: {
          name: 'Fred Flinstone',
          age: 43,
          friends: [
            {
              name: 'Barney Rubble',
              age: 40,
            },
            {
              name: 'Wilma Flinstone',
              age: 40,
            },
          ],
        },
      },
    });
  });
});

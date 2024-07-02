import { expect } from 'chai';
import { buildSchema, GraphQLSchema, GraphQLResolveInfo } from 'graphql';
import { layer } from '../../../src/resolver-map/layer';
import { generatePackOptions } from '../../mocks';
import { spy, SinonSpy } from 'sinon';
import { ResolverInfo, FieldResolver } from '../../../src/types';
import { PackOptions } from '../../../src/pack/types';

describe('resolver-map/layer', function () {
  let graphqlSchema: GraphQLSchema;
  let packOptions: PackOptions;

  beforeEach(function () {
    graphqlSchema = buildSchema(`
      schema {
        query: Query
      }

      type Query {
        person: String
        existing: String
      }

      type Person implements Nameable {
        name: String
      }

      interface Nameable {
        name: String
      }
    `);

    packOptions = generatePackOptions({ dependencies: { graphqlSchema } });
  });

  it('can apply resolver map layers', async function () {
    const queryPersonResolver = spy();
    const queryExistingResolver = (): string => 'noop';

    const layeredMiddleware = layer([
      {
        Query: {
          person: queryPersonResolver,
        },
      },
    ]);

    const resolverMap = await layeredMiddleware(
      {
        Query: {
          existing: queryExistingResolver,
        },
      },
      packOptions,
    );

    expect(resolverMap?.Query?.existing, 'existing resolver to still be in the resolver map').to.exist;
    expect(resolverMap?.Query?.person, 'person resolver to be added').to.exist;

    resolverMap.Query.person({}, {}, {}, {} as ResolverInfo);
    expect(queryPersonResolver.called).to.be.true;
  });

  it('can fold multiple layers together', async function () {
    const queryPersonResolver = spy();
    const personNameResolver = spy();
    const queryExistingResolver = (): string => 'noop';

    const layeredMiddleware = layer([
      {
        Query: {
          person: queryPersonResolver,
        },
      },
      {
        Person: {
          name: personNameResolver,
        },
      },
    ]);

    const resolverMap = await layeredMiddleware(
      {
        Query: {
          existing: queryExistingResolver,
        },
      },
      packOptions,
    );

    expect(resolverMap?.Query?.existing, 'existing resolver to still be in the resolver map').to.exist;
    expect(resolverMap?.Query?.person, 'Query.person resolver to be added').to.exist;
    expect(resolverMap?.Person?.name, 'Person.name resolver to be added').to.exist;

    resolverMap.Query.person({}, {}, {}, {} as ResolverInfo);
    resolverMap.Person.name({}, {}, {}, {} as ResolverInfo);
    expect(queryPersonResolver.called).to.be.true;
    expect(personNameResolver.called).to.be.true;
  });

  it('replaces the previous resolver map partial', async function () {
    const firstQueryPersonResolver: FieldResolver & SinonSpy = spy();
    const secondQueryPersonResolver: FieldResolver & SinonSpy = spy();

    const layeredMiddleware = layer([
      {
        Query: {
          person: firstQueryPersonResolver,
        },
      },
      {
        Query: {
          person: secondQueryPersonResolver,
        },
      },
    ]);

    const resolverMap = await layeredMiddleware({}, packOptions);

    expect(resolverMap?.Query?.person, 'Query.person resolver to be added').to.exist;

    resolverMap.Query.person({}, {}, {}, {} as ResolverInfo);
    expect(firstQueryPersonResolver.called, 'first added Query.person resolver is not called').to.be.false;
    expect(secondQueryPersonResolver.called, 'second Query.person resolver replaced first and is called').to.be.true;
  });

  it('can fold in type resolvers', async function () {
    const nameableTypeResolver = spy();

    const layeredMiddleware = layer([
      {
        Nameable: {
          __resolveType: nameableTypeResolver,
        },
      },
    ]);

    const resolverMap = await layeredMiddleware({}, packOptions);
    expect(resolverMap.Nameable.__resolveType).exist;
  });

  it('includes the packOptions in context by default', async function () {
    const queryPersonResolver: FieldResolver & SinonSpy = spy();

    const layeredMiddleware = layer([
      {
        Query: {
          person: queryPersonResolver,
        },
      },
    ]);

    const resolverMap = await layeredMiddleware({}, packOptions);
    const initialContext = { initialContext: true };
    resolverMap.Query.person({}, {}, initialContext, {} as ResolverInfo);
    const calledContext = queryPersonResolver.firstCall.args[2];
    expect(calledContext).to.deep.equal({
      initialContext: true,
      pack: {
        dependencies: {
          graphqlSchema: graphqlSchema,
        },
        state: {},
      },
    });
  });

  context('replace option', function () {
    let existingQueryPersonResolver: FieldResolver & SinonSpy;
    let newQueryPersonResolver: FieldResolver & SinonSpy;

    beforeEach(function () {
      existingQueryPersonResolver = spy();
      newQueryPersonResolver = spy();
    });

    it('refuses to replace an existing resolver with replace being false by default', async function () {
      const layeredMiddleware = layer([
        {
          Query: {
            person: newQueryPersonResolver,
          },
        },
      ]);

      let error: Error | undefined = undefined;
      try {
        await layeredMiddleware(
          {
            Query: {
              person: existingQueryPersonResolver,
            },
          },
          packOptions,
        );
      } catch (e) {
        error = e as Error;
      }

      expect(error?.message).to.deep.equal(
        'Cannot add resolver to resolver map at Query,person because a resolver already exists and the replace is set to false',
      );
    });

    it('refuses to replace an existing resolver when replace is set to false', async function () {
      const layeredMiddleware = layer(
        [
          {
            Query: {
              person: newQueryPersonResolver,
            },
          },
        ],
        { replace: false },
      );

      let error: Error | undefined = undefined;
      try {
        await layeredMiddleware(
          {
            Query: {
              person: existingQueryPersonResolver,
            },
          },
          packOptions,
        );
      } catch (e) {
        error = e as Error;
      }

      expect(error?.message).to.deep.equal(
        'Cannot add resolver to resolver map at Query,person because a resolver already exists and the replace is set to false',
      );
    });

    it('replaces an existing resolver when replace is set to true', async function () {
      const layeredMiddleware = layer(
        [
          {
            Query: {
              person: newQueryPersonResolver,
            },
          },
        ],
        { replace: true },
      );

      const resolverMap = await layeredMiddleware(
        {
          Query: {
            person: existingQueryPersonResolver,
          },
        },
        packOptions,
      );

      expect(resolverMap?.Query?.person).to.exist;
      resolverMap.Query?.person({}, {}, {}, {} as GraphQLResolveInfo);
      expect(existingQueryPersonResolver.called).to.be.false;
      expect(newQueryPersonResolver.called).to.be.true;
    });
  });

  context('wrappers option', function () {
    it('applies wrappers to layered resolvers', async function () {
      const queryPersonResolver = spy();

      const firstWrapper = spy(function (resolver) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (a: any, b: any, c: any, d: any): any => {
          resolver(a, b, c, d);
        };
      });

      const secondWrapper = spy(function (resolver) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (a: any, b: any, c: any, d: any): any => {
          resolver(a, b, c, d);
        };
      });

      const layeredMiddleware = layer(
        [
          {
            Query: {
              person: queryPersonResolver,
            },
          },
        ],
        { wrappers: [firstWrapper, secondWrapper] },
      );

      const resolverMap = await layeredMiddleware({}, packOptions);

      expect(resolverMap?.Query?.person).to.exist;
      resolverMap.Query?.person({}, {}, {}, {} as GraphQLResolveInfo);

      expect(firstWrapper.called).to.be.true;
      expect(secondWrapper.called).to.be.true;
      expect(queryPersonResolver.called).to.be.true;
    });
  });
});

import { expect } from 'chai';
import { wrapEachField } from '../../../src/resolver-map/wrap-each-field';
import { generatePackOptions } from '../../mocks';
import * as sinon from 'sinon';
import { GraphQLSchema, buildSchema, GraphQLResolveInfo } from 'graphql';
import { ResolverWrapper, ResolverMap, ResolverMapMiddleware, Resolver } from '../../../src/types';
import { SinonSpy } from 'sinon';

describe('resolver-map/wrap-each-field', function () {
  let graphqlSchema: GraphQLSchema;
  let resolverMap: ResolverMap<Resolver & SinonSpy>;
  let resolverWrapper: ResolverWrapper & SinonSpy;
  let resolverMapMiddleware: ResolverMapMiddleware;
  let wrappedResolverMap: ResolverMap;
  let queryFieldSpy: SinonSpy;
  let fieldResolverOnSomeTypeSpy: SinonSpy;

  beforeEach(() => {
    graphqlSchema = buildSchema(`
      type Query {
        field: String!
      }

      type SomeType {
        fieldResolverOnSomeType: String!
      }
    `);

    queryFieldSpy = sinon.spy();
    fieldResolverOnSomeTypeSpy = sinon.spy();

    resolverMap = {
      Query: {
        field: queryFieldSpy,
      },

      SomeType: {
        fieldResolverOnSomeType: fieldResolverOnSomeTypeSpy,
      },
    };

    resolverWrapper = sinon.spy((resolver) => {
      // returns a new function that wraps the existing resolver
      return sinon.spy(resolver);
    });
  });

  it('wraps resolver functions in resolver map', () => {
    resolverMapMiddleware = wrapEachField([resolverWrapper]);
    wrappedResolverMap = resolverMapMiddleware(resolverMap, generatePackOptions({ dependencies: { graphqlSchema } }));

    expect(resolverWrapper.called).to.be.true;
    expect(resolverWrapper.callCount).to.equal(2, 'one wrapper for for each resolver');

    // firstCall for wrapping Query.field
    const firstCallPackOptions = resolverWrapper.firstCall.args[1];
    expect([firstCallPackOptions.type.name, firstCallPackOptions.field.name]).to.deep.equal(
      ['Query', 'field'],
      'first call second arg has correct path',
    );

    // secondCall for wrapping SomeType.fieldResolverOnSomeType
    const secondCallPackOptions = resolverWrapper.secondCall.args[1];
    expect([secondCallPackOptions.type.name, secondCallPackOptions.field.name]).to.deep.equal(
      ['SomeType', 'fieldResolverOnSomeType'],
      'second call second arg matches',
    );

    // types of wrapped resolvers are both functions
    expect(typeof wrappedResolverMap.Query.field).to.equal('function');
    expect(typeof wrappedResolverMap.SomeType.fieldResolverOnSomeType).to.equal('function');

    // initially none of the resolvers have been called
    expect(queryFieldSpy.called).to.equal(false, 'original Query.field has not been called');
    expect(fieldResolverOnSomeTypeSpy.called).to.equal(
      false,
      'original SomeType.fieldResolverOnSomeType has not been called',
    );

    // call only wrapped resolvers and they should in turn call the original
    wrappedResolverMap.Query.field({ parent: 'query-field' }, { args: 'query-field' }, { context: 'query-field' }, ({
      info: 'query-field',
    } as unknown) as GraphQLResolveInfo);

    wrappedResolverMap.SomeType.fieldResolverOnSomeType(
      { parent: 'sometype-field-resolver' },
      { args: 'sometype-field-resolver' },
      { context: 'sometype-field-resolver' },
      ({ info: 'sometype-field-resolver' } as unknown) as GraphQLResolveInfo,
    );

    // calling the wrapped functions calls the inner function
    // since the function passed to wrapEach wraps the passed in function
    expect(queryFieldSpy.called).to.equal(true, 'original Query.field has been called');
    expect(fieldResolverOnSomeTypeSpy.called).to.equal(
      true,
      'original SomeType.fieldResolverOnSomeType has been called',
    );

    expect(queryFieldSpy.firstCall.args).to.deep.equal([
      { parent: 'query-field' },
      { args: 'query-field' },
      { context: 'query-field', pack: generatePackOptions(generatePackOptions({ dependencies: { graphqlSchema } })) },
      { info: 'query-field' },
    ]);

    expect(fieldResolverOnSomeTypeSpy.firstCall.args).to.deep.equal([
      { parent: 'sometype-field-resolver' },
      { args: 'sometype-field-resolver' },
      {
        context: 'sometype-field-resolver',
        pack: generatePackOptions(generatePackOptions({ dependencies: { graphqlSchema } })),
      },
      { info: 'sometype-field-resolver' },
    ]);
  });
});

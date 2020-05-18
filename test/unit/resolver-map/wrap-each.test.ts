import { expect } from 'chai';
import { wrapEachField } from '../../../src/resolver-map/wrap-each-field';
import { generatePackOptions } from '../../mocks';
import * as sinon from 'sinon';
import cloneDeep from 'lodash.clonedeep';
import { GraphQLSchema, buildSchema, GraphQLResolveInfo } from 'graphql';
import { ResolverWrapper, ResolverMap, ResolverMapWrapper, Resolver } from '../../../src/types';
import { SinonSpy } from 'sinon';

describe('wrapEach', function () {
  let graphqlSchema: GraphQLSchema;
  let originalResolverMap: ResolverMap<Resolver & SinonSpy>;
  let resolverWrapper: ResolverWrapper & SinonSpy;
  let resolverMapWrapper: ResolverMapWrapper;
  let wrappedResolverMap: ResolverMap;
  let clonedResolverMap: ResolverMap;

  beforeEach(() => {
    graphqlSchema = buildSchema(`
      type Query {
        field: String!
      }

      type SomeType {
        fieldResolverOnSomeType: String!
      }
    `);

    originalResolverMap = {
      Query: {
        field: sinon.spy(),
      },

      SomeType: {
        fieldResolverOnSomeType: sinon.spy(),
      },
    };

    // the pack process will give a deep cloned resolver map
    // to ensure that the original isn't modified
    clonedResolverMap = cloneDeep(originalResolverMap);

    resolverWrapper = sinon.spy((resolver) => {
      // returns a new function that wraps the existing resolver
      return sinon.spy(resolver);
    });
  });

  it('wraps each individual resolver fn in resolver map', function () {
    resolverMapWrapper = wrapEachField([resolverWrapper]);
    wrappedResolverMap = resolverMapWrapper(
      clonedResolverMap,
      generatePackOptions({ dependencies: { graphqlSchema } }),
    );

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
    expect(originalResolverMap.Query.field.called).to.equal(false, 'original Query.field has not been called');
    expect(originalResolverMap.SomeType.fieldResolverOnSomeType.called).to.equal(
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
    expect(originalResolverMap.Query.field.called).to.equal(true, 'original Query.field has been called');
    expect(originalResolverMap.SomeType.fieldResolverOnSomeType.called).to.equal(
      true,
      'original SomeType.fieldResolverOnSomeType has been called',
    );

    expect(originalResolverMap.Query.field.firstCall.args).to.deep.equal([
      { parent: 'query-field' },
      { args: 'query-field' },
      { context: 'query-field', pack: generatePackOptions(generatePackOptions({ dependencies: { graphqlSchema } })) },
      { info: 'query-field' },
    ]);

    expect(originalResolverMap.SomeType.fieldResolverOnSomeType.firstCall.args).to.deep.equal([
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

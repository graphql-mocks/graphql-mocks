import { expect } from 'chai';
import { wrapEach } from '../../../src/resolver-map/wrap-each';
import { generateEmptyPackOptions } from '../../mocks';
import * as sinon from 'sinon';
import cloneDeep from 'lodash.clonedeep';

describe('wrapEach', function() {
  let originalResolverMap: any;
  let resolverWrapper: any;
  let resolverMapWrapper: any;
  let wrappedResolverMap: any;
  let clonedResolverMap: any;

  beforeEach(() => {
    originalResolverMap = {
      Query: {
        // eslint-disable-next-line
        field: sinon.spy(),
      },

      SomeType: {
        // eslint-disable-next-line
        fieldResolverOnSomeType: sinon.spy(),
      },
    };

    // the pack process will give a deep cloned resolver map
    // to ensure that the original isn't modified
    clonedResolverMap = cloneDeep(originalResolverMap);

    resolverWrapper = sinon.spy(resolver => {
      // returns a new function that wraps the existing resolver
      return sinon.spy(resolver);
    });
  });

  it('wraps each individual resolver fn in resolver map', function() {
    resolverMapWrapper = wrapEach(resolverWrapper);
    wrappedResolverMap = resolverMapWrapper(clonedResolverMap, generateEmptyPackOptions());

    expect(resolverWrapper.called).to.be.true;
    expect(resolverWrapper.callCount).to.equal(2, 'one wrapper for for each resolver');

    // firstCall for wrapping Query.field
    expect(resolverWrapper.firstCall.args[1].path).to.deep.equal(
      ['Query', 'field'],
      'first call second arg has correct path',
    );

    // secondCall for wrapping SomeType.fieldResolverOnSomeType
    expect(resolverWrapper.secondCall.args[1].path).to.deep.equal(
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
    wrappedResolverMap.Query.field(
      { parent: 'query-field' },
      { args: 'query-field' },
      { context: 'query-field' },
      { info: 'query-field' },
    );

    wrappedResolverMap.SomeType.fieldResolverOnSomeType(
      { parent: 'sometype-field-resolver' },
      { args: 'sometype-field-resolver' },
      { context: 'sometype-field-resolver' },
      { info: 'sometype-field-resolver' },
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
      { context: 'query-field', pack: generateEmptyPackOptions() },
      { info: 'query-field' },
    ]);

    expect(originalResolverMap.SomeType.fieldResolverOnSomeType.firstCall.args).to.deep.equal([
      { parent: 'sometype-field-resolver' },
      { args: 'sometype-field-resolver' },
      { context: 'sometype-field-resolver', pack: generateEmptyPackOptions() },
      { info: 'sometype-field-resolver' },
    ]);
  });
});

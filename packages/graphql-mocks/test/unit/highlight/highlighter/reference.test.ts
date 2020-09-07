import { GraphQLSchema } from 'graphql';
import { expect } from 'chai';
import { reference } from '../../../../src/highlight/highlighter/reference';

const noopSchema = {} as GraphQLSchema;

describe('highlight/highlighter/reference', function () {
  it('can create a highlighter of references', function () {
    expect(reference('Hello', ['Hello', 'world']).mark(noopSchema)).to.deep.equal(['Hello', ['Hello', 'world']]);
  });

  it('creates an empty references set if nothing is passed in', function () {
    expect(reference().mark(noopSchema)).to.deep.equal([]);
  });
});

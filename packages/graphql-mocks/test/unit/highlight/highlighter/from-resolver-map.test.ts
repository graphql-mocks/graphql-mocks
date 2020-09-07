import { GraphQLSchema } from 'graphql';
import { expect } from 'chai';
import { fromResolverMap } from '../../../../src/highlight/highlighter/from-resolver-map';
import { ResolverMap } from '../../../../src/types';

const noopSchema = {} as GraphQLSchema;

describe('highlight/highlighter/from-resolver', function () {
  it('creates references from a resolver map', function () {
    const resolverMap = {
      Query: {
        person: (): string => 'noop',
      },

      Person: {
        name: (): string => 'noop',
      },
    };

    expect(fromResolverMap(resolverMap).mark(noopSchema)).to.deep.equal([
      'Query',
      ['Query', 'person'],
      'Person',
      ['Person', 'name'],
    ]);
  });

  it('includes abstract types while ignoring __resolveType', function () {
    const resolverMap = {
      Query: {
        person: (): string => 'noop',
      },

      Animal: {
        __resolveType: (): string => 'noop',
      },
    };

    expect(fromResolverMap(resolverMap).mark(noopSchema)).to.deep.equal(['Query', ['Query', 'person'], 'Animal']);
  });

  it('returns an empty references array when an object is passed in', function () {
    expect(fromResolverMap(('NOT A RESOLVER MAP, WHOOPS' as unknown) as ResolverMap).mark(noopSchema)).to.deep.equal(
      [],
    );
  });
});

import { expect } from 'chai';
import { getResolver } from '../../../src/resolver-map/get-resolver';
import { ResolverMap, FieldResolver, TypeResolver } from '../../../src/types';
import { Reference } from '../../../src/highlight/types';

describe('resolver-map/get-resolver', function () {
  let resolverMap: ResolverMap;

  beforeEach(function () {
    resolverMap = {
      AnimalInterface: {
        __resolveType: (): string => 'noop',
      },

      Person: {
        name: (): string => 'noop',
      },
    };
  });

  it('can retrieve a field resolver from a resolver map', function () {
    const resolver: FieldResolver | undefined = getResolver(resolverMap, ['Person', 'name']);
    expect(resolver).to.equal(resolverMap.Person.name);
  });

  it('can retrieve a type resolver from a resolver map', function () {
    const resolver: TypeResolver | undefined = getResolver(resolverMap, 'AnimalInterface');
    expect(resolver).to.equal(resolverMap.AnimalInterface.__resolveType);
  });

  it('can retrieve a resolver from a resolver map when the type of the reference is Reference', function () {
    // this is more of a test for the type check when a generic Reference is
    // used. The type on the Resolver is FieldResolver | TypeResolver
    const resolver = getResolver(resolverMap, 'AnimalInterface' as Reference);
    expect(resolver).to.equal(resolverMap.AnimalInterface.__resolveType);
  });

  it('returns undefined if a resolver could not be found', function () {
    const resolver = getResolver(resolverMap, ['Person', 'blah']);
    expect(resolver).to.equal(undefined);
  });
});

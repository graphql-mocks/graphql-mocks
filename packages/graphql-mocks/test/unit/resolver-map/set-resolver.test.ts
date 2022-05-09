import { GraphQLSchema, buildSchema } from 'graphql';
import { expect } from 'chai';
import { setResolver } from '../../../src/resolver-map/set-resolver';
import { FieldResolver, ResolverMap } from '../../../src/types';
import { Reference } from '../../../src/highlight/types';

describe('resolver-map/set-resolver', function () {
  let resolverMap: ResolverMap;
  let sampleResolver: FieldResolver;
  let sampleFieldReference: Reference;

  beforeEach(function () {
    resolverMap = {};
    sampleResolver = (): string => 'noop';
    sampleFieldReference = ['Person', 'name'];
  });

  it('can set a field resolver on a map by reference', function () {
    setResolver(resolverMap, sampleFieldReference, sampleResolver);
    expect(resolverMap?.Person?.name).to.equal(sampleResolver);
  });

  it('can set a type resolver on a map by reference', function () {
    setResolver(resolverMap, 'PersonUnion', sampleResolver);
    expect(resolverMap?.PersonUnion?.__resolveType).to.equal(sampleResolver);
  });

  context('argument checks', function () {
    it('throws when an invalid resolverMap type is passed in', function () {
      expect(() =>
        setResolver(('STRING IS NOT AN OBJECT' as unknown) as ResolverMap, sampleFieldReference, sampleResolver),
      ).to.throw(/Expected resolverMap must be an object, got string/);
    });

    it('throws when an invalid resolver function is passed in', function () {
      expect(() =>
        setResolver(resolverMap, sampleFieldReference, ('STRING IS NOT A RESOLVER' as unknown) as FieldResolver),
      ).to.throw(/Expected resolver to be a function, got string/);
    });

    it('throws when an invalid Reference type is passed in', function () {
      expect(() =>
        setResolver(resolverMap, ({ noop: 'Not a valid reference' } as unknown) as Reference, sampleResolver),
      ).to.throw(/Expected reference to be a type reference or field reference, got object/);
    });
  });

  context('resolver already exists', function () {
    beforeEach(function () {
      resolverMap.Person = {
        name: (): string => 'noop',
      };
    });

    it('refuses to set a resolver on a map when one already exists by default', function () {
      expect(() => setResolver(resolverMap, sampleFieldReference, sampleResolver)).to.throw(
        /resolver already exists and the replace is set to false/,
      );
    });

    it('refuses to set a resolver on a map when one already exists and replace option is false', function () {
      expect(() => setResolver(resolverMap, sampleFieldReference, sampleResolver, { replace: false })).to.throw(
        /resolver already exists and the replace is set to false/,
      );
    });

    it('sets a resolver on a map and replaces the one that already exists when replace option is true', function () {
      setResolver(resolverMap, sampleFieldReference, sampleResolver, { replace: true });
      expect(resolverMap?.Person?.name).to.equal(sampleResolver);
    });
  });

  context('additional schema checks', function () {
    let graphqlSchema: GraphQLSchema;

    beforeEach(function () {
      graphqlSchema = buildSchema(`
        schema {
          query: Person
        }

        type Person {
          name: String
        }

        input PersonInput {
          name: String
        }
      `);
    });

    it('can still add a resolver if all the schema checks pass', function () {
      setResolver(resolverMap, sampleFieldReference, sampleResolver, { graphqlSchema });
    });

    it('throws if a field reference does not exist in the provided schema', function () {
      expect(() => setResolver(resolverMap, ['Person', 'blah'], sampleResolver, { graphqlSchema })).to.throw(
        /Expected to find reference Person,blah in schema/,
      );
    });

    it('throws if a type reference does not exist in the provided schema', function () {
      expect(() => setResolver(resolverMap, 'BlahUnion', sampleResolver, { graphqlSchema })).to.throw(
        /Expected to find reference BlahUnion in schema/,
      );
    });

    it('throws when a type reference is not an abstract type (union or interface)', function () {
      expect(() => setResolver(resolverMap, 'Person', sampleResolver, { graphqlSchema })).to.throw(
        /Expected reference Person to be an Interface or Union type/,
      );
    });

    it('throws when a field reference is not on a object type', function () {
      // can't attach field resolvers to fields on inputs
      // this is a pretty niche case...
      expect(() => setResolver(resolverMap, ['PersonInput', 'name'], sampleResolver, { graphqlSchema })).to.throw(
        /Could not find reference \[PersonInput, name\] \(\[type name, field name\]\) in the GraphQL Schema/,
      );
    });
  });
});

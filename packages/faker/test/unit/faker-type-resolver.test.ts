import { expect } from 'chai';
import { buildSchema } from 'graphql';
import { fakerTypeResolver } from '../../src/faker-type-resolver';
import { GraphQLAbstractType } from 'graphql';

const graphqlSchema = buildSchema(`
  schema {
    query: Query
  }

  type Query {
    interface: Interface
    union: Union
  }

  type ObjectOne {
    id: ID
  }

  type ObjectTwo {
    id: ID
  }

  union Union = ObjectOne | ObjectTwo

  interface Interface {
    id: ID
  }

  type ObjectThree implements Interface {
    id: ID
  }

  type ObjectFour implements Interface {
    id: ID
  }
`);

function getAbstractType(typename: string): GraphQLAbstractType {
  return graphqlSchema.getType(typename) as GraphQLAbstractType;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockTypeResolverInfo: any = {};
const mockTypeResolverContext = { pack: { dependencies: { graphqlSchema } } };

const unionTypeNames = ['ObjectOne', 'ObjectTwo'];
const interfaceTypeNames = ['ObjectThree', 'ObjectFour'];

describe('faker-type-resolver', function () {
  it('uses the __typename if specified', function () {
    const result = fakerTypeResolver()(
      { __typename: 'UseThisTypeName' },
      mockTypeResolverContext,
      mockTypeResolverInfo,
      getAbstractType('Union'),
    );
    expect(result).to.equal('UseThisTypeName');
  });

  it('chooses randomly for union types from possible concrete types', function () {
    for (let i = 0; i < 100; i++) {
      const result = fakerTypeResolver()({}, mockTypeResolverContext, mockTypeResolverInfo, getAbstractType('Union'));
      expect(unionTypeNames).to.include(result);
    }
  });

  it('chooses randomly for interfaces types from possible concrete types', function () {
    for (let i = 0; i < 100; i++) {
      const result = fakerTypeResolver()(
        {},
        mockTypeResolverContext,
        mockTypeResolverInfo,
        getAbstractType('Interface'),
      );
      expect(interfaceTypeNames).to.include(result);
    }
  });
});

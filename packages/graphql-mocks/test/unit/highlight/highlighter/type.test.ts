import { buildSchema } from 'graphql';
import { expect } from 'chai';
import { type } from '../../../../src/highlight/highlighter/type';
import {
  HIGHLIGHT_ALL,
  HIGHLIGHT_ROOT_QUERY,
  HIGHLIGHT_ROOT_MUTATION,
} from '../../../../src/highlight/highlighter/constants';

const schema = buildSchema(`
  schema {
    query: Query
    mutation: Mutation
  }

  type Mutation {
    createPerson(name: String!): Person!
  }

  type Query {
    person: Person!
  }

  type Person {
    id: ID!
    name: String!
    age: Int!
    height: Float!
  }

  interface Animal {
    name: String!
    type: String!
  }

  type Cat implements Animal {
    name: String!
    type: String!
  }

  type Dog implements Animal {
    name: DogNames!
    type: String!
  }

  union FourLeggedAnimal = Cat | Dog

  enum DogNames {
    Cosmo
    Bear
    Toast
  }
`);

const internalScalars = ['Int', 'Float', 'String', 'Boolean', 'ID'];

const isNotInternal = (typeName: unknown): boolean => {
  return typeof typeName === 'string' && !typeName.startsWith('__') && !internalScalars.includes(typeName);
};

describe('highlight/highlighter/type', function () {
  it('highlights all types by default without arguments', function () {
    const highlights = type().mark(schema).filter(isNotInternal);
    expect(highlights.sort()).to.deep.equal(
      ['Query', 'Person', 'Mutation', 'Animal', 'Cat', 'Dog', 'DogNames', 'FourLeggedAnimal'].sort(),
    );
  });

  it('highlights all types by default when argument is HIGHLIGHT_ALL', function () {
    const highlights = type(HIGHLIGHT_ALL).mark(schema).filter(isNotInternal);
    expect(highlights.sort()).to.deep.equal(
      ['Query', 'Person', 'Mutation', 'Animal', 'Cat', 'Dog', 'DogNames', 'FourLeggedAnimal'].sort(),
    );
  });

  it('highlights multiple specified types', function () {
    const highlights = type('Query', 'Person', 'DogNames').mark(schema).filter(isNotInternal);
    expect(highlights.sort()).to.deep.equal(['Query', 'Person', 'DogNames'].sort());
  });

  it('ignores specified types that do not exist', function () {
    const highlights = type('Query', 'NotInSchema', 'Person', 'DogNames').mark(schema).filter(isNotInternal);
    expect(highlights.sort()).to.deep.equal(['Query', 'Person', 'DogNames'].sort());
  });

  it('highlights the root query type with the ROOT_QUERY export', function () {
    const highlights = type(HIGHLIGHT_ROOT_QUERY).mark(schema).filter(isNotInternal);
    expect(highlights).to.deep.equal(['Query']);
  });

  it('highlights the root mutation type with the ROOT_MUTATION export', function () {
    const highlights = type(HIGHLIGHT_ROOT_MUTATION).mark(schema).filter(isNotInternal);
    expect(highlights).to.deep.equal(['Mutation']);
  });
});

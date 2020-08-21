import { field } from '../../../../src/highlight/highlighters/field';
import { buildSchema } from 'graphql';
import { expect } from 'chai';

const schema = buildSchema(`
  schema {
    query: Query
  }

  type Query {
    person: Person!
  }

  type Person {
    name: String!
    age: Int!
  }

  interface Animal {
    name: String!
    type: String!
  }

  type Cat implements Animal {
    name: String!
    type: String!
    hasWhiskers: Boolean!
    owner: Person!
  }

  type Dog implements Animal {
    name: String!
    type: String!
    knowsTricks: Boolean!
    owner: Person!
  }

  union FourLeggedAnimal = Cat | Dog
`);

describe('highlight/highlighter/field', function () {
  it('defaults to field references for all fields', function () {
    expect(field().mark(schema)).to.deep.equal([
      ['Query', 'person'],
      ['Person', 'name'],
      ['Person', 'age'],
      ['Animal', 'name'],
      ['Animal', 'type'],
      ['Cat', 'name'],
      ['Cat', 'type'],
      ['Cat', 'hasWhiskers'],
      ['Cat', 'owner'],
      ['Dog', 'name'],
      ['Dog', 'type'],
      ['Dog', 'knowsTricks'],
      ['Dog', 'owner'],
    ]);
  });

  it('creates field references', function () {
    expect(field(['Cat', 'hasWhiskers']).mark(schema)).to.deep.equal([['Cat', 'hasWhiskers']]);
  });

  it('creates field references from multiple entries', function () {
    expect(field(['Cat', 'hasWhiskers'], ['Dog', 'knowsTricks']).mark(schema)).to.deep.equal([
      ['Cat', 'hasWhiskers'],
      ['Dog', 'knowsTricks'],
    ]);
  });

  it('creates field references from HIGHLIGHT_ALL for type name', function () {
    expect(field(['Dog', '*']).mark(schema)).to.deep.equal([
      ['Dog', 'name'],
      ['Dog', 'type'],
      ['Dog', 'knowsTricks'],
      ['Dog', 'owner'],
    ]);
  });

  it('creates field references from HIGHLIGHT_ALL for field name', function () {
    expect(field(['*', 'owner']).mark(schema)).to.deep.equal([
      ['Cat', 'owner'],
      ['Dog', 'owner'],
    ]);
  });

  it('includes a mix of object types and interfaces with HIGHLIGHT_ALL for field name', function () {
    expect(field(['*', 'name']).mark(schema)).to.deep.equal([
      ['Person', 'name'],
      ['Animal', 'name'],
      ['Cat', 'name'],
      ['Dog', 'name'],
    ]);
  });
});

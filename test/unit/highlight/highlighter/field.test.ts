import { buildSchema } from 'graphql';
import { expect } from 'chai';
import { field, HIGHLIGHT_ALL } from '../../../../src/highlight/highlighter/field';

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
    hasHair: Boolean!
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
      ['Cat', 'hasHair'],
      ['Cat', 'owner'],
      ['Dog', 'name'],
      ['Dog', 'type'],
      ['Dog', 'knowsTricks'],
      ['Dog', 'owner'],
    ]);
  });

  it('creates field references', function () {
    expect(field(['Cat', 'hasHair']).mark(schema)).to.deep.equal([['Cat', 'hasHair']]);
  });

  it('creates field references from multiple entries', function () {
    expect(field(['Cat', 'hasHair'], ['Dog', 'knowsTricks']).mark(schema)).to.deep.equal([
      ['Cat', 'hasHair'],
      ['Dog', 'knowsTricks'],
    ]);
  });

  it('ignores invalid fields specified', function () {
    expect(field(['Cat', 'notAValidField'], ['Dog', 'knowsTricks']).mark(schema)).to.deep.equal([
      ['Dog', 'knowsTricks'],
    ]);
  });

  it('ignores invalid types specified', function () {
    expect(field(['NotAValidType', 'hasHair'], ['Dog', 'knowsTricks']).mark(schema)).to.deep.equal([
      ['Dog', 'knowsTricks'],
    ]);
  });

  it('creates field references from HIGHLIGHT_ALL for type name', function () {
    expect(field(['Dog', HIGHLIGHT_ALL]).mark(schema)).to.deep.equal([
      ['Dog', 'name'],
      ['Dog', 'type'],
      ['Dog', 'knowsTricks'],
      ['Dog', 'owner'],
    ]);
  });

  it('creates field references from HIGHLIGHT_ALL for field name', function () {
    expect(field([HIGHLIGHT_ALL, 'owner']).mark(schema)).to.deep.equal([
      ['Cat', 'owner'],
      ['Dog', 'owner'],
    ]);
  });

  it('includes a mix of object types and interfaces with HIGHLIGHT_ALL for field name', function () {
    expect(field([HIGHLIGHT_ALL, 'name']).mark(schema)).to.deep.equal([
      ['Person', 'name'],
      ['Animal', 'name'],
      ['Cat', 'name'],
      ['Dog', 'name'],
    ]);
  });

  it('can use HIGHLIGHT_ALL for type and fields to highlight everything with a field', function () {
    expect(field([HIGHLIGHT_ALL, HIGHLIGHT_ALL]).mark(schema)).to.deep.equal([
      ['Query', 'person'],
      ['Person', 'name'],
      ['Person', 'age'],
      ['Animal', 'name'],
      ['Animal', 'type'],
      ['Cat', 'name'],
      ['Cat', 'type'],
      ['Cat', 'hasHair'],
      ['Cat', 'owner'],
      ['Dog', 'name'],
      ['Dog', 'type'],
      ['Dog', 'knowsTricks'],
      ['Dog', 'owner'],
    ]);
  });
});

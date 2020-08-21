import { Highlight } from '../../../src/highlight/highlight';
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
    type: String!
  }

  type Cat implements Animal {
    type: String!
    hasWhiskers: Boolean!
  }

  type Dog implements Animal {
    type: String!
    knowsTricks: Boolean!
  }

  union FourLeggedAnimal = Cat | Dog
`);

describe('highlight', function () {
  it('accepts a schema', function () {
    const h = new Highlight(schema);
    expect(h.schema).to.equal(schema);
  });

  it('creates a new instance on include', function () {
    const h1 = new Highlight(schema);
    const h2 = h1.include(() => []);

    expect(h1).to.not.equal(h2);
  });

  it('can perform an include operation', function () {
    const h1 = new Highlight(schema, ['Query']);
    const h2 = h1.include(() => [['Person', 'name']]);
    expect(h2.references).to.deep.equal(['Query', ['Person', 'name']]);
  });

  it('can perform an exclude operation', function () {
    const h1 = new Highlight(schema, ['Person', 'Cat', ['Person', 'name']]);
    const h2 = h1.exclude(() => ['Cat']);
    expect(h2.references).to.deep.equal(['Person', ['Person', 'name']]);
  });

  it('can perform a filter operation', function () {
    const h1 = new Highlight(schema, ['Person', 'Cat', ['Person', 'name']]);
    const h2 = h1.filter(() => ['Cat', 'Animal']);
    expect(h2.references).to.deep.equal(['Cat']);
  });

  it('throws an error when created with an invalid type reference', function () {
    expect(() => new Highlight(schema, ['BlahNotInSchema'])).to.throw(
      /Type Reference "BlahNotInSchema" could not be found in the GraphQLSchema/,
    );
  });

  it('#include', function () {
    expect(include(['Query'], [['Person', 'name']])).to.deep.equal(['Query', ['Person', 'name']]);
  });

  it('#exclude', function () {
    expect(
      exclude(['Person', ['Person', 'name'], 'Cat', ['Person', 'age']], [['Person', 'name'], 'Cat']),
    ).to.deep.equal(['Person', ['Person', 'age']]);
  });

  it('#filter', function () {
    expect(
      filter(['Person', 'Pet', ['Person', 'name'], ['Person', 'age']], ['Pet', ['Person', 'name'], 'Bird']),
    ).to.deep.equal(['Pet', ['Person', 'name']]);
  });
});

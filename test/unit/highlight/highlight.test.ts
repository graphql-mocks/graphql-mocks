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
    hasHair: Boolean!
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

  it('can perform an include operation', function () {
    const h1 = new Highlight(schema, ['Query']);
    const h2 = h1.include(['Person', 'name']);
    expect(h2.references).to.deep.equal(['Query', ['Person', 'name']]);
  });

  it('can perform an exclude operation', function () {
    const h1 = new Highlight(schema, ['Person', 'Cat', ['Person', 'name']]);
    const h2 = h1.exclude('Person', 'Cat');
    expect(h2.references).to.deep.equal([['Person', 'name']]);
  });

  it('can perform a filter operation', function () {
    const h1 = new Highlight(schema, ['Person', 'Cat', ['Person', 'name']]);
    const h2 = h1.filter('Cat');
    expect(h2.references).to.deep.equal(['Cat']);
  });

  it('throws an error when created with an invalid type reference', function () {
    expect(() => new Highlight(schema, ['BlahNotInSchema'])).to.throw(
      /Type Reference "BlahNotInSchema" could not be found in the GraphQLSchema/,
    );
  });

  it('can generate a Reference Map', function () {
    const h = new Highlight(schema);
    h.include('Cat', ['Cat', 'hasHair'], 'Animal');
    expect(h.instances.types.Cat?.type.name).to.equal('Cat');
    expect(h.instances.types.Cat?.fields?.hasHair.name).to.equal('hasHair');
    expect(Object.keys(h.instances.types).length, 'only two types (Cat, Animal) to be captured').to.equal(2);
    expect(Object.keys(h.instances.types.Cat.fields ?? {}).length, 'only one field captured for Cat').to.equal(1);
  });

  it('can make a copy via #clone', function () {
    const h1 = new Highlight(schema);
    h1.include('Cat');

    const h2 = h1.clone();

    expect(h1).to.not.equal(h2);
    expect(h1.references).to.deep.equal(h2.references);
  });
});

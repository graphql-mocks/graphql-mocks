import { Highlight, hi } from '../../../src/highlight/highlight';
import { field } from '../../../src/highlight/highlighter/field';
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
    const h = new Highlight(schema).include('Cat', ['Cat', 'hasHair'], 'Animal');
    expect(h.instances.types.Cat?.type.name).to.equal('Cat');
    expect(h.instances.types.Cat?.fields?.hasHair.name).to.equal('hasHair');
    expect(Object.keys(h.instances.types).length, 'only two types (Cat, Animal) to be captured').to.equal(2);
    expect(Object.keys(h.instances.types.Cat.fields ?? {}).length, 'only one field captured for Cat').to.equal(1);
  });

  it('creates an instance copy on an operation', function () {
    const h1 = new Highlight(schema);
    const h2 = h1.include('Cat');
    expect(h1).to.not.equal(h2);
  });

  it('filters out internal types by default', function () {
    const h = new Highlight(schema).include('__Schema', 'String', 'Boolean');
    expect(h.references.length).to.equal(0);
  });

  context('#h functional shorthand', function () {
    it('produces an Highlight instance', function () {
      const fromInstance = new Highlight(schema, ['Cat']);
      const fromFunction = hi(schema, ['Cat']);
      expect(fromInstance.schema).to.equal(fromFunction.schema);
      expect(fromInstance.references).to.deep.equal(fromFunction.references);
    });
  });

  context('highlighters', function () {
    it('can use highlighters', function () {
      const queryPersonHighlighter = field(['Query', 'person']);
      const personNameHighlighter = field(['Person', 'name']);

      // start with 2 highlighted fields
      let h = new Highlight(schema).include(queryPersonHighlighter, personNameHighlighter);

      expect(h.references).to.deep.equal([
        ['Query', 'person'],
        ['Person', 'name'],
      ]);

      // filter on one of them
      h = h.filter(queryPersonHighlighter);
      expect(h.references).to.deep.equal([['Query', 'person']]);

      // exclude the last highlight
      h = h.exclude(queryPersonHighlighter);
      expect(h.references).to.deep.equal([]);
    });
  });
});

import { Highlight, include, exclude } from '../../../src/highlight/index';
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

describe.only('highlight', function () {
  it('accepts a schema', function () {
    const h = new Highlight(schema);
    expect(h.schema).to.equal(schema);
  });

  it('creates a new instance on include', function () {
    const h1 = new Highlight(schema);
    const h2 = h1.include(() => ({
      Person: ['name'],
    }));

    expect(h1).to.not.equal(h2);
  });

  context('#include', function () {
    it('ignores a null field merging with a field name list', function () {
      const source = {
        Person: ['name'],
      };

      const update = {
        Person: null,
      };

      expect(include(source, update)).to.deep.equal({
        Person: ['name'],
      });
    });

    it('can merge lists on the same field name', function () {
      const source = {
        Person: ['name'],
      };

      const update = {
        Person: ['age'],
      };

      expect(include(source, update)).to.deep.equal({
        Person: ['name', 'age'],
      });
    });

    it('can merge separate named object with fields', function () {
      const source = {
        Person: ['name'],
      };

      const update = {
        Cat: ['type'],
      };

      expect(include(source, update)).to.deep.equal({
        Person: ['name'],
        Cat: ['type'],
      });
    });

    it('can merge separate named objects with null', function () {
      const source = {
        Person: null,
      };

      const update = {
        Cat: null,
      };

      expect(include(source, update)).to.deep.equal({
        Person: null,
        Cat: null,
      });
    });
  });

  context('#exclude', function () {
    it('can remove a value from a field list', function () {
      const source = {
        Person: ['name', 'age'],
      };

      const update = {
        Person: ['name'],
      };

      expect(exclude(source, update)).to.deep.equal({
        Person: ['age'],
      });
    });

    it('removes the type when updated by a null-type reference', function () {
      const source = {
        Person: ['name', 'age'],
      };

      const update = {
        Person: null,
      };

      expect(exclude(source, update), 'it removes the type reference').to.deep.equal({});
    });

    it('ignores removing a field list from a null', function () {
      const source = {
        Person: null,
      };

      const update = {
        Person: ['name', 'age'],
      };

      expect(exclude(source, update)).to.deep.equal({
        Person: null,
      });
    });

    it('can remove a type entirely', function () {
      const source = {
        Person: null,
      };

      const update = {
        Person: ['name', 'age'],
      };

      expect(exclude(source, update)).to.deep.equal({
        Person: null,
      });
    });
  });
});

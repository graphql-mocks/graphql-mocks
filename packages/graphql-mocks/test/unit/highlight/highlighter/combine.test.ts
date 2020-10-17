import { buildSchema } from 'graphql';
import { expect } from 'chai';
import { combine } from '../../../../src/highlight/highlighter/combine';
import { union } from '../../../../src/highlight/highlighter/union';
import { interfaces } from '../../../../src/highlight/highlighter/interfaces';

const schema = buildSchema(`
  schema {
    query: Query
  }

  type Query {
    animals: [Animal!]!
  }

  interface Animal {
    name: String!
    type: String!
  }

  type Cat implements Animal {
    name: String!
    type: String!
    hasHair: Boolean!
  }

  type Dog implements Animal {
    name: String!
    type: String!
    knowsTricks: Boolean!
  }

  union FourLeggedAnimal = Cat | Dog
`);

describe('highlight/highlighter/combine', function () {
  it('can combine highlighters', function () {
    const combined = combine(union(), interfaces());
    expect(combined.mark(schema)).to.deep.equal(['FourLeggedAnimal', 'Animal']);
  });

  it('returns an empty list if no highlighters are specified', function () {
    const combined = combine();
    expect(combined.mark(schema)).to.deep.equal([]);
  });
});

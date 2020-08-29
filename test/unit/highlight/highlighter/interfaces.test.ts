import { buildSchema } from 'graphql';
import { expect } from 'chai';
import { interfaces } from '../../../../src/highlight/highlighter/interfaces';
import { HIGHLIGHT_ALL } from '../../../../src/highlight/types';

const schema = buildSchema(`
  schema {
    query: Query
  }

  type Query {
    pet: Pet!
  }

  interface Pet {
    name: String!
  }

  interface Canine {
    type: String!
    domesticated: Boolean!
  }

  interface Feline {
    type: String!
    domesticated: Boolean!
  }

  type Cat implements Pet & Feline {
    name: String!
    hasHair: Boolean!
  }

  type Dog implements Pet & Canine {
    name: String!
    type: String!
    knowsTricks: Boolean!
  }

  type Wolf implements Canine {
    name: String!
    type: String!
    knowsTricks: Boolean!
  }
`);

describe('highlight/highlighter/interfaces', function () {
  it('highlights all interface types by default without arguments', function () {
    expect(interfaces().mark(schema)).to.deep.equal(['Pet', 'Canine', 'Feline']);
  });

  it('highlights all interface types when passed the HIGHLIGHT_ALL argument', function () {
    expect(interfaces(HIGHLIGHT_ALL).mark(schema)).to.deep.equal(['Pet', 'Canine', 'Feline']);
  });

  it('highlights specified interfaces', function () {
    expect(interfaces('Pet', 'Feline').mark(schema)).to.deep.equal(['Pet', 'Feline']);
  });

  it('ignores specified names that are not interfaces', function () {
    expect(interfaces('Pet', 'NotAnInterface', 'Feline').mark(schema)).to.deep.equal(['Pet', 'Feline']);
  });
});

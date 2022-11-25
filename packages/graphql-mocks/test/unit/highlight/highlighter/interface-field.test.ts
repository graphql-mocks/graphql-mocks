import { buildSchema } from 'graphql';
import { expect } from 'chai';
import { interfaceField } from '../../../../src/highlight/highlighter/interface-field';
import { HIGHLIGHT_ALL } from '../../../../src/highlight/highlighter/constants';

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
  const allInterfaceFields = [
    ['Pet', 'name'],
    ['Canine', 'type'],
    ['Canine', 'domesticated'],
    ['Feline', 'type'],
    ['Feline', 'domesticated'],
  ];

  it('highlights all interface types and fields by default without arguments', function () {
    expect(interfaceField().mark(schema)).to.deep.equal(allInterfaceFields);
  });

  it('highlights all interface types when passed the HIGHLIGHT_ALL argument', function () {
    expect(interfaceField([HIGHLIGHT_ALL, HIGHLIGHT_ALL]).mark(schema)).to.deep.equal(allInterfaceFields);
  });

  it('highlights specified interfaces fields with HIGHLIGHT_ALL for type', function () {
    expect(interfaceField([HIGHLIGHT_ALL, 'domesticated']).mark(schema)).to.deep.equal([
      ['Canine', 'domesticated'],
      ['Feline', 'domesticated'],
    ]);
  });

  it('highlights a specified type with all interfaces fields via HIGHLIGHT_ALL for fields', function () {
    expect(interfaceField(['Canine', HIGHLIGHT_ALL]).mark(schema)).to.deep.equal([
      ['Canine', 'type'],
      ['Canine', 'domesticated'],
    ]);
  });
});

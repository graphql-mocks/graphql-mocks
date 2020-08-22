import { resolvesTo } from '../../../../src/highlight/highlighters/resolves-to';
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
    partner: Person
    friends: [Person!]!
    nullableFriends: [Person]
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

describe('highlight/highlighter/resolves-to', function () {
  it('defaults to returning any fields that are resolvable', function () {
    expect(resolvesTo().mark(schema)).to.deep.equal([
      ['Query', 'person'],
      ['Person', 'name'],
      ['Person', 'age'],
      ['Person', 'partner'],
      ['Person', 'friends'],
      ['Person', 'nullableFriends'],
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

  it('returns fields that resolve to specified resolve string', function () {
    expect(resolvesTo('Boolean!').mark(schema)).to.deep.equal([
      ['Cat', 'hasHair'],
      ['Dog', 'knowsTricks'],
    ]);
  });

  it('returns multiple fields that resolve to specified resolve strings', function () {
    expect(resolvesTo('Boolean!', 'Int!').mark(schema)).to.deep.equal([
      ['Cat', 'hasHair'],
      ['Dog', 'knowsTricks'],
      ['Person', 'age'],
    ]);
  });

  it('discriminates on non-null', function () {
    const result = resolvesTo('Person!').mark(schema);
    expect(result).to.deep.equal([
      ['Query', 'person'],
      ['Cat', 'owner'],
      ['Dog', 'owner'],
    ]);

    expect(result, 'partner (Person) is nullable and not included').to.not.deep.include(['Person', 'partner']);
  });

  it('discriminates on a list', function () {
    const result = resolvesTo('[Person]').mark(schema);
    expect(result).to.deep.equal([['Person', 'nullableFriends']]);
  });

  it('discriminates on a non-null list', function () {
    const result = resolvesTo('[Person!]!').mark(schema);
    expect(result).to.deep.equal([['Person', 'friends']]);
  });
});

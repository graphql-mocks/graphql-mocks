import { buildSchema } from 'graphql';
import { expect } from 'chai';
import { union } from '../../../../src/highlight/highlighter/union';
import { HIGHLIGHT_ALL } from '../../../../src/highlight/highlighter/constants';

const schema = buildSchema(`
  schema {
    query: Query
  }

  type Query {
    pets: [Pet!]!
  }

  type Dog {
    name: String!
  }

  type Cat {
    name: String!
  }

  type Bird {
    name: String!
  }

  type Wolf {
    hasPack: Boolean!
  }

  type Cheetah {
    speedInMilesPerHour: Int!
  }

  type Eagle {
    species: String!
  }

  union Wild = Cheetah | Wolf | Eagle
  union Pet = Dog | Cat | Bird
  union FourLegged = Cheetah | Wolf | Dog | Cat
  union Winged = Bird | Eagle
`);

describe('highlight/highlighter/union', function () {
  it('highlights all unions by default when no arguments are passed in', function () {
    expect(union().mark(schema).sort()).to.deep.equal(['Pet', 'Wild', 'FourLegged', 'Winged'].sort());
  });

  it('highlights all unions when HIGHLIGHT_ALL argument is passed in', function () {
    expect(union(HIGHLIGHT_ALL).mark(schema).sort()).to.deep.equal(['Pet', 'Wild', 'FourLegged', 'Winged'].sort());
  });

  it('highlights unions specified by arguments', function () {
    expect(union('Pet', 'Winged').mark(schema)).to.deep.equal(['Pet', 'Winged']);
  });

  it('ignores specified names that are not unions', function () {
    expect(union('Pet', 'ThisIsNoUnion', 'Winged').mark(schema)).to.deep.equal(['Pet', 'Winged']);
  });
});

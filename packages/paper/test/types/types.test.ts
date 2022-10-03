import { Paper } from '../../src';
import type { Person, Book } from './types';

type SchemaTypes = { Person: Person; Book: Book };

/*
  The purpose of these tests are to ensure that there's
  typescript compatibility with types that can be generated.
  This should provide autocompletion and inference when
  inspected.
*/

const schemaString = `
  schema {
    query: Query
  }

  type Query {
    noop: String
  }

  enum Pet {
    DOG
    CAT
  }

  interface Named {
    firstName: String!
    lastName: String
  }

  type Person implements Named {
    firstName: String!
    lastName: String
    pet: Pet!
    friends: [Person!]!
    booksRead: [Book!]!
  }

  type Book {
    author: Person!
    title: String!
    pageCount: Int
  }
`;

describe('typescript types check', async () => {
  const paper = new Paper<SchemaTypes>(schemaString);

  describe('operations', () => {
    it('shows type completion within operations', async () => {
      await paper.mutate((a) => {
        // first argument create should show typename options
        a.create();
      });
    });
  });
});

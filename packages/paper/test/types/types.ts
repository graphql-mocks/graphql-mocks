/*
  Generated with GraphQL Code Generator from their online interactive website with configuration:

  generates:
    types.ts:
      plugins:
        - typescript
*/

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  noop?: Maybe<Scalars['String']>;
};

export enum Pet {
  Dog = 'DOG',
  Cat = 'CAT'
}

export type Named = {
  firstName: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
};

export type Person = Named & {
  __typename?: 'Person';
  firstName: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  pet: Pet;
  friends: Array<Person>;
  booksRead: Array<Book>;
};

export type Book = {
  __typename?: 'Book';
  author: Person;
  title: Scalars['String'];
  pageCount?: Maybe<Scalars['Int']>;
};

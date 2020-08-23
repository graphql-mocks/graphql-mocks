/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  GraphQLFieldResolver,
  GraphQLObjectType,
  GraphQLField,
  GraphQLTypeResolver,
  GraphQLAbstractType,
  GraphQLSchema,
} from 'graphql';

import { PackOptions } from './pack/types';

// Resolvers Shorthands

type ManagedContext = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  pack?: PackOptions;
};

export type Primitive = string | boolean | number;
export type FieldResolver = GraphQLFieldResolver<any, any>;
export type TypeResolver = GraphQLTypeResolver<any, any>;
export type ResolverParent = Parameters<GraphQLFieldResolver<any, any>>[0];
export type ResolverArgs = Parameters<GraphQLFieldResolver<any, any>>[1];
export type ResolverContext = ManagedContext;
export type ResolverInfo = Parameters<GraphQLFieldResolver<any, any>>[3];

// Library Abstractions

export type TypeWrapperFunction = (
  resolver: TypeResolver,
  options: WrapperOptionsBase,
) => TypeResolver | Promise<TypeResolver>;

export type FieldWrapperFunction = (
  resolver: FieldResolver,
  options: WrapperOptionsBase,
) => FieldResolver | Promise<FieldResolver>;

export type GenericWrapperFunction = (
  resolver: FieldResolver | TypeResolver,
  options: WrapperOptionsBase,
) => FieldResolver | TypeResolver | Promise<FieldResolver | TypeResolver>;

export enum WrapperFor {
  TYPE = 'TYPE',
  FIELD = 'FIELD',
  ANY = 'ANY',
}
export interface NamedWrapper {
  name: string;
  wrap: GenericWrapperFunction;
  wrapperFor: WrapperFor;
}

export type Wrapper = GenericWrapperFunction | NamedWrapper;

export type WrapperOptionsBase = {
  schema: GraphQLSchema;
  resolverMap: ResolverMap;
  packOptions: PackOptions;
  type: GraphQLObjectType | GraphQLAbstractType;
  field?: GraphQLField<any, any>;
};

export type ResolverMap<TFieldResolver = FieldResolver, TTypeResolver = TypeResolver> = {
  [typeName: string]: {
    [fieldName: string]: TFieldResolver;
  } & { __resolveType?: TTypeResolver }; // the convention of using __resolveType on a ResolverMap is borrowed from `graphql-tools`
};

export type ResolverMapMiddleware = (map: ResolverMap, packOptions: PackOptions) => ResolverMap | Promise<ResolverMap>;

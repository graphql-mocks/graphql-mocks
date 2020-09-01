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

export type FieldResolver = GraphQLFieldResolver<any, any>;
export type ObjectField = GraphQLField<any, any>;
export type TypeResolver = GraphQLTypeResolver<any, any>;
export type ResolverParent = Parameters<GraphQLFieldResolver<any, any>>[0];
export type ResolverArgs = Parameters<GraphQLFieldResolver<any, any>>[1];
export type ResolverContext = ManagedContext;
export type ResolverInfo = Parameters<GraphQLFieldResolver<any, any>>[3];

// Library Abstractions

export type BaseWrapperOptions = {
  schema: GraphQLSchema;
  resolverMap: ResolverMap;
  packOptions: PackOptions;
  type: GraphQLObjectType | GraphQLAbstractType;
  field?: ObjectField;
};

// the convention of using __resolveType on a ResolverMap is borrowed from `graphql-tools`
export type ResolverMap<TFieldResolver = FieldResolver, TTypeResolver = TypeResolver> = {
  [typeName: string]: {
    [fieldName: string]: TFieldResolver;
  } & { __resolveType?: TTypeResolver };
};

export type ResolverMapMiddleware = (map: ResolverMap, packOptions: PackOptions) => ResolverMap | Promise<ResolverMap>;

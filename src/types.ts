/* eslint-disable @typescript-eslint/no-explicit-any */

import { GraphQLFieldResolver, GraphQLField, GraphQLTypeResolver } from 'graphql';

import { PackOptions } from './pack/types';

// Resolvers Shorthands

type ManagedContext = {
  [key: string]: any;
  pack?: PackOptions;
};

export type ObjectField = GraphQLField<any, any>;
export type FieldResolver = GraphQLFieldResolver<any, any>;
export type TypeResolver = GraphQLTypeResolver<any, any>;
export type ResolverParent = Parameters<FieldResolver>[0];
export type ResolverArgs = Parameters<FieldResolver>[1];
export type ResolverContext = ManagedContext;
export type ResolverInfo = Parameters<FieldResolver>[3];

// Library Abstractions

// the convention of using __resolveType on a ResolverMap is borrowed from `graphql-tools`
export type ResolverMap<TFieldResolver = FieldResolver, TTypeResolver = TypeResolver> = {
  [typeName: string]: {
    [fieldName: string]: TFieldResolver;
  } & { __resolveType?: TTypeResolver };
};

export type ResolverMapMiddleware = (map: ResolverMap, packOptions: PackOptions) => ResolverMap | Promise<ResolverMap>;

/* eslint-disable @typescript-eslint/no-explicit-any */

import { GraphQLFieldResolver, GraphQLField, GraphQLTypeResolver } from 'graphql';

import { PackOptions } from './pack/types';

// Resolvers Shorthands

type ManagedContext = {
  [key: string]: any;
  pack?: PackOptions;
};

export type ObjectField = GraphQLField<any, any>;
export type FieldResolver<Source = any, Context = any, Args = any, Result = any> = GraphQLFieldResolver<
  Source,
  Context,
  Args,
  Result
>;
export type TypeResolver<Source = any, Context = any> = GraphQLTypeResolver<Source, Context>;
export type ResolverParent<Resolver extends FieldResolver = FieldResolver> = Parameters<Resolver>[0];
export type ResolverArgs<Resolver extends FieldResolver = FieldResolver> = Parameters<Resolver>[1];
export type ResolverContext = ManagedContext;
export type ResolverInfo<Resolver extends FieldResolver = FieldResolver> = Parameters<Resolver>[3];

// Library Abstractions

// the convention of using __resolveType on a ResolverMap is borrowed from `graphql-tools`
export type ResolverMap<TFieldResolver = FieldResolver, TTypeResolver = TypeResolver> = {
  [typeName: string]: {
    [fieldName: string]: TFieldResolver;
  } & { __resolveType?: TTypeResolver };
};

export type ResolverMapMiddleware = (map: ResolverMap, packOptions: PackOptions) => ResolverMap | Promise<ResolverMap>;

/* eslint-disable @typescript-eslint/no-explicit-any */

import { GraphQLFieldResolver, GraphQLField, GraphQLTypeResolver, GraphQLScalarType } from 'graphql';
import { _Pipeline } from './graphql/pipeline-resolver';

import { PackOptions } from './pack/types';

// Resolvers Shorthands

type ManagedContext = {
  [key: string]: any;
  pack?: PackOptions;
  pipeline?: { result: any };
};

export type ObjectField = GraphQLField<any, any>;
export type OptionalFieldResolverPipeline<Source, Context, Args, Result> = {
  pipeline?: _Pipeline<FieldResolver<Source, Context, Args, Result>>;
};
export type FieldResolver<Source = any, Context = any, Args = any, Result = any> = GraphQLFieldResolver<
  Source,
  Context,
  Args,
  Result
> &
  OptionalFieldResolverPipeline<Source, Context, Args, Result>;

export type TypeResolver<Source = any, Context = any> = GraphQLTypeResolver<Source, Context> & {
  pipeline?: _Pipeline<TypeResolver<Source, Context>>;
};
export type ResolverParent<Resolver extends FieldResolver = FieldResolver> = Parameters<Resolver>[0];
export type ResolverArgs<Resolver extends FieldResolver = FieldResolver> = Parameters<Resolver>[1];
export type ResolverContext = ManagedContext;
export type ResolverInfo<Resolver extends FieldResolver = FieldResolver> = Parameters<Resolver>[3];

// Library Abstractions

export type BasicScalarDefinition = {
  serialize?: GraphQLScalarType['serialize'];
  parseValue?: GraphQLScalarType['parseValue'];
  parseLiteral?: GraphQLScalarType['parseLiteral'];
};

export type ScalarMap = {
  [typename: string]: GraphQLScalarType | BasicScalarDefinition;
};

// the convention of using __resolveType on a ResolverMap is borrowed from `graphql-tools`
export type ResolverMap<TFieldResolver = FieldResolver, TTypeResolver = TypeResolver> = {
  [typeName: string]: {
    [fieldName: string]: TFieldResolver;
  } & { __resolveType?: TTypeResolver };
};

export type ResolverMapMiddleware = (map: ResolverMap, packOptions: PackOptions) => ResolverMap | Promise<ResolverMap>;

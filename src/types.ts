/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  GraphQLFieldResolver,
  GraphQLObjectType,
  GraphQLField,
  GraphQLTypeResolver,
  GraphQLAbstractType,
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

export type FieldResolverWrapper = (
  resolver: FieldResolver,
  options: FieldResolverWrapperOptions,
) => FieldResolver | Promise<FieldResolver>;

export type TypeResolverWrapper = (
  resolver: TypeResolver,
  options: TypeResolverWrapperOptions,
) => TypeResolver | Promise<TypeResolver>;

export type BaseResolverWrapperOptions = {
  resolverMap: ResolverMap;
  packOptions: PackOptions;
};

export type FieldResolverWrapperOptions = BaseResolverWrapperOptions & {
  type: GraphQLObjectType;
  field: GraphQLField<any, any>;
};

export type TypeResolverWrapperOptions = BaseResolverWrapperOptions & {
  type: GraphQLAbstractType;
};

export type ResolverMap<TFieldResolver = FieldResolver, TTypeResolver = TypeResolver> = {
  [typeName: string]: {
    [fieldName: string]: TFieldResolver;
  } & { __resolveType?: TTypeResolver }; // the convention of using __resolveType on a ResolverMap is borrowed from `graphql-tools`
};

export type ResolverMapMiddleware = (map: ResolverMap, packOptions: PackOptions) => ResolverMap | Promise<ResolverMap>;

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

export type TypeWrapper = (resolver: TypeResolver, options: TypeResolverWrapperOptions) => TypeResolver;
export type FieldWrapper = (resolver: FieldResolver, options: FieldResolverWrapperOptions) => FieldResolver;
export type Wrapper = TypeWrapper | FieldWrapper;

export type WrapperOptions = {
  schema: GraphQLSchema;
  resolverMap: ResolverMap;
  packOptions: PackOptions;
  type: GraphQLObjectType | GraphQLAbstractType;
  field?: GraphQLField<any, any>;
};

export type ResolverWrapperOptions = {
  schema: GraphQLSchema;
  resolverMap: ResolverMap;
  packOptions: PackOptions;
  type: GraphQLObjectType;
  field?: GraphQLField<any, any>;
};

export type FieldResolverWrapperOptions = WrapperOptions & {
  type: GraphQLObjectType;
  field: GraphQLField<any, any>;
};

export type TypeResolverWrapperOptions = WrapperOptions & {
  type: GraphQLAbstractType;
  field?: undefined;
};

export type ResolverMap<TFieldResolver = FieldResolver, TTypeResolver = TypeResolver> = {
  [typeName: string]: {
    [fieldName: string]: TFieldResolver;
  } & { __resolveType?: TTypeResolver }; // the convention of using __resolveType on a ResolverMap is borrowed from `graphql-tools`
};

export type ResolverMapMiddleware = (map: ResolverMap, packOptions: PackOptions) => ResolverMap | Promise<ResolverMap>;

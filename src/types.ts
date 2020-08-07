/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  GraphQLFieldResolver,
  GraphQLObjectType,
  GraphQLField,
  GraphQLUnionType,
  GraphQLInterfaceType,
  GraphQLTypeResolver,
} from 'graphql';

import { PackOptions } from './pack/types';

// Resolvers Shorthands

type ManagedContext = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  pack?: PackOptions;
};

export type Primitive = string | boolean | number;
export type Resolver = GraphQLFieldResolver<any, any>;
export type ResolverParent = Parameters<GraphQLFieldResolver<any, any>>[0];
export type ResolverArgs = Parameters<GraphQLFieldResolver<any, any>>[1];
export type ResolverContext = ManagedContext;
export type ResolverInfo = Parameters<GraphQLFieldResolver<any, any>>[3];

// Library Abstractions

export type ResolverWrapper = (resolver: Resolver, options: ResolverWrapperOptions) => Resolver | Promise<Resolver>;

export type PatchResolverWrapper = (
  options: ResolverWrapperOptions,
) => Resolver | undefined | Promise<Resolver | undefined>;

// A resolvable type is a type that has a "field" that can be resolved by a resolver function
export type ResolvableType = GraphQLObjectType | GraphQLUnionType | GraphQLInterfaceType;

export type ResolvableField = GraphQLField<any, any, any>;

export type ResolverWrapperOptions = {
  resolverMap: ResolverMap;
  type: ResolvableType;
  field: ResolvableField;
  packOptions: PackOptions;
};

export type ResolverMap<TFieldResolver = Resolver, TTypeResolver = GraphQLTypeResolver<any, any>> = {
  [typeName: string]: {
    [fieldName: string]: TFieldResolver;
  } & { __resolveType?: TTypeResolver }; // the convention of using __resolveType on a ResolverMap is borrowed from `graphql-tools`
};

export type ResolverMapMiddleware = (map: ResolverMap, packOptions: PackOptions) => ResolverMap | Promise<ResolverMap>;

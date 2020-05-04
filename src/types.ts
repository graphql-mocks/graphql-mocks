import { GraphQLObjectType, GraphQLField, GraphQLUnionType, GraphQLInterfaceType } from 'graphql';

export type Resolver = (parent: any, args: any, context: any, info: any) => any | Promise<any>;
export type ResolverWrapper = (resolver: Resolver, options: ResolverWrapperOptions) => Resolver;

export type PatchResolverWrapper = (options: ResolverWrapperOptions) => Resolver | undefined;

// this exists on ResolverMap and is used for specifying a resolveType resolver
// for graphql interfaces and unions, but is not a "real" field.
export type AnonymousResolveTypeField = { name: '__resolveType'; [key: string]: '__resolveType' };

// A resolvable type is a type that has a "field" that can be resolved by a resolver function
export type ResolvableType = GraphQLObjectType | GraphQLUnionType | GraphQLInterfaceType;

// A resolver function can either be a GraphQLField on a GraphQLObjectType
// or an AnonymousResolveType resolver that is specifed by __resolveType
export type ResolvableField = GraphQLField<any, any, any> | AnonymousResolveTypeField;

export type ResolverWrapperOptions = {
  resolvers: ResolverMap;
  type: ResolvableType;
  field: ResolvableField;
  packOptions: PackOptions;
};

export type ResolverMap = {
  [type: string]: {
    [field: string]: Resolver;
  };
};

export type PackState = Record<any, any>;

export type PackOptions = {
  state: PackState;
  dependencies: Record<string, any>;
};

export type ResolverMapWrapper = (map: ResolverMap, packOptions: PackOptions) => ResolverMap;

export type Packed = { resolvers: ResolverMap; state: PackState };

export type Packer = (
  initialMap: ResolverMap,
  wrappers: ResolverMapWrapper[],
  packOptions?: Partial<PackOptions>,
) => Packed;

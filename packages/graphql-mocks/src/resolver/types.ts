import { TypeResolver, FieldResolver, ObjectField, ResolverMap } from '../types';
import { WrapperFor } from './constants';
import { GraphQLObjectType, GraphQLAbstractType, GraphQLSchema } from 'graphql';
import { PackOptions } from '../pack/types';

export type BaseWrapperOptions = {
  schema: GraphQLSchema;
  resolverMap: ResolverMap;
  packOptions: PackOptions;
  type: GraphQLObjectType | GraphQLAbstractType;
  field?: ObjectField;
};

export type FieldResolverWrapperOptions = BaseWrapperOptions & {
  type: GraphQLObjectType;
  field: ObjectField;
};

export type TypeResolverWrapperOptions = BaseWrapperOptions & {
  type: GraphQLAbstractType;
  field: undefined;
};

export type TypeWrapperFunction = (
  resolver: TypeResolver,
  options: TypeResolverWrapperOptions,
) => TypeResolver | Promise<TypeResolver>;

export type FieldWrapperFunction = (
  resolver: FieldResolver,
  options: FieldResolverWrapperOptions,
) => FieldResolver | Promise<FieldResolver>;

export type GenericWrapperFunction = (
  resolver: FieldResolver | TypeResolver,
  options: BaseWrapperOptions,
) => FieldResolver | TypeResolver | Promise<FieldResolver | TypeResolver>;

export interface NamedWrapper {
  name: string;
  wrap: GenericWrapperFunction;
  wrapperFor: typeof WrapperFor[keyof typeof WrapperFor];
}

export type Wrapper = NamedWrapper | GenericWrapperFunction | FieldWrapperFunction | TypeWrapperFunction;

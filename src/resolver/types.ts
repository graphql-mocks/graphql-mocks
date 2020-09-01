import { TypeResolver, BaseWrapperOptions, FieldResolver, ObjectField } from '../types';
import { WrapperFor } from './constant';
import { GraphQLObjectType, GraphQLAbstractType } from 'graphql';

export type FieldResolverWrapperOptions = BaseWrapperOptions & {
  type: GraphQLObjectType;
  field: ObjectField;
};

export type TypeResolverWrapperOptions = BaseWrapperOptions & {
  type: GraphQLAbstractType;
  field?: undefined;
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
  wrapperFor: WrapperFor;
}

export type Wrapper = NamedWrapper | GenericWrapperFunction | FieldWrapperFunction | TypeWrapperFunction;

import { TypeResolver, WrapperOptionsBase, FieldResolver } from '../types';
import { WrapperFor } from './constant';

export type TypeWrapperFunction = (
  resolver: TypeResolver,
  options: WrapperOptionsBase,
) => TypeResolver | Promise<TypeResolver>;

export type FieldWrapperFunction = (
  resolver: FieldResolver,
  options: WrapperOptionsBase,
) => FieldResolver | Promise<FieldResolver>;

export type GenericWrapperFunction = (
  resolver: FieldResolver | TypeResolver,
  options: WrapperOptionsBase,
) => FieldResolver | TypeResolver | Promise<FieldResolver | TypeResolver>;

export interface NamedWrapper {
  name: string;
  wrap: GenericWrapperFunction;
  wrapperFor: WrapperFor;
}

export type Wrapper = NamedWrapper | GenericWrapperFunction | FieldWrapperFunction | TypeWrapperFunction;

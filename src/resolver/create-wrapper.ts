/* eslint-disable prettier/prettier */
import { GraphQLObjectType, GraphQLField, isObjectType, isAbstractType, GraphQLType, GraphQLAbstractType } from 'graphql';
import {
  FieldResolver,
  FieldWrapperFunction,
  TypeWrapperFunction,
  TypeResolver,
  Wrapper,
  WrapperOptionsBase,
} from '../types';

enum WrapperFor {
  TYPE = 'TYPE',
  FIELD = 'FIELD',
  '*' = '*',
}

export type FieldResolverWrapperOptions = WrapperOptionsBase & {
  type: GraphQLObjectType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: GraphQLField<any, any>;
};

export type TypeResolverWrapperOptions = WrapperOptionsBase & {
  type: GraphQLAbstractType;
  field?: undefined;
};

function hasFieldResolverPackage(
  type: GraphQLType,
  pkg: {
    resolver: FieldResolver | TypeResolver;
    wrapper: FieldWrapperFunction | TypeWrapperFunction;
    options: WrapperOptionsBase;
  },
): pkg is { resolver: FieldResolver; wrapper: FieldWrapperFunction; options: FieldResolverWrapperOptions } {
  return Boolean(isObjectType(type) && pkg);
}

function hasTypeResolverPackage(
  type: GraphQLType,
  pkg: {
    resolver: FieldResolver | TypeResolver;
    wrapper: FieldWrapperFunction | TypeWrapperFunction;
    options: WrapperOptionsBase;
  },
): pkg is { resolver: TypeResolver; wrapper: TypeWrapperFunction; options: TypeResolverWrapperOptions } {
  return Boolean(isAbstractType(type) && pkg);
}

class NamedWrapper implements Wrapper {
  name: string;
  wrapper: FieldWrapperFunction | TypeWrapperFunction;
  wrapperFor: WrapperFor;

  constructor(name: string, wrapperFn: FieldWrapperFunction | TypeWrapperFunction, wrapperFor: WrapperFor = WrapperFor['*']) {
    this.name = name;
    this.wrapper = wrapperFn;
    this.wrapperFor = wrapperFor;
  }

  async wrap(resolver: TypeResolver, options: WrapperOptionsBase): Promise<TypeResolver>;
  async wrap(resolver: FieldResolver, options: WrapperOptionsBase): Promise<FieldResolver>;
  async wrap(resolver: FieldResolver | TypeResolver, options: WrapperOptionsBase | FieldResolverWrapperOptions): Promise<FieldResolver | TypeResolver>;
  async wrap(resolver: FieldResolver | TypeResolver, options: WrapperOptionsBase | FieldResolverWrapperOptions): Promise<FieldResolver | TypeResolver> {
    const { type, field } = options;
    const wrapper = this.wrapper;
    const wrapperFor = this.wrapperFor;

    // for use with type guards `hasFieldResolverPackage` and `hasTypeResolverPackage`
    const wrapperPkg = { resolver, wrapper, options };

    if (hasFieldResolverPackage(type, wrapperPkg) && field && wrapperFor === WrapperFor.FIELD) {
      const { wrapper, resolver, options } = wrapperPkg;
      const expandedOptions: FieldResolverWrapperOptions = {
        ...options,
        type: options.type as GraphQLObjectType,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        field: options.field as GraphQLField<any, any>,
      };

      return wrapper(resolver, expandedOptions);
    } else if (hasTypeResolverPackage(type, wrapperPkg) && !field && wrapperFor === WrapperFor.TYPE) {
      const { wrapper, resolver, options } = wrapperPkg;
      const expandedOptions: TypeResolverWrapperOptions = {
        ...options,
        type: type as GraphQLAbstractType,
        field: undefined,
      };

      return wrapper(resolver, expandedOptions);
    } else if (wrapperFor === WrapperFor['*']) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (wrapper as any)(resolver, options);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return resolver as any;
  }
}

export function createWrapper(name: string, wrapperFor: WrapperFor.TYPE, wrapperFn: TypeWrapperFunction): NamedWrapper;
export function createWrapper(name: string, wrapperFor: WrapperFor.FIELD, wrapperFn: FieldWrapperFunction): NamedWrapper;
export function createWrapper(
  name: string,
  wrapperFor: WrapperFor = WrapperFor['*'],
  wrapperFn: FieldWrapperFunction | TypeWrapperFunction,
): NamedWrapper {
  return new NamedWrapper(name, wrapperFn, wrapperFor);
}

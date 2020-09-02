import { GraphQLObjectType, isObjectType, isAbstractType, GraphQLType, GraphQLAbstractType } from 'graphql';
import { FieldResolver, TypeResolver, ObjectField } from '../types';
import { WrapperFor } from './constant';
import {
  GenericWrapperFunction,
  FieldWrapperFunction,
  TypeWrapperFunction,
  NamedWrapper,
  FieldResolverWrapperOptions,
  TypeResolverWrapperOptions,
  BaseWrapperOptions,
} from './types';

function hasFieldResolverPackage(
  type: GraphQLType,
  pkg: {
    resolver: FieldResolver | TypeResolver;
    wrapper: GenericWrapperFunction | FieldWrapperFunction | TypeWrapperFunction;
    options: BaseWrapperOptions;
  },
): pkg is { resolver: FieldResolver; wrapper: FieldWrapperFunction; options: FieldResolverWrapperOptions } {
  return Boolean(isObjectType(type) && pkg);
}

function hasTypeResolverPackage(
  type: GraphQLType,
  pkg: {
    resolver: FieldResolver | TypeResolver;
    wrapper: GenericWrapperFunction | FieldWrapperFunction | TypeWrapperFunction;
    options: BaseWrapperOptions;
  },
): pkg is { resolver: TypeResolver; wrapper: TypeWrapperFunction; options: TypeResolverWrapperOptions } {
  return Boolean(isAbstractType(type) && pkg);
}

class InternalNamedWrapper implements NamedWrapper {
  name: string;
  wrapper: FieldWrapperFunction | TypeWrapperFunction | GenericWrapperFunction;
  wrapperFor: WrapperFor;

  constructor(
    name: string,
    wrapperFor: WrapperFor,
    wrapperFn: FieldWrapperFunction | TypeWrapperFunction | GenericWrapperFunction,
  ) {
    if (typeof name !== 'string') {
      throw new Error('Specify a string for the name argument for createWrapper');
    }

    this.name = name;
    this.wrapper = wrapperFn;
    this.wrapperFor = wrapperFor;
  }

  async wrap(resolver: TypeResolver, options: TypeResolverWrapperOptions): Promise<TypeResolver>;
  async wrap(resolver: FieldResolver, options: FieldResolverWrapperOptions): Promise<FieldResolver>;
  async wrap(
    resolver: FieldResolver | TypeResolver,
    options: BaseWrapperOptions,
  ): Promise<FieldResolver | TypeResolver>;
  async wrap(
    resolver: FieldResolver | TypeResolver,
    options: BaseWrapperOptions | FieldResolverWrapperOptions,
  ): Promise<FieldResolver | TypeResolver> {
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
        field: options.field as ObjectField,
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
    } else if (wrapperFor === WrapperFor.ANY) {
      return (wrapper as GenericWrapperFunction)(resolver, options);
    }

    return resolver;
  }
}

type WrapperFn = {
  [WrapperFor.FIELD]: FieldWrapperFunction;
  [WrapperFor.TYPE]: TypeWrapperFunction;
  [WrapperFor.ANY]: GenericWrapperFunction;
};

export function createWrapper<K extends WrapperFor>(
  name: string,
  wrapperFor: K,
  wrapperFn: WrapperFn[K],
): NamedWrapper {
  return new InternalNamedWrapper(name, wrapperFor, wrapperFn);
}

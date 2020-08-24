import {
  GraphQLObjectType,
  GraphQLField,
  isObjectType,
  isAbstractType,
  GraphQLType,
  GraphQLAbstractType,
} from 'graphql';
import {
  FieldResolver,
  FieldWrapperFunction,
  TypeWrapperFunction,
  TypeResolver,
  NamedWrapper,
  WrapperOptionsBase,
  GenericWrapperFunction,
  WrapperFor,
} from '../types';

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
    wrapper: GenericWrapperFunction | FieldWrapperFunction | TypeWrapperFunction;
    options: WrapperOptionsBase;
  },
): pkg is { resolver: FieldResolver; wrapper: FieldWrapperFunction; options: FieldResolverWrapperOptions } {
  return Boolean(isObjectType(type) && pkg);
}

function hasTypeResolverPackage(
  type: GraphQLType,
  pkg: {
    resolver: FieldResolver | TypeResolver;
    wrapper: GenericWrapperFunction | FieldWrapperFunction | TypeWrapperFunction;
    options: WrapperOptionsBase;
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

  async wrap(resolver: TypeResolver, options: WrapperOptionsBase): Promise<TypeResolver>;
  async wrap(resolver: FieldResolver, options: WrapperOptionsBase): Promise<FieldResolver>;
  async wrap(
    resolver: FieldResolver | TypeResolver,
    options: WrapperOptionsBase,
  ): Promise<FieldResolver | TypeResolver>;
  async wrap(
    resolver: FieldResolver | TypeResolver,
    options: WrapperOptionsBase | FieldResolverWrapperOptions,
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
    } else if (wrapperFor === WrapperFor.ANY) {
      return (wrapper as GenericWrapperFunction)(resolver, options);
    }

    return resolver as FieldResolver;
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

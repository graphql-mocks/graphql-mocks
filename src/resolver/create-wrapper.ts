import { GraphQLObjectType, GraphQLField, isObjectType, isAbstractType } from 'graphql';
import {
  FieldResolver,
  ResolverWrapperOptions,
  Wrapper,
  FieldWrapper,
  TypeWrapper,
  FieldResolverWrapperOptions,
  TypeResolverWrapperOptions,
} from '../types';
import { TypeResolver } from 'graphql/utilities/buildASTSchema';

enum WrapperFor {
  TYPE = 'TYPE',
  FIELD = 'FIELD',
  '*' = '*',
}

class Handler {
  name: string;
  wrapper: Wrapper;
  wrapperFor: WrapperFor;

  constructor(name: string, wrapper: Wrapper, wrapperFor: WrapperFor = WrapperFor['*']) {
    this.name = name;
    this.wrapper = wrapper;
    this.wrapperFor = wrapperFor;
  }

  async wrap(
    resolver: FieldResolver | TypeResolver,
    options: ResolverWrapperOptions,
  ): Promise<FieldResolver | TypeResolver> {
    const wrapper = this.wrapper;
    const wrapperFor = this.wrapperFor;

    if (isObjectType(options.type) && options.field && wrapperFor === WrapperFor.FIELD) {
      const expandedOptions: FieldResolverWrapperOptions = {
        ...options,
        type: options.type as GraphQLObjectType,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        field: options.field as GraphQLField<any, any>,
      };

      return (wrapper as FieldWrapper)(resolver as FieldResolver, expandedOptions);
    } else if (isAbstractType(options.type) && !options.field && wrapperFor === WrapperFor.FIELD) {
      const expandedOptions: TypeResolverWrapperOptions = {
        ...options,
        type: options.type,
        field: undefined,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (wrapper as any)(resolver, expandedOptions);
    } else if (wrapperFor === WrapperFor['*']) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (wrapper as any)(resolver, options);
    }

    return resolver;
  }
}

// eslint-disable-next-line prettier/prettier
export function createWrapper(name: string, wrapperFor: WrapperFor.TYPE, wrapper: TypeWrapper): Handler;
// eslint-disable-next-line prettier/prettier
export function createWrapper(name: string, wrapperFor: WrapperFor.FIELD, wrapper: FieldWrapper): Handler;
export function createWrapper(name: string, wrapperFor: WrapperFor, wrapper: Wrapper): Handler {
  return new Handler(name, wrapper, wrapperFor);
}

import { ResolverContext, FieldResolver, TypeResolver, WrapperFor } from '../types';
import { defaultPackOptions } from './pack';
import { PackOptions } from './types';
import { createWrapper } from '../resolver/create-wrapper';
import { isObjectType, isAbstractType, GraphQLType } from 'graphql';

export function normalizePackOptions(packOptions: Partial<PackOptions> = defaultPackOptions): PackOptions {
  const normalized = {
    ...defaultPackOptions,

    dependencies: packOptions.dependencies ?? defaultPackOptions.dependencies,
    state: packOptions.state ?? defaultPackOptions.state,
  };

  return normalized;
}

export function embedPackOptionsInContext(context: Record<string, unknown>, packOptions: PackOptions): ResolverContext {
  context = context ?? {};
  context = {
    ...context,
    pack: context.pack || packOptions,
  };

  return context;
}

export function isTypeResolver(type: GraphQLType, resolver: FieldResolver | TypeResolver): resolver is TypeResolver {
  return Boolean(isAbstractType(type) && resolver);
}

export function isFieldResolver(type: GraphQLType, resolver: FieldResolver | TypeResolver): resolver is FieldResolver {
  return Boolean(isObjectType(type) && resolver);
}

export const embedPackOptionsWrapper = createWrapper(
  'embed-pack-options',
  WrapperFor.ANY,
  async (resolver, options) => {
    const { type } = options;

    if (isFieldResolver(type, resolver)) {
      const fieldResolver: FieldResolver = (parent, args, context, info) => {
        context = embedPackOptionsInContext(context, options.packOptions);
        return resolver(parent, args, context, info);
      };

      return fieldResolver;
    }

    if (isTypeResolver(type, resolver)) {
      const typeResolver: TypeResolver = (value, context, info, abstractType) => {
        context = embedPackOptionsInContext(context, options.packOptions);
        return (resolver as TypeResolver)(value, context, info, abstractType);
      };

      return typeResolver;
    }

    return resolver;
  },
);

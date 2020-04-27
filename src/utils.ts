import { Resolver, PackOptions } from './types';

export const unwrap = (type: any): any => (type?.ofType ? unwrap(type.ofType) : type);

export const extractDependencies = (context: any) => context?.pack?.dependencies;

export const embedPackOptions = (resolver: Resolver, packOptions: PackOptions) => {
  return (parent: any, args: any, context: any, info: any) => {
    context = context || {};
    context = {
      ...context,
      pack: context.pack || packOptions,
    };

    return resolver(parent, args, context, info);
  };
};

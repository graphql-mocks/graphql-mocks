import { wrapEach } from './wrap-each';
import { Resolver, PackOptions } from '../types';

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

export const packWrapper = wrapEach((resolver, { packOptions }) => {
  return embedPackOptions(resolver, packOptions);
});

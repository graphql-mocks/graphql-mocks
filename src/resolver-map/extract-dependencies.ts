import { ResolverContext, PackOptions } from '../types';

export const extractDependencies = <T>(
  context: ResolverContext & {
    pack?: { dependencies?: PackOptions['dependencies'] };
  },
): Partial<T> => {
  return (context?.pack?.dependencies ?? {}) as Partial<T>;
};

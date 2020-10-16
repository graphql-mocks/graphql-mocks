import { PackOptions } from 'graphql-mocks/pack/types';

export const generatePackOptions: (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mixin?: Record<string, any>,
) => PackOptions = (mixin = {}) => {
  return {
    ...mixin,
    state: { ...mixin.state },
    dependencies: { ...mixin.dependencies },
  };
};

import { PackOptions } from '../src/types';

export const generatePackOptions: (mixin?: Record<any, any>) => PackOptions = (mixin = {}) => {
  return {
    ...mixin,
    state: { ...mixin.state },
    dependencies: { ...mixin.dependencies },
  };
};

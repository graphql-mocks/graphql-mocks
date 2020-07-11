import { ResolverMapMiddleware, ResolverMap, ResolverContext } from '../types';

type NonNullDependency = object | string | boolean | symbol | number;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PackState = Record<any, any>;
export type Packed = { resolverMap: ResolverMap; state: PackState };

export type PackOptions = {
  state: PackState;
  dependencies: Record<string, NonNullDependency>;
};

export type Packer = (
  initialMap: ResolverMap,
  middlewares: ResolverMapMiddleware[],
  packOptions?: Partial<PackOptions>,
) => Promise<Packed>;

export type PackedContext = ResolverContext & {
  pack?: { dependencies?: PackOptions['dependencies'] };
};

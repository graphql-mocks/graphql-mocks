export type Resolver = (parent: any, args: any, context: any, info: any) => any | Promise<any>;

export type ResolverMap = {
  [type: string]: {
    [field: string]: Resolver;
  };
};

export type PackState = Record<any, any>;
export type PackOptions = {
  state: PackState;
  dependencies: Record<string, any>;
};
export type ResolverMapWrapper = (map: ResolverMap, packOptions: PackOptions) => ResolverMap;

export type Packed = { resolvers: ResolverMap; state: PackState };
export type Packager = (
  initialMap: ResolverMap,
  wrappers: ResolverMapWrapper[],
  packOptions?: Partial<PackOptions>,
) => Packed;

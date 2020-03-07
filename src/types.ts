type Resolver = (parent: any, args: any, context: any, info: any) => any;

type ResolverMap = {
    [type: string]: {
      [field: string] : Resolver
    }
  }

type ResolverMapWrapper = (map: ResolverMap) => ResolverMap;

export type Packager = (initialMap: ResolverMap, wrappers: ResolverMapWrapper[]) => ResolverMap;

export {
  Resolver,
  ResolverMap,
  ResolverMapWrapper
}

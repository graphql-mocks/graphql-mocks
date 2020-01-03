type Resolver = (parent: any, args: any, context: any, info: any) => any;

type FieldResolvers = {
    [type: string]: {
      [field: string] : Resolver
    }
  }

type ResolverReducer = (resolvers: FieldResolvers) => FieldResolvers;

export {
  Resolver,
  FieldResolvers,
  ResolverReducer
}

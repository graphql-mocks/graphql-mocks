export function addMirageResolverContext(fn: any, mirageServer: any) {
  return (parent: any, args: any, context: any, info: any) => {
    context = {
      mirageServer,
      mirageSerialize: (thingToSerialize: any) => mirageServer.serializerOrRegistry.serialize(thingToSerialize),
      ...context
    };

    return fn(parent, args, context, info);
  };
}

export default function applyAddMirageResolverContextexport(mirageServer: any, _mirageGraphQLMap: any) {
  return (resolvers: any) => {
    for (const type in resolvers) {
      for (const field in resolvers[type]) {
        const resolver = resolvers[type][field];
        resolvers[type][field] = addMirageResolverContext(resolver, mirageServer)
      }
    }

    return resolvers;
  }
}

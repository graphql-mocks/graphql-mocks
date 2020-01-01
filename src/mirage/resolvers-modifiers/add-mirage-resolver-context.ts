export function addMirageResolverContext(resolver: any, mirageServer: any) {
  return (parent: any, args: any, context: any, info: any) => {
    context = context || {};
    context.mirage = context.mirage || {};
    context.mirage.server = context.mirage.server || mirageServer;
    context.mirage.serialize = context.mirage.serialize || mirageServer.serializerOrRegistry.serialize.bind(mirageServer.serializerOrRegistry);
    context.mirage.schema = context.mirage.schema || mirageServer.schema;

    return resolver(parent, args, context, info);
  };
}

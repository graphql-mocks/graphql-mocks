import reduceIterator from '../../resolvers/reduce-iterator';

export function addMirageToResolver(resolver: any, mirageServer: any) {
  return (parent: any, args: any, context: any, info: any) => {
    context = context || {};
    context.mirage = context.mirage || {};
    context.mirage.server = context.mirage.server || mirageServer;
    context.mirage.schema = context.mirage.schema || mirageServer.schema;

    return resolver(parent, args, context, info);
  };
}

export default (mirageServer: any) => reduceIterator(addMirageToResolver, mirageServer);

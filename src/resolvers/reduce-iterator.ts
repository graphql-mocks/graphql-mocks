export default (fn: any, ...args: any[]) => (resolvers: any) => {
  for (const type in resolvers) {
    for (const field in resolvers[type]) {
      const resolver = resolvers[type][field];
      const newResolver = fn(resolver, ...args, { resolvers, path: [type, field] });

      if (typeof newResolver !== 'function') {
        throw new Error(`${fn.toString()} must return a function for resolver type: ${type}, field: ${field}`);
      }

      resolvers[type][field] = newResolver;
    }
  }

  return resolvers;
}
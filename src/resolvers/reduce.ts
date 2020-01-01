export default (resolvers: any, resolverModifiers: any) => {
  return resolverModifiers.reduce(
    (resolvers: any, resolverModifier: any) => {
      resolvers = {
        ...resolvers
      };

      resolvers = resolverModifier(resolvers);
      if (typeof resolvers !== 'object') {
        throw new Error(`resolverModifier ${resolverModifier.toString()} should return a resolvers object, got ${typeof resolvers}`);
      }

      return resolvers;
    },
    resolvers
  );
};
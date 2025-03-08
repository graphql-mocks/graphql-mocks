import { GraphQLSchema, isAbstractType, defaultTypeResolver } from 'graphql';
import { ResolverMap } from '../../types';
import { createPipeline } from '../pipeline-resolver';

export function attachTypeResolversToSchema(schema: GraphQLSchema, resolverMap: ResolverMap): void {
  for (const typeName in resolverMap) {
    const type = schema.getType(typeName);

    //  Note: __resolveType for type resolvers is a convention borrowed from
    //  graphql-tools resolver maps. This allows a single ResolverMap to be used
    // for both type resolvers for abstract types (unions & interfaces), as well
    // as field resolvers
    const typeResolver = resolverMap[typeName].__resolveType ?? defaultTypeResolver;

    if (typeof typeResolver !== 'function') {
      return;
    }

    const pipeline = createPipeline<typeof typeResolver>([typeResolver]);

    if (isAbstractType(type)) {
      // attach the pipeline resolver to the type resolver
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type.resolveType = pipeline.resolver as any;
    }
  }
}

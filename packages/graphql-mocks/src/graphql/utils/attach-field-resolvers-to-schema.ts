import { defaultFieldResolver, GraphQLSchema, isObjectType } from 'graphql';
import { ResolverMap } from '../../types';
import { createPipeline } from '../pipeline-resolver';
import { isInternalType } from '../type-utils';

export function attachFieldResolversToSchema(schema: GraphQLSchema, resolverMap: ResolverMap): void {
  const types = schema.getTypeMap();
  const typeNames = Object.keys(types);
  for (const typeName of typeNames) {
    const type = schema.getType(typeName);

    if (!isObjectType(type) || isInternalType(type)) {
      continue;
    }

    const fieldMap = type.getFields();
    const fieldNames = Object.keys(fieldMap);
    for (const fieldName of fieldNames) {
      const resolver = resolverMap[typeName]?.[fieldName] ?? defaultFieldResolver;

      if (typeof resolver !== 'function') {
        return;
      }

      const pipeline = createPipeline<typeof resolver>([resolver]);
      const field = fieldMap[fieldName];

      // attach the pipeline resolver to the field resolver
      field.resolve = pipeline.resolver;
    }
  }
}

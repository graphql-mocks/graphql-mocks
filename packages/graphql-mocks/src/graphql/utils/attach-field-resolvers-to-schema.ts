import { GraphQLSchema, isObjectType } from 'graphql';
import { ResolverMap } from '../../types';

export function attachFieldResolversToSchema(schema: GraphQLSchema, resolverMap: ResolverMap): void {
  for (const typeName in resolverMap) {
    const type = schema.getType(typeName);

    if (!isObjectType(type)) {
      continue;
    }

    for (const fieldName in resolverMap[typeName]) {
      const resolver = resolverMap[typeName][fieldName];
      const fieldMap = type.getFields();
      const fieldNames = Object.keys(fieldMap);

      if (typeof resolver === 'function' && fieldNames.includes(fieldName)) {
        fieldMap[fieldName].resolve = resolver;
      }
    }
  }
}

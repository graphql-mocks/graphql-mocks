import { TargetReference, ResolverMap, FieldReference, SPECIAL_TYPE_TARGET, SPECIAL_FIELD_TARGET } from '../../types';
import { GraphQLSchema } from 'graphql';
import { expandTarget } from './expand-target';

export enum WalkSource {
  GRAPHQL_SCHEMA = 'GRAPHQL_SCHEMA',
  RESOLVER_MAP = 'RESOLVER_MAP',
}

export type WalkOptions = {
  target?: TargetReference;
  source?: WalkSource;
  resolverMap?: ResolverMap;
  graphqlSchema: GraphQLSchema;
};

export type WalkCallback = (fieldReference: FieldReference) => void | Promise<void>;

export async function walk(options: WalkOptions, callback: WalkCallback): Promise<void> {
  options = {
    target: [SPECIAL_TYPE_TARGET.ALL_TYPES, SPECIAL_FIELD_TARGET.ALL_FIELDS],
    source: WalkSource.GRAPHQL_SCHEMA,
    ...options,
  };

  const { target, graphqlSchema, source, resolverMap } = options;

  if (!graphqlSchema) {
    throw new Error(`graphqlSchema is required for performing \`walk\`, got ${typeof graphqlSchema}`);
  }

  if (!target) {
    throw new Error(`target is required for performing \`walk\`, got ${typeof target}`);
  }

  if (!callback) {
    throw new Error('A callback is required argument for the `walk` function');
  }

  if (typeof resolverMap !== 'object' && source === WalkSource.RESOLVER_MAP) {
    throw new Error(`To walk on a resolver map it must be provided in the options, got ${typeof resolverMap}`);
  }

  let fieldReferences = expandTarget(target, graphqlSchema);

  if (source === WalkSource.RESOLVER_MAP) {
    fieldReferences = fieldReferences.filter(([typeName, fieldName]) => Boolean(resolverMap?.[typeName]?.[fieldName]));
  }

  for (const reference of fieldReferences) {
    await callback(reference);
  }
}

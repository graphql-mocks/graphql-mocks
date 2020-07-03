import { ResolverMap } from '../types';
import { GraphQLSchema } from 'graphql';
import { expandTarget, TargetReference, SPECIAL_TYPE_TARGET, SPECIAL_FIELD_TARGET } from './reference/target-reference';
import { fieldExistsInResolverMap, FieldReference } from './reference/field-reference';

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

  let fieldReferences = expandTarget(target, graphqlSchema);

  if (fieldReferences) {
    if (source === WalkSource.RESOLVER_MAP) {
      if (typeof resolverMap !== 'object') {
        throw new Error(`To walk on a resolver map it must be provided in the options, got ${typeof resolverMap}`);
      }

      fieldReferences = fieldReferences.filter((fieldReference) =>
        fieldExistsInResolverMap(fieldReference, resolverMap as ResolverMap),
      );
    }

    for (const reference of fieldReferences) {
      await callback(reference);
    }
  }
}

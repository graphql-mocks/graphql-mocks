import { ResolverMap } from '../types';
import { GraphQLSchema } from 'graphql';
import { SPECIAL_TYPE_TARGET, SPECIAL_FIELD_TARGET, expand } from '../resolver-map/reference/target-reference';
import { fieldExistsInResolverMap, FieldReference, difference } from '../resolver-map/reference/field-reference';
import { TargetableMiddlewareOptions } from '../resolver-map/types';

export enum WalkSource {
  GRAPHQL_SCHEMA = 'GRAPHQL_SCHEMA',
  RESOLVER_MAP = 'RESOLVER_MAP',
}

export type WalkOptions = {
  source?: WalkSource;
  resolverMap?: ResolverMap;
  graphqlSchema: GraphQLSchema;
} & TargetableMiddlewareOptions;

export type WalkCallback = (fieldReference: FieldReference) => void | Promise<void>;

export async function walk(options: WalkOptions, callback: WalkCallback): Promise<void> {
  options = {
    include: [SPECIAL_TYPE_TARGET.ALL_TYPES, SPECIAL_FIELD_TARGET.ALL_FIELDS],
    exclude: [],
    source: WalkSource.GRAPHQL_SCHEMA,
    ...options,
  };

  const { include, exclude, graphqlSchema, source, resolverMap } = options;

  if (!graphqlSchema) {
    throw new Error(`graphqlSchema is required for performing \`walk\`, got ${typeof graphqlSchema}`);
  }

  if (!include) {
    throw new Error(`target is required for performing \`walk\`, got ${typeof include}`);
  }

  if (!callback) {
    throw new Error('A callback is required argument for the `walk` function');
  }

  const includeFieldReferences = expand(include, graphqlSchema);
  const excludeFieldReferences = expand(exclude ?? [], graphqlSchema);
  let fieldReferences = difference(includeFieldReferences, excludeFieldReferences);

  if (fieldReferences) {
    if (source === WalkSource.RESOLVER_MAP) {
      if (typeof resolverMap !== 'object') {
        throw new Error(`To walk on a resolver map it must be provided in the options, got ${typeof resolverMap}`);
      }

      // filter field references based on what is available in Resolver Map
      fieldReferences = fieldReferences.filter((fieldReference) =>
        fieldExistsInResolverMap(fieldReference, resolverMap as ResolverMap),
      );
    }

    for (const reference of fieldReferences) {
      await callback(reference);
    }
  }
}

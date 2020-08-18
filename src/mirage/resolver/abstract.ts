import { GraphQLSchema, GraphQLTypeResolver, GraphQLAbstractType, GraphQLObjectType } from 'graphql';
import { MirageGraphQLMapper } from '../mapper/mapper';
import { findMostInCommon, convertModelNameToTypeName } from './utils';
import { extractDependencies } from '../../resolver/extract-dependencies';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mirageAbstractTypeResolver: GraphQLTypeResolver<any, any> = function mirageUnionResolver(
  obj,
  context,
  _info,
  abstractType: GraphQLAbstractType,
) {
  const useFindInCommon = '__testUseFindInCommon' in context ? context.__testUseFindInCommon : true;

  const { graphqlSchema } = extractDependencies<{
    graphqlSchema: GraphQLSchema;
  }>(context, ['graphqlSchema']);

  const { mirageMapper } = extractDependencies<{
    mirageMapper: MirageGraphQLMapper;
  }>(context, ['mirageMapper'], { required: false });

  const possibleConcreteTypes = graphqlSchema.getPossibleTypes(abstractType) as GraphQLObjectType[];
  const possibleConcreteTypeNames = possibleConcreteTypes.map((type) => type.name);

  const modelName = convertModelNameToTypeName(obj?.modelName);
  let matchingFieldsCandidate;
  let matchingFieldsCandidateError;

  try {
    matchingFieldsCandidate = useFindInCommon ? findMostInCommon(obj, possibleConcreteTypes) : undefined;
  } catch (error) {
    matchingFieldsCandidateError = error;
  }

  const mappedModelName = mirageMapper && modelName && mirageMapper.findMatchForModel(modelName);
  const candidates = [mappedModelName, modelName, matchingFieldsCandidate].filter(Boolean) as string[];

  const match = candidates.find((candidateName) => {
    const candidate = graphqlSchema.getType(candidateName);
    if (!candidate || !candidate?.name) return false;

    return possibleConcreteTypeNames.includes(candidate.name);
  });

  if (!match) {
    const formattedPossibleTypes = possibleConcreteTypeNames.map((c) => `*  ${c}`);
    const formattedCandidates = candidates.map((c) => `*  ${c}`);

    // InterfaceType or UnionType
    const kindName = abstractType?.astNode?.kind.replace('Definition', '');

    let matchingFieldsError;
    if (matchingFieldsCandidateError) {
      matchingFieldsError =
        `Tried to automatically find type based on matching fields. ` + matchingFieldsCandidateError.message;
    }

    let mirageModelMessage;
    if (modelName) {
      mirageModelMessage =
        `Received model "${modelName}" which did not match one of the possible types above. ` +
        `If "${modelName}" represents one of the possible types, fix the model name ` +
        `or use a MirageGraphQLMapper instance with a type mapping ["TypeName", "${modelName}"]. ` +
        `\n\n` +
        `If "${modelName}" is the abstract type "${abstractType.name}", consider ` +
        `only creating models for discrete types and using { polymorphic: true } along with any ` +
        `corresponding { inverse: true } relationships that point to the polymorphic field ` +
        `that represent "${abstractType.name}. See the the Mirage JS section of the docs at ` +
        `www.graphql-mocks.com for examples.`;
    }

    const lastResortMessage =
      `As a last resort, a manual Type Resolver can be added to the Resolver Map at ` +
      `["${abstractType.name}", "__resolveType"] that is passed into the \`createRouteHandler\`, ` +
      `\`GraphQLHandler\` instance, or \`pack\` function. Ensure that it returns one of the possible types listed above.`;

    const message = [
      `Unable to find a matching type for resolving for ${kindName} type "${abstractType.name}".`,

      ' ',

      `It *must* resolve to one of these possible types:`,
      ...formattedPossibleTypes,

      ' ',

      'Tried types:',
      ...formattedCandidates,

      ' ',

      matchingFieldsError,

      ' ',

      mirageModelMessage,

      ' ',

      lastResortMessage,
    ]
      .filter(Boolean)
      .join('\n');

    throw new Error(message);
  }

  return match;
};

import { GraphQLSchema, GraphQLTypeResolver, GraphQLAbstractType, GraphQLObjectType } from 'graphql';
import { MirageGraphQLMapper } from '../mapper/mapper';
import { findTypeWithFieldsMostInCommon, convertModelNameToTypeName } from './utils';
import { extractDependencies } from '../../resolver/extract-dependencies';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mirageAbstractTypeResolver: GraphQLTypeResolver<any, any> = function mirageUnionResolver(
  obj,
  context,
  _info,
  abstractType: GraphQLAbstractType,
) {
  const useFindInCommon = '__useFindInCommon' in context ? context.__useFindInCommon : true;

  const { graphqlSchema } = extractDependencies<{
    graphqlSchema: GraphQLSchema;
  }>(context, ['graphqlSchema']);

  const { mirageMapper } = extractDependencies<{
    mirageMapper: MirageGraphQLMapper;
  }>(context, ['mirageMapper'], { required: false });

  const modelName = convertModelNameToTypeName(obj?.modelName);
  const possibleConcreteTypes = graphqlSchema.getPossibleTypes(abstractType) as GraphQLObjectType[];
  const possibleConcreteTypeNames = possibleConcreteTypes.map((type) => type.name);

  // Find the candidate that matches most closely based on matching number of fields
  let matchingFieldsCandidate;

  try {
    matchingFieldsCandidate = useFindInCommon ? findTypeWithFieldsMostInCommon(obj, possibleConcreteTypes) : undefined;
  } catch {
    'Tried to find a match automatically based on matching properties' +
      'from the object against fields in the possible types...';
  }

  const mappedModelName = mirageMapper && modelName && mirageMapper.findMatchForModel(modelName);
  const typenameInModel = '__typename' in obj ? obj.__typename : undefined;

  // Prefer a matching type name in this order:
  // 1. typenameInModel - embedded __typename property on the object or a model
  // 2. mappedModelName - modelName mapped to a type name
  // 3. modelName - the modelName property on the object
  // 4. matchingFieldsCandidate - a lucky guess at looking and hoping the most
  // matching fields is the way to go
  const typeNameCandidates = [typenameInModel, mappedModelName, modelName, matchingFieldsCandidate].filter(
    Boolean,
  ) as string[];

  const match = typeNameCandidates.find((typeNameCandidate) => possibleConcreteTypeNames.includes(typeNameCandidate));
  if (!match) {
    const formattedPossibleTypes = possibleConcreteTypeNames.map((c) => `*  ${c}`);
    const formattedCandidates = typeNameCandidates.map((c) => `*  ${c}`);

    // InterfaceType or UnionType
    const kindName = abstractType?.astNode?.kind.replace('Definition', '');

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
        `that represent "${abstractType.name}.`;
    }

    const lastResortMessage =
      `As a last resort, a manual Type Resolver can be added to the Resolver Map at ` +
      `["${abstractType.name}", "__resolveType"] that is passed into the \`createRouteHandler\`, ` +
      `\`GraphQLHandler\` instance, or \`pack\` function. Ensure that it returns one of the possible types listed above.` +
      `\n\n` +
      `See the the Mirage JS section of the docs at www.graphql-mocks.com for examples.`;

    const message = [
      `Unable to find a matching type for resolving for ${kindName} type "${abstractType.name}".`,

      ' ',

      `It *must* resolve to one of these possible types:`,
      ...formattedPossibleTypes,

      ' ',

      'Tried types:',
      ...formattedCandidates,

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

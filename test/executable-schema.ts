import {graphql, buildSchema, GraphQLObjectType} from 'graphql'
import {makeExecutableSchema} from 'graphql-tools';
import {importSchema} from 'graphql-import';
import _resolvers from './resolvers';
import path from 'path';
import { serialize, schema as mirageSchema } from './mirage';

const {pluralize} = require("inflected");

const resolvers = {
  ..._resolvers
};

console.log(resolvers);

const schemaPath = path.resolve(__dirname, 'schema.graphql');
const typeDefs = importSchema(schemaPath);

const tempSchema = buildSchema(typeDefs);
const typeMap = tempSchema.getTypeMap();

const mirageFieldResolver: any = (mirageType: string, mirageField: string) => (parent: any) => {
  mirageType = pluralize(mirageType).toLowerCase();
  mirageField = mirageField.toLowerCase();

  const resolvedModel = mirageSchema[mirageType].find(parent.id);

  if (!resolvedModel) {
    throw new Error(`Could not resolve for mirage type: ${mirageType} with id: ${parent.id}`);
  }

  if (!resolvedModel[mirageField]) {
    throw new Error(`${mirageField} does not exist on mirage type: ${mirageType} with id: ${parent.id}`);
  }

  const resolvedField = resolvedModel[mirageField];
  return serialize(resolvedField);
}

const unwrapType: any = (type: any) => type.ofType ? unwrapType(type.ofType) : type

const mirageGraphQLMap = [{
  mirage: ['Post', 'comments'],
  graphql: ['Post', 'comments']
}]

for (const type of Object.keys(typeMap)) {
  if (typeMap[type] instanceof GraphQLObjectType) {
    const fields = (typeMap[type] as GraphQLObjectType).getFields();

    for (const field of Object.keys(fields)) {
      resolvers[type] = resolvers[type] || {};
      if (type === 'Query' || type === 'Mutation' || type.indexOf('__') === 0) {
        continue;
      }

      if (!resolvers[type][field]) {
        const match = mirageGraphQLMap.find(
          (mapDefinition) => mapDefinition.graphql[0] === type && mapDefinition.graphql[1] === field
        );

        const mirageType = match ? match.mirage[0] : type;
        const mirageField = match ?  match.mirage[1] : field;
        resolvers[type][field] = mirageFieldResolver(mirageType, mirageField);
      }
    }
  }
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

export const graphQLHandler = (query: any, variables: any = {}) => graphql(
  schema, query, null, null, variables
);

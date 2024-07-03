import { GraphQLSchema, DocumentNode, isSchema, buildASTSchema, buildSchema, printSchema } from 'graphql';

function copySchema(schema: GraphQLSchema): GraphQLSchema {
  return buildSchema(printSchema(schema));
}

export function createSchema(schema: GraphQLSchema | DocumentNode | string): GraphQLSchema {
  if (isSchema(schema)) return copySchema(schema);

  if (typeof schema === 'object' && schema.kind === 'Document') {
    try {
      return buildASTSchema(schema);
    } catch (error) {
      throw new Error(
        'Unable to build a schema from the AST Schema passed into the `graphqlSchema` dependency. Failed with error:\n\n' +
          (error as Error).message,
      );
    }
  }

  if (typeof schema === 'string') {
    try {
      return buildSchema(schema);
    } catch (error) {
      throw new Error(
        'Unable to build a schema from the string passed into the `graphqlSchema` dependency. Failed with error:\n\n' +
          (error as Error).message,
      );
    }
  }

  throw new Error('Unable to build schema, pass in an instance of schema or a string');
}

import { GraphQLSchema, DocumentNode, isSchema, buildASTSchema, buildSchema } from 'graphql';
import { copySchema } from '../utils/copy-schema';

export function createSchema(
  schema: GraphQLSchema | DocumentNode | string,
  options: { makeCopy: boolean },
): GraphQLSchema {
  if (isSchema(schema)) {
    if (!options.makeCopy) {
      return schema;
    }

    return copySchema(schema);
  }

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

// import { expect } from 'chai';

import { buildSchema } from 'graphql';
import { GraphQLHandler } from '../../../src/graphql';

describe.only('performance', function () {
  function buildLargeSchema() {
    const typeNames = new Array(10_000).fill(null).map((_, i) => `GraphQLType_${i}`);
    const typeDefinitions = typeNames.map((typeName) =>
      `
        type ${typeName} {
          fieldOne: String!
          fieldTwo: String!
          fieldThree: String!
          fieldFour: String!
          fieldFive: String!
        }
      `.trim(),
    );

    const typesAsQueryFields = typeNames.map((typeName, i) => `graphQLType_${i}: ${typeName}!`);

    const schema = `
      schema {
        query: Query
      }

      type Query {
        ${typesAsQueryFields.join('\n')}
      }

      ${typeDefinitions.join('\n')}
    `;

    console.log(performance.now(), 'finished creating schema string, building schema');
    const schemaInstance = buildSchema(schema);
    console.log(performance.now(), 'finished creating schema instance');

    return schemaInstance;
  }

  it('handles a large schema', async function () {
    console.log(performance.now(), 'creating instance');
    const handler = new GraphQLHandler({
      dependencies: {
        graphqlSchema: buildLargeSchema(),
      },
    });

    console.log(performance.now(), 'starting pack');
    await handler.pack();
    console.log(performance.now(), 'finished pack');
  });
});

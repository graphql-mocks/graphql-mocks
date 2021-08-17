import { expect } from 'chai';
import { GraphQLObjectType } from 'graphql';
import { createDocument } from '../../../../src/document/create-document';
import { scalarFieldValidator } from '../../../../src/validations/validators/scalar-field';
import { buildTestSchema, createMockFieldValidatorOptions } from '../test-helpers';

it('throws on a graphql scalar field mismatch', () => {
  const graphqlSchema = buildTestSchema(`
      donutsEaten: Float
    `);

  const document = createDocument('Person', {
    donutsEaten: {
      /* `donutsEaten` should be an Float, not an object */
    },
  });

  expect(() =>
    scalarFieldValidator.validate(
      createMockFieldValidatorOptions({
        graphqlSchema,
        document,
        type: graphqlSchema.getType('Person') as GraphQLObjectType,
        fieldName: 'donutsEaten',
      }),
    ),
  ).to.throw(
    'The field "donutsEaten" represents a graphql "Float" type and on the document should be a boolean, number, string, but got object',
  );
});

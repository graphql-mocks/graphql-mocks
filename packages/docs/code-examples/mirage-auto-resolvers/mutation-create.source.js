import { GraphQLHandler } from 'graphql-mocks';
import { createServer, Model } from 'miragejs';
import { extractDependencies } from 'graphql-mocks/resolver';

const mirageServer = createServer({
  models: {
    wizard: Model,
  },
});

const graphqlSchema = `
  schema {
    query: Query
    mutation: Mutation
  }

  type Query {
    wizards: [Wizard!]!
  }

  type Mutation {
    # Create mutation
    addWizard(input: AddWizardInput): Wizard!
  }

  type Wizard {
    id: ID!
    name: String!
    house: House!
  }

  input AddWizardInput {
    name: String!
    house: House!
  }

  enum House {
    Gryffindor
    Hufflepuff
    Ravenclaw
    Slytherin
  }
`;

// Represents the resolverMap with our static Resolver Function
// using `extractDependencies` to handle the input args and
// return the added Wizard
const resolverMap = {
  Mutation: {
    addWizard(_root, args, context, _info) {
      const { mirageServer } = extractDependencies(context, ['mirageServer']);

      const addedWizard = mirageServer.schema.wizards.create({
        name: args.input.name,
        house: args.input.house,
      });

      return addedWizard;
    },
  },
};

const handler = new GraphQLHandler({
  resolverMap,
  dependencies: {
    graphqlSchema,
    mirageServer,
  },
});

const mutation = handler.query(
  `
    mutation($wizard: AddWizardInput) {
      addWizard(input: $wizard) {
        id
        name
        house
      }
    }
  `,

  // Pass external variables for the mutation
  {
    wizard: {
      name: 'Bellatrix Lestrange',
      house: 'Slytherin',
    },
  },
);

codegen(`
  const {output} = require('../helpers');
  module.exports = output("module.exports = { mutation }", "mutation.then(result => console.log(result))");
`);

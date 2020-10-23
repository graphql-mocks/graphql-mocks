import { GraphQLHandler } from 'graphql-mocks';
import { createServer, Model } from 'miragejs';
import { extractDependencies } from 'graphql-mocks/resolver';

const mirageServer = createServer({
  models: {
    wizard: Model,
  },
});

const harry = mirageServer.schema.create('wizard', {
  name: 'Harry Potter',
  house: 'Gryffindor',
});

const voldemort = mirageServer.schema.create('wizard', {
  name: 'Tom Riddle',
  house: 'Slytherin',
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
    # Remove
    removeWizard(wizardId: ID!): Wizard!
  }

  type Wizard {
    id: ID!
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

const resolverMap = {
  Mutation: {
    removeWizard(_root, args, context, _info) {
      const { mirageServer } = extractDependencies(context, ['mirageServer']);

      const wizard = mirageServer.schema.wizards.find(args.wizardId);
      wizard.destroy();

      return wizard;
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
    mutation($wizardId: ID!) {
      removeWizard(wizardId: $wizardId) {
        id
        name
        house
      }
    }
  `,

  // Pass external variables for the mutation
  {
    wizardId: voldemort.id,
  },
);

codegen(`
  const {output} = require('../helpers');
  module.exports = output("module.exports = { mutation }", "mutation.then(result => console.log(result))");
`);

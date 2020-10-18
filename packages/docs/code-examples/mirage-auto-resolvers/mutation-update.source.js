import { GraphQLHandler } from 'graphql-mocks';
import { createServer, Model } from 'miragejs';
import { extractDependencies } from 'graphql-mocks/resolver';

const mirageServer = createServer({
  models: {
    wizard: Model,
  },
});

// Create Voldemort (Tom Riddle) in Mirage JS
// Whoops! He's been assigned the wrong house
// but we can fix this via a GraphQL Mutation
const voldemort = mirageServer.schema.create('wizard', {
  name: 'Tom Riddle',
  house: 'Hufflepuff',
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
    # Update
    updateHouse(wizardId: ID!, house: House!): Wizard!
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
    updateHouse(_root, args, context, _info) {
      const { mirageServer } = extractDependencies(['mirageServer'], context);

      // lookup and update the house on the wizard with args
      const wizard = mirageServer.schema.wizards.find(args.wizardId);
      wizard.house = args.house;

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
    mutation($wizardId: ID!, $house: House!) {
      updateHouse(wizardId: $wizardId, house: $house) {
        id
        name
        house
      }
    }
  `,

  // Pass external variables for the mutation
  {
    wizardId: voldemort.id, // corresponds with the model we created above
    house: 'Slytherin',
  },
);

codegen(`
  const {output} = require('../helpers');
  module.exports = output("module.exports = { mutation }", "mutation.then(result => console.log(result))");
`);

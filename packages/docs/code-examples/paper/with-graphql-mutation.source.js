codegen(`
const {output} = require('../helpers');
module.exports = output("import schemaString from './with-graphql-schema.source';", "import schemaString from './schema';");
`);
import { Paper } from 'graphql-paper';
import { graphql, buildSchema } from 'graphql';

async function run() {
  const graphqlSchema = buildSchema(schemaString);
  const paper = new Paper(graphqlSchema);

  const mutationType = graphqlSchema.getMutationType();
  const mutationTypeFields = mutationType.getFields();

  mutationTypeFields.addFilm.resolve = function filmsResolver(root, args, context, info) {
    return paper.mutate(({ create, getStore }) => {
      const store = getStore();
      const maxIdReducer = (previous, { id }) => Math.max(Number(previous), Number(id)).toString();
      let lastFilmId = store.Film.reduce(maxIdReducer, '0');
      let lastActorId = store.Actor.reduce(maxIdReducer, '0');

      const newFilm = create('Film', {
        id: ++lastFilmId,
        title: args.input.title,
        year: args.input.year,
      });

      newFilm.actors = args.input.actors.map((actor) => {
        return create('Actor', {
          id: ++lastActorId,
          ...actor,
        });
      });

      return newFilm;
    });
  };

  const mutation = `
    mutation($addFilmInput: AddFilmInput!) {
      addFilm(input: $addFilmInput) {
        id
        title
        year
        actors {
          id
          name
        }
      }
    }
  `;

  const mutationInput = {
    title: 'My Girl',
    year: '1991',
    actors: [{ name: 'Anna Chlumsky' }],
  };

  const result = await graphql({
    source: mutation,
    schema: graphqlSchema,
    variableValues: { addFilmInput: mutationInput },
  });

  console.log(result);
  codegen(`
const {output} = require('../helpers');
module.exports = output("return result", "");
`);
}

// kick everything off!
codegen(`
const {output} = require('../helpers');
module.exports = output("module.exports.query = run", "run();");
`);

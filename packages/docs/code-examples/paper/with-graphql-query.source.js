codegen(`
const {output} = require('../helpers');
module.exports = output("import schemaString from './with-graphql-schema.source';", "import schemaString from './schema';");
`);
import { Paper } from 'graphql-paper';
import { graphql, buildSchema } from 'graphql';

const graphqlSchema = buildSchema(schemaString);
const paper = new Paper(graphqlSchema);

paper.mutate(({ create }) => {
  create('Film', {
    id: '1',
    title: 'Jurassic Park',
    year: '1993',
    actors: [
      { id: '1', name: 'Jeff Goldblum' },
      { id: '2', name: 'Wayne Knight' },
    ],
  });

  create('Film', {
    id: '2',
    title: 'Office Space',
    year: '1999',
    actors: [
      { id: '3', name: 'Ron Livingston' },
      { id: '4', name: 'Jennifer Aniston' },
    ],
  });
});

const queryType = graphqlSchema.getQueryType();
const queryTypeFields = queryType.getFields();

queryTypeFields.films.resolve = function filmsResolver(root, args, context, info) {
  // return all `Film` Documents
  return paper.data.Film;
};

queryTypeFields.film.resolve = function filmResolver(root, args, context, info) {
  return paper.data.Film.find((film) => film.id === args.filmId) ?? null;
};

const query = `
    query {
      film(filmId: "1") {
        id
        title
        year
        actors {
          id
          name
        }
      }

      films {
        id
        title
        year

        # will return the connected Actor documents automatically
        actors {
          id
          name
        }
      }
    }
  `;

const result = graphql({
  source: query,
  schema: graphqlSchema,
});

codegen(`
const {output} = require('../helpers');
module.exports = output("module.exports.result = result", "console.log(await result);");
`);

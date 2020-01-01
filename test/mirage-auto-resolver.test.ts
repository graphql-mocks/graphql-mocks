import {expect} from 'chai';
import {buildSchema} from 'graphql';
import defaultResolvers from './resolvers';
import fillInMissingResolvers from '../src/mirage/fill-missing-resolvers-with-auto';
import {server as mirageServer} from './mirage';
import defaultScenario from './mirage/scenarios/default';
import {buildHandler, typeDefs} from './executable-schema';
import applyAddMirageResolverContextExport from '../src/mirage/add-mirage-resolver-context';

const mirageGraphQLMap: any = [];

const resolversReduce = (resolvers: any, resolverModifiers: any) => {
  return resolverModifiers.reduce(
    (resolvers: any, resolverModifier: any) => {
      resolvers = {
        ...resolvers
      };

      resolvers = resolverModifier(resolvers);
      if (typeof resolvers !== 'object') {
        throw new Error(`resolverModifier ${resolverModifier.toString()} should return a resolvers object, got ${typeof resolvers}`);
      }

      return resolvers;
    },
    resolvers
  );
};

const tempSchema = buildSchema(typeDefs);
const resolverModifiers = [
  fillInMissingResolvers(mirageServer, mirageGraphQLMap, tempSchema),
  applyAddMirageResolverContextExport(mirageServer, mirageGraphQLMap)
]

const resolvers = resolversReduce(defaultResolvers, resolverModifiers);

let graphQLHandler = buildHandler(resolvers);

describe('auto resolving from mirage', function() {
  this.beforeEach(() => {
    mirageServer.db.loadData(defaultScenario);
  });

  this.afterEach(() => {
    mirageServer.db.emptyData();
  });

  it('has missing resolvers that are filled by #fillInMissingResolvers', function() {
    expect(defaultResolvers.Post).to.equal(undefined);
    expect(resolvers.Post).to.not.equal(undefined);
    expect(defaultResolvers.Comment).to.equal(undefined);
    expect(resolvers.Comment).to.not.equal(undefined);
  });

  it('can handle a simple auto look up', async function() {
    let server = mirageServer;

    const query = `query {
      person(id: 1) {
        id
        name
        posts {
          body
        }
      }
    }`;

    const result = await graphQLHandler(query);
    expect(result).to.deep.equal({
      data: {
        person: {
          id: "1",
          name: 'Fred Flinstone',
          posts: [{
            body: "They're the modern stone age family. From the town of Bedrock. They're a page right out of history"
          }]
        }
      }
    });
  });

  // Person
  //   has Posts
  //     (author should match the Person)
  //     has Comments
  //       (comment author could be different than the Person who wrote the post)
  //
  // the resolver should be able to handle lookups for a Person whether the parent
  // is an author of a post or an author of a nested comment

  it('can handle a first generation parent type (person in posts.author)', async function() {
    const query = `query {
      person(id: 1) {
        id
        name
        posts {
          author {
            id
            name
          }
        }
      }
    }`;

    const result = await graphQLHandler(query);

    expect(result.data!.person.id).to.equal(result.data!.person.posts[0].author.id);
    expect(result.data!.person.name).to.equal(result.data!.person.posts[0].author.name);
  });

  it('can handle a second generation parent type (person in posts.comments.author)', async function() {
    const query = `query {
      person(id: 1) {
        id
        name
        posts {
          comments {
            body
            author {
              name
            }
          }
        }
      }
    }`;

    const result = await graphQLHandler(query);
    expect(result.data!.person.posts[0].comments[0].body).to.equal('I love the town of Bedrock!');
    expect(result.data!.person.posts[0].comments[0].author.name).to.equal('Barney Rubble');
  });
});

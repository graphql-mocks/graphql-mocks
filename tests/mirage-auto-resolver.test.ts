import {expect} from 'chai';
import {buildSchema} from 'graphql';
import defaultResolvers from './resolvers';
import {patchWithAutoResolvers} from '../src/mirage/resolver-reducers/patch-with-auto';
import {server as mirageServer} from './mirage';
import defaultScenario from './mirage/scenarios/default';
import {buildHandler, typeDefs} from './executable-schema';
import {addContextToResolvers} from '../src/mirage/resolver-reducers/add-context';
import resolversReduce from '../src/resolvers/reduce';

const schema = buildSchema(typeDefs);

const resolverModifiers = [
  addContextToResolvers(mirageServer),
  patchWithAutoResolvers(schema),
]

const resolvers = resolversReduce({
  resolvers: defaultResolvers,
  reducers: resolverModifiers
});

let graphQLHandler = buildHandler(resolvers);

describe('auto resolving from mirage', function() {
  this.beforeEach(() => {
    mirageServer.db.loadData(defaultScenario);
  });

  this.afterEach(() => {
    mirageServer.db.emptyData();
  });

  it('has missing resolvers that are filled by #patchWithAutoResolvers', function() {
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

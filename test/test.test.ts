import {expect} from 'chai';
import {graphQLHandler} from './executable-schema';

it('handles a root query (scalar)', async function() {
  const query = `query {
    hello
  }`;

  const result = await graphQLHandler(query);
  expect(result).to.deep.equal({
    data:  {
      hello: 'hi'
    }
  });
});

it('handles a root query (custom type)', async function() {
  const query = `query {
    person(id: 1) {
      name
      age
    }
  }`;

  const result = await graphQLHandler(query);
  expect(result).to.deep.equal({
    data:  {
      person: {
        name: 'Fred Flinstone',
        age: 43
      }
    }
  });
});

it('handles nested objects', async function() {
  const query = `query {
    person(id: 1) {
      name
      age
      friends {
        name
        age
      }
    }
  }`;

  const result = await graphQLHandler(query);
  expect(result).to.deep.equal({
    data: {
      person: {
        name: 'Fred Flinstone',
        age: 43,
        friends: [{
          name: 'Barney Rubble',
          age: 40
        }]
      }
    }
  });
});

describe('when a type has multiple parents', function() {
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

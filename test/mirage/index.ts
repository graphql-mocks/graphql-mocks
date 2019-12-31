import {model as personModel} from '../resolvers/Person/_mirage';
import {model as postModel} from '../resolvers/Post/_mirage';
import {model as commentModel} from '../resolvers/Comment/_mirage';

const {
  Serializer,
  Server,
} = require('miragejs');

const serializer = Serializer.extend({
  // we want a flat structure so we don't have a root here
  // we have embed enabled but we won't include anything to
  // embed because these should be handled by type field
  // resolvers
  root: false,
  embed: true,
  include: [],
});

export const server = new Server({
  models: {
    person: personModel,
    post: postModel,
    comment: commentModel
  },
  serializers: {
    application: serializer
  }
});

export const schema = server.schema;
export const serialize = (thingToSerialize: any) => server.serializerOrRegistry.serialize(thingToSerialize);

server.db.loadData({
  comments: [
    {
      id: 1,
      body: 'I love the town of Bedrock!',
      authorId: 2
    }
  ],
  posts: [
    {
      id: 1,
      title: 'Meet the Flintstones!',
      body: 'They\'re the modern stone age family. From the town of Bedrock. They\'re a page right out of history',
      authorId: 1,
      commentIds: [1]
    }
  ],
  people: [
    {
      id: 1,
      name: 'Fred Flinstone',
      age: 43,
      friendIds: [2],
      postIds: [1]
    },
    {
      id: 2,
      name: 'Barney Rubble',
      age: 40,
      friendIds: [1]
    }
  ]
});

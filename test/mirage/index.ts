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

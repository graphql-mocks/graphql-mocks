import {model as personModel} from '../resolvers/Person/_mirage';
import {model as postModel} from '../resolvers/Post/_mirage';
import {model as commentModel} from '../resolvers/Comment/_mirage';

const { Server } = require('miragejs');

export const server = new Server({
  models: {
    person: personModel,
    post: postModel,
    comment: commentModel
  }
});

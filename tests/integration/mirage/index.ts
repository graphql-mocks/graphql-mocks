import { model as personModel } from './models/person';
import { model as postModel } from './models/post';
import { model as commentModel } from './models/comment';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Server } = require('miragejs');

export const server = new Server({
  models: {
    person: personModel,
    post: postModel,
    comment: commentModel,
  },
});

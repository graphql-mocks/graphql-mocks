import author from './author'
import comments from './comments'
import {PostResolvers} from '../../../types'

const {
  Model,
  hasMany,
  belongsTo
} = require('miragejs');

const Post: PostResolvers = {
  author,
  comments,
};

export default Post;

export const mirageModel = Model.extend({
  author: belongsTo('person'),
  comments: hasMany(),
});

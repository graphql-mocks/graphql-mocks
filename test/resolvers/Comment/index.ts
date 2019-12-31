import {CommentResolvers} from '../../../types';
import author from './author';

const {
  Model,
  belongsTo
} = require('miragejs');

const Comment: CommentResolvers = {
  author
};

export default Comment;

export const mirageModel = Model.extend({
  author: belongsTo('person'),
});

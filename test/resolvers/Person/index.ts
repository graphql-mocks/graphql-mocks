import friends from './friends'
import posts from './posts'
import {PersonResolvers} from '../../../types'

const {
  Model,
  hasMany
} = require('miragejs');

const Person: PersonResolvers = {
  friends,
  posts
};

export default Person;

export const mirageModel = Model.extend({
  friends: hasMany('person'),
  posts: hasMany('posts')
});

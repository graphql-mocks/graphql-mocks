const {
  Model,
  hasMany
} = require('miragejs');

export default Model.extend({
  friends: hasMany('person'),
  posts: hasMany('posts')
});

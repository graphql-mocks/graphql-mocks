const {
  Model,
  hasMany,
  belongsTo
} = require('miragejs');

export default Model.extend({
  author: belongsTo('person'),
  comments: hasMany(),
});

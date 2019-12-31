const {
  Model,
  belongsTo
} = require('miragejs');

export default Model.extend({
  author: belongsTo('person'),
});

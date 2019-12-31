const {
  Model,
  belongsTo
} = require('miragejs');

export const model = Model.extend({
  author: belongsTo('person'),
});

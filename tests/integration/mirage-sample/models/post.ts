// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Model, hasMany, belongsTo } = require('miragejs');

export const model = Model.extend({
  author: belongsTo('person'),
  comments: hasMany(),
});

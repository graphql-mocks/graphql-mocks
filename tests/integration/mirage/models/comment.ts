// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Model, belongsTo } = require('miragejs');

export const model = Model.extend({
  author: belongsTo('person'),
});

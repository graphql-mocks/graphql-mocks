// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Model, hasMany } = require('miragejs');

export const model = Model.extend({
  friends: hasMany('person'),
  posts: hasMany(),
});

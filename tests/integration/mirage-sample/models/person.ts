// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Model, hasMany, belongsTo } = require('miragejs');

export const model = Model.extend({
  friends: hasMany('person'),
  posts: hasMany(),
  transportation: belongsTo({ polymorphic: true }),
  hobbies: hasMany({ polymorphic: true }),
});

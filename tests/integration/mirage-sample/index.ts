import { Model, belongsTo, hasMany, Server } from 'miragejs';

export const server = new Server({
  models: {
    person: Model.extend({
      friends: hasMany('person'),
      posts: hasMany(),
      transportation: belongsTo({ polymorphic: true }),
      hobbies: hasMany({ polymorphic: true }),
    }),
    post: Model.extend({
      author: belongsTo('person'),
      comments: hasMany(),
    }),
    comment: Model.extend({
      author: belongsTo('person'),
    }),
    bike: Model.extend({}),
    car: Model.extend({}),
    publicTransit: Model.extend({}),
    sportsHobby: Model.extend({}),
    culinaryHobby: Model.extend({}),
    makerHobby: Model.extend({}),
  },
});

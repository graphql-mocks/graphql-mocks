import { Schema } from "inspector";

const {
  Server,
  Model,
  hasMany
} = require('miragejs')

export const server = new Server({
  models: {
    person: Model.extend({
      friends: hasMany('person')
    })
  }
})

export const schema = server.schema;

server.db.loadData({
  people: [
    {
      id: 1,
      name: 'Fred Flinstone',
      age: 43,
      friendIds: [2]
    },
    {
      id: 2,
      name: 'Barney Rubble',
      age: 40,
      friendIds: [1]
    }
  ]
});

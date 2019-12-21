import { Schema } from "inspector";

const {
  Serializer,
  Server,
  Model,
  hasMany
} = require('miragejs');

const serializer = Serializer.extend({
  // we want a flat structure so we don't have a root here
  // we have embed enabled but we won't include anything to
  // embed because these should be handled by type field
  // resolvers
  root: false,
  embed: true,
  include: [],
});

export const server = new Server({
  models: {
    person: Model.extend({
      friends: hasMany('person')
    })
  },
  serializers: {
    application: serializer
  }
});

export const schema = server.schema;
export const serialize = (thingToSerialize: any) => server.serializerOrRegistry.serialize(thingToSerialize);

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

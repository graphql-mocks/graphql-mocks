import { model as personModel } from './models/person';
import { model as postModel } from './models/post';
import { model as commentModel } from './models/comment';
import { model as bikeModel } from './models/bike';
import { model as carModel } from './models/car';
import { model as publicTransitModel } from './models/public-transit';
import { model as sportsHobby } from './models/sports-hobby';
import { model as culinaryHobby } from './models/culinary-hobby';
import { model as makerHobby } from './models/maker-hobby';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Server } = require('miragejs');

export const server = new Server({
  models: {
    person: personModel,
    post: postModel,
    comment: commentModel,
    bike: bikeModel,
    car: carModel,
    publicTransit: publicTransitModel,
    sportsHobby,
    culinaryHobby,
    makerHobby,
  },
});

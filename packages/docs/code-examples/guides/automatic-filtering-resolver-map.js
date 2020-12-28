import { movies } from './automatic-filtering-data.source';

export const resolverMap = {
  Query: {
    movies() {
      return movies;
    },
  },
};

import { QueryResolvers } from '../../types';
import hello from './hello';
import person from './person';
import allPersons from './all-persons';
import allPersonsPaginated from './all-persons-paginated';

const Query: QueryResolvers = {
  hello,
  person,
  allPersons,
  allPersonsPaginated,
};

export default Query;

import { QueryResolvers } from '../../types';
import hello from './hello';
import person from './person';
import allPersons from './all-persons';

const Query: QueryResolvers = {
  hello,
  person,
  allPersons,
};

export default Query;

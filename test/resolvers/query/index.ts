import {QueryResolvers} from '../../../types'
import hello from './hello';
import person from './person';

const Query: QueryResolvers = {
  hello,
  person
};

export default Query;

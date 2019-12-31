import friends from './friends'
import posts from './posts'
import {PersonResolvers} from '../../../types'

const Person: PersonResolvers = {
  friends,
  posts
};

export default Person;

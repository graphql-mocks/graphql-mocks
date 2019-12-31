import Query from './Query';
import Comment from './Comment';
import Person from './Person';
import Post from './Post';
import { ResolversTypes } from '../../types';

const resolvers: Partial<ResolversTypes> = {
  Query,
  Person,
  Post,
  Comment
};

export default resolvers;

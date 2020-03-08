import Query from './Query';
import Person from './Person';
import { ResolversTypes } from '../types';

const resolvers: Partial<ResolversTypes> = {
  Query,
  Person,
};

export default resolvers;

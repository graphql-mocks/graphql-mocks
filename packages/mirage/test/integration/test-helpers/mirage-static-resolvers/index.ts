import Query from './Query';
import Person from './Person';
import { ResolverMap } from 'graphql-mocks/types';

const resolvers: ResolverMap = {
  Query,
  Person,
};

export default resolvers;

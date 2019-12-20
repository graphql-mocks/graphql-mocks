import {QueryResolvers, Person} from '../../../types'
import {persons} from '../../fixtures/Person';

const resolver: QueryResolvers["person"] = function(parent, args, context, info) {
  return persons.find(
    person => person.name === args.name
  ) as Person;
}

export default resolver;

import {PersonResolvers, Person} from '../../../types'
import {persons} from '../../fixtures/Person';

const resolver: PersonResolvers["friends"] = function(parent, args, context, info) {
  const parentObj = persons.find(
    person => person.name === parent.name
  ) as Person;

  return parentObj.friends;
}

export default resolver;

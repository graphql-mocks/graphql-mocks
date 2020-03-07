import { Packager } from '../types';

export const pack: Packager = (initialMap, wrappers) => {
    // make an intial copy
    let wrappedMap = {
      ...initialMap
    };

    wrappers.forEach((wrapper) => {
      // copy on each loop
      wrappedMap = {
        ...wrappedMap
      };

      wrappedMap = wrapper(wrappedMap);
    });

  return wrappedMap;

}

import { NewResolverWrapper } from '../types';

// function createWrapper(type, wrapper): NewResolverWrapper {

// }

class ResolverWrapper implements NewResolverWrapper {
  type: ResolverWrapperType;
  wrapper: NewResolverWrapper['wrap'];

  constructor(type: ResolverWrapperType, wrapper: NewResolverWrapper['wrap']) {
    this.type = type;
  }

  async wrap() {
    return () => {};
  }
}

import { setup as setupPretender } from './network-pretender/setup';
import { setup as setupMsw } from './network-msw/setup';

// eslint-disable-next-line no-undef
const { search } = window.location;

export async function setup() {
  if (search.includes('network-pretender')) {
    return setupPretender();
  } else if (search.includes('network-msw')) {
    return setupMsw();
  } else {
    const errorMessage = 'Did not find a query param containing an test key (ie: ?testKey=network-pretender)';
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
}

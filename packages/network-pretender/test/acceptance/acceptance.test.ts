import { browserAcceptanceTests } from '../../../network-msw/test/acceptance/browser-tests';
import { resolve } from 'path';

const packageRoot = resolve(__dirname, './dummy-react-app');
describe('acceptance', browserAcceptanceTests(packageRoot, '3232'));

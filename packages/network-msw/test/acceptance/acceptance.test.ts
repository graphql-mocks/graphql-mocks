import { browserAcceptanceTests } from './browser-tests';
import { resolve } from 'path';

const testPackageRoot = resolve(__dirname, './dummy-react-app');
describe('acceptance', browserAcceptanceTests(testPackageRoot, '3333'));

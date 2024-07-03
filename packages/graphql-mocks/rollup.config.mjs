import { buildConfig } from '../../build-utils/rollup.js';
import pkg from './package.json';

export default buildConfig(pkg, ['cjs', 'es'], { external: ['sinon'], bundleGlobalName: 'GraphQLMocks' });

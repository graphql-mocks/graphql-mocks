import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';

import pkg from './package.json';

const forcedExternal = ['sinon'];
const pjsonExternal = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];
const external = [...forcedExternal, ...pjsonExternal];

function modules(format) {
  let entryFileNames;

  if (format === 'cjs') {
    entryFileNames = '[name].js';
  } else if (format === 'es') {
    entryFileNames = '[name].mjs';
  } else {
    entryFileNames = '[name].[format].js';
  }

  return {
    input: 'src/index.ts',
    external,

    output: {
      format,
      entryFileNames,
      dir: 'dist',
      sourcemap: 'inline',
    },

    preserveModules: true,
    plugins: [
      typescript({ declaration: true, declarationDir: 'dist' }),
      getBabelOutputPlugin({
        plugins: [
          '@babel/plugin-proposal-class-properties',
          '@babel/plugin-proposal-optional-chaining',
          '@babel/plugin-proposal-nullish-coalescing-operator',
          '@babel/plugin-proposal-object-rest-spread',
        ],
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                node: 10,
              },
            },
          ],
        ],
      }),
    ],
  };
}

function bundle(format) {
  return {
    input: 'src/index.ts',

    output: {
      file: `dist/bundles/graphql-mocks.${format}.js`,
      format: 'esm',
      name: 'GraphQLMocks',
      sourcemap: true,
    },

    plugins: [
      typescript(),
      resolve(),
      commonjs(),
      getBabelOutputPlugin({
        plugins: [
          '@babel/plugin-proposal-class-properties',
          '@babel/plugin-proposal-optional-chaining',
          '@babel/plugin-proposal-nullish-coalescing-operator',
          '@babel/plugin-proposal-object-rest-spread',
        ],
        presets: [
          [
            '@babel/preset-env',
            {
              modules: format === 'es' ? false : format,
              targets: {
                esmodules: format === 'es',
              },
            },
          ],
        ],
      }),
    ],
  };
}

export default [].concat(modules('cjs'), modules('es'), bundle('es'), bundle('cjs'), bundle('umd'));

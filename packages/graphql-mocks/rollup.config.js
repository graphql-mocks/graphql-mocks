import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';

import pkg from './package.json';

const external = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];

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
              modules: 'auto',
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

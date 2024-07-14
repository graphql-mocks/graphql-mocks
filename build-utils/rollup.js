import * as path from 'path';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';

export function buildConfig(pkg, formats, { external: forcedExternal, bundleGlobalName } = { external: [] }) {
  const pjsonExternal = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];
  const external = [...forcedExternal, ...pjsonExternal];
  const input = 'src/index.ts';
  const builds = [];

  function buildPlugins(format, tsOptions = {}) {
    return [
      typescript({
        ...tsOptions,
      }),
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
              modules: format === 'es' ? 'auto' : format,
              targets: {
                node: 12,
                esmodules: format === 'es',
              },
            },
          ],
        ],
      }),
      json(),
    ].filter(Boolean);
  }

  if (formats.includes('cjs')) {
    const dir = path.dirname(pkg.main);

    builds.push({
      input,
      external,
      output: {
        format: 'cjs',
        dir,
        sourcemap: true,
        entryFileNames: '[name].js',
      },
      preserveModules: true,
      plugins: buildPlugins('cjs', { declaration: true, declarationDir: dir }),
    });
  }

  if (formats.includes('es')) {
    const dir = path.dirname(pkg.module);

    builds.push({
      input,
      external,
      output: {
        format: 'es',
        dir,
        sourcemap: true,
        entryFileNames: '[name].mjs',
      },
      preserveModules: true,
      plugins: buildPlugins('es', { declaration: true, declarationDir: dir }),
    });
  }

  return builds;
}

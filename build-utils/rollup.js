import * as path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';

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
      format === 'umd' && resolve(),
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
      },
      preserveModules: true,
      plugins: buildPlugins('es', { declaration: true, declarationDir: dir }),
    });
  }

  if (formats.includes('umd')) {
    if (!bundleGlobalName) {
      throw new Error('No bundleName passed in but it is required for the umd build');
    }

    const file = pkg.unpkg;

    builds.push({
      input,
      output: {
        // final output is handled by babel as umd as passed into buildPlugins
        format: 'es',
        file,
        name: bundleGlobalName,
        sourcemap: true,
      },
      plugins: buildPlugins('umd'),
    });
  }

  return builds;
}

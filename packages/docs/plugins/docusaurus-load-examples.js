const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const prettier = require('prettier');
const globby = require('globby');

const JS_EXAMPLES_DIR = path.resolve(__dirname, '../code-examples');

async function getExamples() {
  const globedExamples = `${JS_EXAMPLES_DIR}/**/*.source.js`;
  return await globby(globedExamples);
}

function wrapWithJSCodeBlock(string) {
  return '```js\n' + string + '```\n';
}

function parseToMarkDown(content, { examplePath }) {
  const { dir: cwd, base: filename } = path.parse(examplePath);
  const { code } = babel.transform(content, {
    filename,
    cwd,
    retainLines: true,
    sourceType: 'module',
    plugins: ['codegen'],
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          useBuiltIns: false,
          targets: {
            node: 16,
          },
        },
      ],
    ],
  });

  return wrapWithJSCodeBlock(prettier.format(code, { parser: 'babel' }));
}

module.exports = function (context, options) {
  return {
    name: 'docusaurus-load-examples',

    getPathsToWatch() {
      return [`${JS_EXAMPLES_DIR}/**/*.js`];
    },

    async loadContent() {
      const examples = await getExamples();
      const loadedContent = {};

      for (const example of examples) {
        const content = fs.readFileSync(example).toString();
        const markdown = parseToMarkDown(content, { examplePath: example });
        const { name: filename, dir } = path.parse(example);
        const relativeDir = path.relative(JS_EXAMPLES_DIR, dir);
        loadedContent[`${relativeDir}/${filename}.md`] = markdown;
      }

      return loadedContent;
    },

    async contentLoaded({ content, actions }) {
      const entries = Object.entries(content);

      for (const [filePath, content] of entries) {
        await actions.createData(filePath, content);
      }
    },

    configureWebpack(config, isServer, utils) {
      const { siteDir, siteConfig } = context;
      const { getJSLoader } = utils;
      const pluginCacheDir = path.resolve(config.resolve.alias['@generated'], 'docusaurus-load-examples/default');

      const mdxLoaderOptions = {
        admonitions: true,
        staticDirs: siteConfig.staticDirectories.map((dir) => path.resolve(siteDir, dir)),
        siteDir,
        // External MDX files are always meant to be imported as partials
        isMDXPartial: () => true,
        // External MDX files might have front matter, just disable the warning
        isMDXPartialFrontMatterWarningDisabled: true,
        markdownConfig: siteConfig.markdown,
      };

      return {
        resolve: {
          alias: {
            'code-examples': pluginCacheDir,
          },
        },
        module: {
          rules: [
            {
              test: /(\.md|\.mdx)?$/,
              include: [pluginCacheDir],
              use: [
                getJSLoader({ isServer }),
                {
                  loader: require.resolve('@docusaurus/mdx-loader'),
                  options: mdxLoaderOptions,
                },
              ].filter(Boolean),
            },
          ],
        },
      };
    },
  };
};

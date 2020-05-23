const uniq = require('lodash.uniq');
const typedocSidebar = require('./website/sidebars');

const modules = uniq(typedocSidebar.docs.Modules);
const classes = uniq(typedocSidebar.docs.Classes);

module.exports = {
  sidebar: [
    {
      id: 'introduction',
      type: 'doc',
    },
    { 'Getting Started': ['getting-started/installation'] },
    { Guides: ['guides/mirage'] },
    {
      'API Reference': [
        {
          type: 'doc',
          id: 'api-quick-start',
        },
        {
          label: 'Modules',
          type: 'category',
          items: modules,
        },
        {
          label: 'Classes',
          type: 'category',
          items: classes,
        },
      ],
    },
  ],
};

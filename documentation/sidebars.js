const uniq = require('lodash.uniq');
const typedocSidebar = require('./website/sidebars');

const modules = uniq(typedocSidebar.docs.Modules);
const classes = uniq(typedocSidebar.docs.Classes);

module.exports = {
  someSidebar: {
    API: [
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
    Guides: ['typedoc/globals'],
  },
};

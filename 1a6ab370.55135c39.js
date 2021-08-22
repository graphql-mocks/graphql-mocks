(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{121:function(e,t,r){"use strict";r.r(t),r.d(t,"MDXContext",(function(){return s})),r.d(t,"MDXProvider",(function(){return d})),r.d(t,"mdx",(function(){return g})),r.d(t,"useMDXComponents",(function(){return m})),r.d(t,"withMDXComponents",(function(){return l}));var n=r(0),a=r.n(n);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function c(){return(c=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(this,arguments)}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function p(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function u(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var s=a.a.createContext({}),l=function(e){return function(t){var r=m(t.components);return a.a.createElement(e,c({},t,{components:r}))}},m=function(e){var t=a.a.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):p(p({},t),e)),r},d=function(e){var t=m(e.components);return a.a.createElement(s.Provider,{value:t},e.children)},f={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},b=a.a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,o=e.originalType,c=e.parentName,i=u(e,["components","mdxType","originalType","parentName"]),s=m(r),l=n,d=s["".concat(c,".").concat(l)]||s[l]||f[l]||o;return r?a.a.createElement(d,p(p({ref:t},i),{},{components:r})):a.a.createElement(d,p({ref:t},i))}));function g(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=r.length,c=new Array(o);c[0]=b;var i={};for(var p in t)hasOwnProperty.call(t,p)&&(i[p]=t[p]);i.originalType=e,i.mdxType="string"==typeof e?e:n,c[1]=i;for(var u=2;u<o;u++)c[u]=r[u];return a.a.createElement.apply(null,c)}return a.a.createElement.apply(null,r)}b.displayName="MDXCreateElement"},36:function(e,t,r){"use strict";r.r(t),r.d(t,"frontMatter",(function(){return c})),r.d(t,"metadata",(function(){return i})),r.d(t,"rightToc",(function(){return p})),r.d(t,"default",(function(){return s}));var n=r(2),a=r(7),o=(r(0),r(121)),c={title:"Generating Data with Factories"},i={unversionedId:"paper/guides/factories",id:"paper/guides/factories",isDocsHomePage:!1,title:"Generating Data with Factories",description:"Note: A better factory operation is in the works but while the api is being ironed out, this works as a great option that can be migrated later.",source:"@site/docs/paper/guides/factories.md",slug:"/paper/guides/factories",permalink:"/docs/paper/guides/factories",version:"current",sidebar:"docs",previous:{title:"Technical Notes",permalink:"/docs/paper/technical-notes"},next:{title:"Using GraphQL Paper with GraphQL",permalink:"/docs/paper/guides/with-graphql"}},p=[],u={rightToc:p};function s(e){var t=e.components,r=Object(a.default)(e,["components"]);return Object(o.mdx)("wrapper",Object(n.default)({},u,r,{components:t,mdxType:"MDXLayout"}),Object(o.mdx)("p",null,Object(o.mdx)("strong",{parentName:"p"},"Note: A better ",Object(o.mdx)("inlineCode",{parentName:"strong"},"factory")," operation is in the works but while the api is being ironed out, this works as a great option that can be migrated later.")),Object(o.mdx)("p",null,"The ",Object(o.mdx)("inlineCode",{parentName:"p"},"create")," operation in ",Object(o.mdx)("em",{parentName:"p"},"Mutate Transaction")," callback can be used with factory functions that return spreadable pojos."),Object(o.mdx)("p",null,"For example if we wanted to create a factory for an ",Object(o.mdx)("inlineCode",{parentName:"p"},"Actor")," will the following fields:"),Object(o.mdx)("pre",null,Object(o.mdx)("code",Object(n.default)({parentName:"pre"},{className:"language-graphql"}),"type Actor {\n  firstName: String!\n  lastName: String!\n  city: String!\n}\n")),Object(o.mdx)("p",null,"we could create a factory using the ",Object(o.mdx)("a",Object(n.default)({parentName:"p"},{href:"https://github.com/marak/Faker.js/"}),"faker js")," package:"),Object(o.mdx)("pre",null,Object(o.mdx)("code",Object(n.default)({parentName:"pre"},{className:"language-js"}),"import faker from 'faker';\n\n// alternatively the factory function could also take arguments\nexport function actorFactory() {\n  return {\n    firstName: faker.name.firstName(),\n    lastName: faker.name.lastName(),\n    city: faker.address.cityName(),\n  };\n}\n")),Object(o.mdx)("p",null,"Then the ",Object(o.mdx)("inlineCode",{parentName:"p"},"actorFactory")," can be used within a ",Object(o.mdx)("em",{parentName:"p"},"Mutate Transaction")," callback when creating an ",Object(o.mdx)("inlineCode",{parentName:"p"},"Actor")," using the ",Object(o.mdx)("inlineCode",{parentName:"p"},"create")," operation:"),Object(o.mdx)("pre",null,Object(o.mdx)("code",Object(n.default)({parentName:"pre"},{className:"language-js"}),"import { actorFactory } from './factories/actor';\n\npaper.mutate(({ create }) => {\n  return create('Actor', {\n    // spread the result of calling the factory function\n    ...actorFactory(),\n\n    // any overrides can be specified\n    firstName: 'First Name Override'\n  });\n});\n")))}s.isMDXComponent=!0}}]);
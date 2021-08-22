(window.webpackJsonp=window.webpackJsonp||[]).push([[40],{121:function(e,n,r){"use strict";r.r(n),r.d(n,"MDXContext",(function(){return c})),r.d(n,"MDXProvider",(function(){return h})),r.d(n,"mdx",(function(){return y})),r.d(n,"useMDXComponents",(function(){return d})),r.d(n,"withMDXComponents",(function(){return u}));var t=r(0),a=r.n(t);function i(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function o(){return(o=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var r=arguments[n];for(var t in r)Object.prototype.hasOwnProperty.call(r,t)&&(e[t]=r[t])}return e}).apply(this,arguments)}function l(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function s(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?l(Object(r),!0).forEach((function(n){i(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function p(e,n){if(null==e)return{};var r,t,a=function(e,n){if(null==e)return{};var r,t,a={},i=Object.keys(e);for(t=0;t<i.length;t++)r=i[t],n.indexOf(r)>=0||(a[r]=e[r]);return a}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(t=0;t<i.length;t++)r=i[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var c=a.a.createContext({}),u=function(e){return function(n){var r=d(n.components);return a.a.createElement(e,o({},n,{components:r}))}},d=function(e){var n=a.a.useContext(c),r=n;return e&&(r="function"==typeof e?e(n):s(s({},n),e)),r},h=function(e){var n=d(e.components);return a.a.createElement(c.Provider,{value:n},e.children)},m={inlineCode:"code",wrapper:function(e){var n=e.children;return a.a.createElement(a.a.Fragment,{},n)}},f=a.a.forwardRef((function(e,n){var r=e.components,t=e.mdxType,i=e.originalType,o=e.parentName,l=p(e,["components","mdxType","originalType","parentName"]),c=d(r),u=t,h=c["".concat(o,".").concat(u)]||c[u]||m[u]||i;return r?a.a.createElement(h,s(s({ref:n},l),{},{components:r})):a.a.createElement(h,s({ref:n},l))}));function y(e,n){var r=arguments,t=n&&n.mdxType;if("string"==typeof e||t){var i=r.length,o=new Array(i);o[0]=f;var l={};for(var s in n)hasOwnProperty.call(n,s)&&(l[s]=n[s]);l.originalType=e,l.mdxType="string"==typeof e?e:t,o[1]=l;for(var p=2;p<i;p++)o[p]=r[p];return a.a.createElement.apply(null,o)}return a.a.createElement.apply(null,r)}f.displayName="MDXCreateElement"},131:function(e,n,r){"use strict";var t=r(5);Object.defineProperty(n,"__esModule",{value:!0}),n.GraphQLResult=function(e){return a.default.createElement(a.default.Fragment,null,a.default.createElement("strong",null,"Result: "),a.default.createElement("pre",{className:"graphql-result"},JSON.stringify(e.result,null,2)))};var a=t(r(0))},257:function(e,n,r){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;n.default={data:{helloWorld:"Hello from my first GraphQL resolver!"}}},72:function(e,n,r){"use strict";r.r(n),r.d(n,"frontMatter",(function(){return u})),r.d(n,"metadata",(function(){return d})),r.d(n,"rightToc",(function(){return h})),r.d(n,"default",(function(){return f}));var t=r(2),a=r(7),i=(r(0),r(121)),o={rightToc:[]};function l(e){var n=e.components,r=Object(a.default)(e,["components"]);return Object(i.mdx)("wrapper",Object(t.default)({},o,r,{components:n,mdxType:"MDXLayout"}),Object(i.mdx)("pre",null,Object(i.mdx)("code",Object(t.default)({parentName:"pre"},{className:"language-js"}),'// This example is assuming you already have a GraphQL resolver map and have an\n// existing handler (in this case via graphql-tools). If this is not the case\n// check out the "Creating a GraphQL Handler" documentation section to create a GraphQL\n// handler with `graphql-mocks`.\nimport { makeExecutableSchema } from "graphql-tools";\nimport { buildSchema, graphql, printSchema } from "graphql";\nimport { pack } from "graphql-mocks/pack";\n\nasync function run() {\n  const graphqlSchema = buildSchema(`\n    schema {\n      query: Query\n    }\n\n    type Query {\n      helloWorld: String!\n    }\n  `);\n\n  // This represents the original resolver map being used by your existing GraphQL\n  // handler and is needed for the `pack` function to apply Resolver Map\n  // Middlewares and Resolver Wrappers.\n  const resolverMap = {\n    Query: {\n      helloWorld() {\n        return "Hello from my first GraphQL resolver!";\n      },\n    },\n  };\n\n  // using an array of middlewares to apply\n  const middlewares = [];\n\n  // any dependencies that might be required by the Resolver Map Middlewares or\n  // Resolver Wrappers. `graphqlSchema` is a required dependency;\n  const dependencies = {\n    graphqlSchema,\n  };\n\n  const packed = await pack(resolverMap, middlewares, {\n    dependencies,\n  });\n\n  // the packed result includes a `resolverMap` field that would have applied any\n  // middlewares. These can then be applied in place of where you would have used\n  // your previous resolverMap\n  const packedResolverMap = packed.resolverMap;\n\n  // `makeExecutableSchema` is how graphql-tools creates applies a Resolver Map\n  // to a Schema so that it can accept queries\n  const executableSchema = makeExecutableSchema({\n    typeDefs: printSchema(graphqlSchema),\n\n    // BEFORE using `graphql-mocks` this would have uses the original resolver map\n    // resolvers: resolverMap,\n\n    // AFTER, it uses the packed Resolver Map which includes the application of\n    // Resolver Map Middlewares and any Resolver Wrappers\n    resolvers: packedResolverMap,\n  });\n\n  const result = await graphql(\n    executableSchema,\n    `\n      query {\n        helloWorld\n      }\n    `\n  );\n\n  return result;\n}\n\n// kick everything off\nrun();\n')))}l.isMDXComponent=!0;var s=r(257),p=r.n(s),c=r(131),u={title:"Manually Apply Middlewares"},d={unversionedId:"guides/pack",id:"guides/pack",isDocsHomePage:!1,title:"Manually Apply Middlewares",description:"import",source:"@site/docs/guides/pack.mdx",slug:"/guides/pack",permalink:"/docs/guides/pack",version:"current",sidebar:"docs",previous:{title:"Relay Pagination",permalink:"/docs/guides/relay-pagination"},next:{title:"Mirage JS",permalink:"/docs/guides/mirage-js"}},h=[{value:"Using <code>pack</code> with an Existing GraphQL Handler",id:"using-pack-with-an-existing-graphql-handler",children:[]}],m={rightToc:h};function f(e){var n=e.components,r=Object(a.default)(e,["components"]);return Object(i.mdx)("wrapper",Object(t.default)({},m,r,{components:n,mdxType:"MDXLayout"}),Object(i.mdx)("p",null,"The ",Object(i.mdx)("inlineCode",{parentName:"p"},"pack")," function can be used to manually apply Resolver Map Middlewares to Resolver Maps. This is especially useful\nwith an existing GraphQL Handler is already setup with a Resolver Map."),Object(i.mdx)("h2",{id:"using-pack-with-an-existing-graphql-handler"},"Using ",Object(i.mdx)("inlineCode",{parentName:"h2"},"pack")," with an Existing GraphQL Handler"),Object(i.mdx)("p",null,"If you are getting started and haven't set up a GraphQL handler yet, it is easier to use the library's GraphQL handler\n",Object(i.mdx)("a",Object(t.default)({parentName:"p"},{href:"../getting-started/create-handler"}),"create a GraphQL handler")," instead."),Object(i.mdx)("p",null,"Otherwise, if you already have a handler set up you most likely can still use it with this library if you have a\nResolver Map. This library provides a ",Object(i.mdx)("inlineCode",{parentName:"p"},"pack")," function which takes an initial Resolver Map and applies operations against\nit using Resolver Map Middlewares. The result of ",Object(i.mdx)("inlineCode",{parentName:"p"},"pack"),' is a new "packed" Resolver Map that can now be used in your\nexisting GraphQL handler.'),Object(i.mdx)("p",null,"Here is an example that uses the third-party package, ",Object(i.mdx)("inlineCode",{parentName:"p"},"graphql-tools"),", and its handler."),Object(i.mdx)(l,{mdxType:"ExistingHandlerExample"}),Object(i.mdx)(c.GraphQLResult,{result:p.a,mdxType:"GraphQLResult"}))}f.isMDXComponent=!0}}]);
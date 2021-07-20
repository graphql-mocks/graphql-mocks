(window.webpackJsonp=window.webpackJsonp||[]).push([[22],{106:function(e,t,n){"use strict";n.d(t,"a",(function(){return o}));var r=n(0),a=n.n(r);function o(e){return a.a.createElement(a.a.Fragment,null,a.a.createElement("strong",null,"Result: "),a.a.createElement("pre",{className:"graphql-result"},JSON.stringify(e.result,null,2)))}},86:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return p})),n.d(t,"metadata",(function(){return s})),n.d(t,"rightToc",(function(){return u})),n.d(t,"default",(function(){return m}));var r=n(2),a=(n(0),n(91)),o=n(106);const l={rightToc:[]};function c({components:e,...t}){return Object(a.b)("wrapper",Object(r.a)({},l,t,{components:e,mdxType:"MDXLayout"}),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-js"}),'import { GraphQLHandler, embed } from "graphql-mocks";\nimport { spyWrapper } from "graphql-mocks/wrapper";\n\n// this string represents our schema formatted in\n// GraphQL SDL (Schema Definition Language), but\n// a GraphQL Instance or SDL String can be used\nconst graphqlSchema = `\nschema {\n  query: Query\n}\n\ntype Query {\n  helloWorld: String!\n}\n`;\n\nconst resolverMap = {\n  Query: {\n    helloWorld() {\n      return "Hello from our test resolver!";\n    },\n  },\n};\n\n// Create a query handler with the GraphQL Schema, Resolver Map, and embedded wrappers\nconst handler = new GraphQLHandler({\n  resolverMap,\n  middlewares: [\n    embed({\n      wrappers: [spyWrapper],\n    }),\n  ],\n\n  dependencies: {\n    graphqlSchema,\n  },\n});\n\n// Send the query\nconst query = handler.query(`\n  {\n    helloWorld\n  }\n`);\n\n// console.log the result and the sinon spies that were applied to\n// the resolver\nquery.then((result) => {\n  console.log(result);\n  console.log(handler.state.spies.Query.helloWorld);\n});\n')))}c.isMDXComponent=!0;var i={data:{helloWorld:"Hello from our test resolver!"}};const p={id:"quick-example",title:"Quick Example"},s={unversionedId:"getting-started/quick-example",id:"getting-started/quick-example",isDocsHomePage:!1,title:"Quick Example",description:"This example will show how to:",source:"@site/docs/getting-started/quick-example.mdx",slug:"/getting-started/quick-example",permalink:"/docs/getting-started/quick-example",version:"current",sidebar:"docs",previous:{title:"Creating a GraphQL Handler",permalink:"/docs/getting-started/create-handler"},next:{title:"Concepts",permalink:"/docs/concepts"}},u=[],d={rightToc:u};function m({components:e,...t}){return Object(a.b)("wrapper",Object(r.a)({},d,t,{components:e,mdxType:"MDXLayout"}),Object(a.b)("p",null,"This example will show how to:"),Object(a.b)("ol",null,Object(a.b)("li",{parentName:"ol"},"Create a Resolver Map with Resolver functions"),Object(a.b)("li",{parentName:"ol"},"Apply a Resolver Wrapper to Resolver functions, the Sinon Spy Wrapper ",Object(a.b)("inlineCode",{parentName:"li"},"spyWrapper")," in this case via ",Object(a.b)("inlineCode",{parentName:"li"},"embed"),". The spy\nwrapper will capture all calls to our resolver function which can be useful for testing."),Object(a.b)("li",{parentName:"ol"},"Setup a GraphQL Handler with the the Resolver Wrapper to be able to execute queries"),Object(a.b)("li",{parentName:"ol"},"Execute a Query with the GraphQL Handler"),Object(a.b)("li",{parentName:"ol"},"Check the state object for the results of the Sinon Spies")),Object(a.b)(c,{mdxType:"QuickExample"}),Object(a.b)("p",null,"First ",Object(a.b)("inlineCode",{parentName:"p"},"console.log")),Object(a.b)(o.a,{result:i,mdxType:"GraphQLResult"}),Object(a.b)("p",null,"Second ",Object(a.b)("inlineCode",{parentName:"p"},"console.log")),Object(a.b)(o.a,{result:"Hello from our test resolver!",mdxType:"GraphQLResult"}),Object(a.b)("p",null,"And that's an end-to-end example using the library to create a quick mock GraphQL API with the Sinon Spy Wrapper for\nintrospection. Use the existing out-of-the-box Resolver Wrapper and Resolver Map Middlewares for even more\nfunctionality, or create your own."))}m.isMDXComponent=!0},91:function(e,t,n){"use strict";n.d(t,"a",(function(){return u})),n.d(t,"b",(function(){return b}));var r=n(0),a=n.n(r);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=a.a.createContext({}),s=function(e){var t=a.a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},u=function(e){var t=s(e.components);return a.a.createElement(p.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},m=a.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,l=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),u=s(n),m=r,b=u["".concat(l,".").concat(m)]||u[m]||d[m]||o;return n?a.a.createElement(b,c(c({ref:t},p),{},{components:n})):a.a.createElement(b,c({ref:t},p))}));function b(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,l=new Array(o);l[0]=m;var c={};for(var i in t)hasOwnProperty.call(t,i)&&(c[i]=t[i]);c.originalType=e,c.mdxType="string"==typeof e?e:r,l[1]=c;for(var p=2;p<o;p++)l[p]=n[p];return a.a.createElement.apply(null,l)}return a.a.createElement.apply(null,n)}m.displayName="MDXCreateElement"}}]);
"use strict";(self.webpackChunk_graphql_mocks_docs=self.webpackChunk_graphql_mocks_docs||[]).push([[8214],{5141:function(e,t,n){n.d(t,{u:function(){return a}});var r=n(2784);function a(e){return r.createElement(r.Fragment,null,r.createElement("strong",null,"Result: "),r.createElement("pre",{className:"graphql-result"},JSON.stringify(e.result,null,2)))}},4101:function(e,t,n){n.r(t),n.d(t,{assets:function(){return k},contentTitle:function(){return d},default:function(){return y},frontMatter:function(){return m},metadata:function(){return h},toc:function(){return f}});var r=n(28427),a=n(84397),o=(n(2784),n(30876)),i=["components"],l={toc:[]};function p(e){var t=e.components,n=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,r.Z)({},l,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'import { Paper } from "graphql-paper";\n\nconst graphqlSchema = `\n  schema {\n    query: Query\n  }\n\n  type Query {\n    films: [Film!]!\n  }\n\n  type Film {\n    title: String!\n    year: Int!\n    actors: [Actor!]!\n  }\n\n  type Actor {\n    name: String!\n  }\n`;\n\nconst paper = new Paper(graphqlSchema);\n\nasync function run() {\n  const westSideStory = await paper.mutate(({ create }) => {\n    // Create a Film with several actors\n    const film = create("Film", {\n      title: "West Side Story",\n      year: 1961,\n      actors: [\n        { name: "Rita Moreno" },\n        { name: "Natalie Wood" },\n        { name: "George Chakiris" },\n        { name: "Richard Beymer" },\n      ],\n    });\n\n    // return film to be available outside the `mutate`\n    return film;\n  });\n\n  // pull results off the returned result\n  const { title, actors } = westSideStory;\n\n  // FIRST console.log\n  console.log(title);\n\n  // SECOND console.log\n  console.log(actors);\n\n  // can lookup results on the `Paper` instance, too\n  const richard = paper.data.Actor.find(\n    ({ name }) => name === "Richard Beymer"\n  );\n\n  // THIRD console.log\n  console.log(richard);\n}\n\n// kick off async function\nrun();\n')))}p.isMDXComponent=!0;var s={title:"West Side Story",actors:[{name:"Rita Moreno"},{name:"Natalie Wood"},{name:"George Chakiris"},{name:"Richard Beymer"}],richard:{name:"Richard Beymer"}},c=n(5141),u=["components"],m={id:"introducing-paper",title:"Introducing GraphQL Paper"},d=void 0,h={unversionedId:"paper/introducing-paper",id:"paper/introducing-paper",title:"Introducing GraphQL Paper",description:"GraphQL Paper is a flexible in-memory store based on a provided GraphQL Schema.",source:"@site/docs/paper/introducing-paper.md",sourceDirName:"paper",slug:"/paper/introducing-paper",permalink:"/docs/paper/introducing-paper",draft:!1,tags:[],version:"current",frontMatter:{id:"introducing-paper",title:"Introducing GraphQL Paper"},sidebar:"docs",previous:{title:"Create Custom Highlighters",permalink:"/docs/highlight/creating-highlighters"},next:{title:"Installation",permalink:"/docs/paper/installation"}},k={},f=[{value:"\u2728 Features",id:"-features",level:2},{value:"API Reference",id:"api-reference",level:2},{value:"Integration with <code>graphql-mocks</code>",id:"integration-with-graphql-mocks",level:2},{value:"Documents and the Store",id:"documents-and-the-store",level:2},{value:"A Quick Example",id:"a-quick-example",level:2}],g={toc:f};function y(e){var t=e.components,n=(0,a.Z)(e,u);return(0,o.kt)("wrapper",(0,r.Z)({},g,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"GraphQL Paper is a flexible in-memory store based on a provided GraphQL Schema."),(0,o.kt)("p",null,"In testing and development it is handy to have a store that reflects the current state of the world, handles connections between data, and updates via mutations. While GraphQL Paper integrates well with the rest of ",(0,o.kt)("inlineCode",{parentName:"p"},"graphql-mocks"),", it can also be used on its own."),(0,o.kt)("h2",{id:"-features"},"\u2728 Features"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Built and based on GraphQL"),(0,o.kt)("li",{parentName:"ul"},"Works in the Browser and Node JS"),(0,o.kt)("li",{parentName:"ul"},"Works without ",(0,o.kt)("inlineCode",{parentName:"li"},"graphql-mocks")," with support for the official default GraphQL resolvers"),(0,o.kt)("li",{parentName:"ul"},"Written in TypeScript"),(0,o.kt)("li",{parentName:"ul"},"Support and integration with ",(0,o.kt)("inlineCode",{parentName:"li"},"graphql-mocks")),(0,o.kt)("li",{parentName:"ul"},"Support for relationships and connections between types"),(0,o.kt)("li",{parentName:"ul"},"Immutable"),(0,o.kt)("li",{parentName:"ul"},"Accessible via native js APIs"),(0,o.kt)("li",{parentName:"ul"},"Hooks (",(0,o.kt)("a",{parentName:"li",href:"/docs/paper/hooks"},"docs"),")"),(0,o.kt)("li",{parentName:"ul"},"Events (",(0,o.kt)("a",{parentName:"li",href:"/docs/paper/events"},"docs"),")"),(0,o.kt)("li",{parentName:"ul"},"Transaction Operations (",(0,o.kt)("a",{parentName:"li",href:"/docs/paper/operations"},"docs"),")"),(0,o.kt)("li",{parentName:"ul"},"Validations (",(0,o.kt)("a",{parentName:"li",href:"/docs/paper/validations"},"docs"),")"),(0,o.kt)("li",{parentName:"ul"},"API Query Imports")),(0,o.kt)("p",null,"Coming Soon:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Time-travel debugging, store snapshots, and the ability to restore to existing store snapshots"),(0,o.kt)("li",{parentName:"ul"},"Specialized ",(0,o.kt)("inlineCode",{parentName:"li"},"factory")," operation with support for various states and scenarios, with functional factories currently working now (",(0,o.kt)("a",{parentName:"li",href:"/docs/paper/guides/factories"},"docs"),")")),(0,o.kt)("h2",{id:"api-reference"},"API Reference"),(0,o.kt)("p",null,"There is the ",(0,o.kt)("a",{parentName:"p",href:"/api/paper/"},"API reference")," available for the ",(0,o.kt)("inlineCode",{parentName:"p"},"graphql-paper")," package."),(0,o.kt)("h2",{id:"integration-with-graphql-mocks"},"Integration with ",(0,o.kt)("inlineCode",{parentName:"h2"},"graphql-mocks")),(0,o.kt)("p",null,"Check out the ",(0,o.kt)("a",{parentName:"p",href:"/docs/guides/paper"},"guide")," for using ",(0,o.kt)("inlineCode",{parentName:"p"},"graphql-mocks")," with GraphQL Paper."),(0,o.kt)("h2",{id:"documents-and-the-store"},"Documents and the Store"),(0,o.kt)("p",null,"With GraphQL Paper a ",(0,o.kt)("inlineCode",{parentName:"p"},"Document")," is a POJO (plain-old javascript object) that represents a concrete GraphQL type, it is ",(0,o.kt)("em",{parentName:"p"},"not")," an instance."),(0,o.kt)("p",null,"For example an ",(0,o.kt)("inlineCode",{parentName:"p"},"Actor")," GraphQL type:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-graphql"},"type Actor {\n  title: String!\n}\n")),(0,o.kt)("p",null,"Could have a corresponding ",(0,o.kt)("inlineCode",{parentName:"p"},"Document"),":"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"{\n  title: 'Jurassic Park'\n}\n")),(0,o.kt)("p",null,"Documents are stored in an array on the ",(0,o.kt)("inlineCode",{parentName:"p"},"DocumentStore")," keyed by the GraphQL type. Based on the previous example a basic store containing our document could look like:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"{\n  Actor: [{ title: 'Jurassic Park' }]\n}\n")),(0,o.kt)("p",null,"This is a simplistic, but realistic example, of how data is stored. Learn how to ",(0,o.kt)("a",{parentName:"p",href:"/docs/paper/querying-data"},"query")," and ",(0,o.kt)("a",{parentName:"p",href:"/docs/paper/mutating-data"},"mutate")," the store (see below for a quick example of both). Check out the ",(0,o.kt)("a",{parentName:"p",href:"/docs/paper/technical-notes"},"technical notes")," for a closer look at how everything works."),(0,o.kt)("h2",{id:"a-quick-example"},"A Quick Example"),(0,o.kt)("p",null,"Here's a quick glimpse at what is possible with GraphQL Paper:"),(0,o.kt)(p,{mdxType:"QuickExample"}),(0,o.kt)("p",null,"First ",(0,o.kt)("inlineCode",{parentName:"p"},"console.log")," for ",(0,o.kt)("inlineCode",{parentName:"p"},"title")),(0,o.kt)(c.u,{result:s.title,mdxType:"GraphQLResult"}),(0,o.kt)("p",null,"Second ",(0,o.kt)("inlineCode",{parentName:"p"},"console.log")," for ",(0,o.kt)("inlineCode",{parentName:"p"},"actors")),(0,o.kt)(c.u,{result:s.actors,mdxType:"GraphQLResult"}),(0,o.kt)("p",null,"Third ",(0,o.kt)("inlineCode",{parentName:"p"},"console.log")," for ",(0,o.kt)("inlineCode",{parentName:"p"},"richard")),(0,o.kt)(c.u,{result:s.richard,mdxType:"GraphQLResult"}))}y.isMDXComponent=!0},30876:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return d}});var r=n(2784);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=r.createContext({}),s=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=s(e.components);return r.createElement(p.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,p=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),m=s(n),d=a,h=m["".concat(p,".").concat(d)]||m[d]||u[d]||o;return n?r.createElement(h,i(i({ref:t},c),{},{components:n})):r.createElement(h,i({ref:t},c))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=m;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var s=2;s<o;s++)i[s]=n[s];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"}}]);
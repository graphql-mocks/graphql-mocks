(window.webpackJsonp=window.webpackJsonp||[]).push([[34],{121:function(e,t,n){"use strict";n.r(t),n.d(t,"MDXContext",(function(){return d})),n.d(t,"MDXProvider",(function(){return u})),n.d(t,"mdx",(function(){return j})),n.d(t,"useMDXComponents",(function(){return s})),n.d(t,"withMDXComponents",(function(){return p}));var a=n(0),o=n.n(a);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function c(){return(c=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e}).apply(this,arguments)}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function m(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var d=o.a.createContext({}),p=function(e){return function(t){var n=s(t.components);return o.a.createElement(e,c({},t,{components:n}))}},s=function(e){var t=o.a.useContext(d),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},u=function(e){var t=s(e.components);return o.a.createElement(d.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},h=o.a.forwardRef((function(e,t){var n=e.components,a=e.mdxType,r=e.originalType,c=e.parentName,i=m(e,["components","mdxType","originalType","parentName"]),d=s(n),p=a,u=d["".concat(c,".").concat(p)]||d[p]||b[p]||r;return n?o.a.createElement(u,l(l({ref:t},i),{},{components:n})):o.a.createElement(u,l({ref:t},i))}));function j(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var r=n.length,c=new Array(r);c[0]=h;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:a,c[1]=i;for(var m=2;m<r;m++)c[m]=n[m];return o.a.createElement.apply(null,c)}return o.a.createElement.apply(null,n)}h.displayName="MDXCreateElement"},58:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return c})),n.d(t,"metadata",(function(){return i})),n.d(t,"rightToc",(function(){return l})),n.d(t,"default",(function(){return d}));var a=n(2),o=n(7),r=(n(0),n(121)),c={id:"mutating-data",title:"Mutating Data"},i={unversionedId:"paper/mutating-data",id:"paper/mutating-data",isDocsHomePage:!1,title:"Mutating Data",description:"Data in the store is always mutated via the mutate method on a Paper instance by passing in a Mutation Transaction callback. Within the Mutation Transaction callback there are several operations available to support being able to make changes easily to the store, even custom ones can be added.",source:"@site/docs/paper/mutating-data.md",slug:"/paper/mutating-data",permalink:"/docs/paper/mutating-data",version:"current",sidebar:"docs",previous:{title:"Querying Data",permalink:"/docs/paper/querying-data"},next:{title:"Operations",permalink:"/docs/paper/operations"}},l=[{value:"<code>mutate</code> and the <em>Mutate Transaction</em> callback",id:"mutate-and-the-mutate-transaction-callback",children:[]},{value:"Transaction Operations",id:"transaction-operations",children:[{value:"<code>create</code>",id:"create",children:[]},{value:"<code>find</code>",id:"find",children:[]},{value:"<code>remove</code>",id:"remove",children:[]},{value:"<code>clone</code>",id:"clone",children:[]},{value:"<code>getStore</code>",id:"getstore",children:[]},{value:"<code>queueEvent</code>",id:"queueevent",children:[]}]},{value:"Creating Connections Between Documents",id:"creating-connections-between-documents",children:[{value:"Creating Connections via Document Properties",id:"creating-connections-via-document-properties",children:[]},{value:"Creating Connections within <code>create</code> via Nesting",id:"creating-connections-within-create-via-nesting",children:[]}]},{value:"Returning Data Outside the <em>Mutate Transaction</em> callback",id:"returning-data-outside-the-mutate-transaction-callback",children:[]}],m={rightToc:l};function d(e){var t=e.components,n=Object(o.default)(e,["components"]);return Object(r.mdx)("wrapper",Object(a.default)({},m,n,{components:t,mdxType:"MDXLayout"}),Object(r.mdx)("p",null,"Data in the store is ",Object(r.mdx)("em",{parentName:"p"},"always")," mutated via the ",Object(r.mdx)("inlineCode",{parentName:"p"},"mutate")," method on a ",Object(r.mdx)("inlineCode",{parentName:"p"},"Paper")," instance by passing in a ",Object(r.mdx)("em",{parentName:"p"},"Mutation Transaction")," callback. Within the ",Object(r.mdx)("em",{parentName:"p"},"Mutation Transaction")," callback there are several operations available to support being able to make changes easily to the store, even ",Object(r.mdx)("a",Object(a.default)({parentName:"p"},{href:"/docs/paper/operations#creating-custom-operations"}),"custom ones can be added"),"."),Object(r.mdx)("h2",{id:"mutate-and-the-mutate-transaction-callback"},Object(r.mdx)("inlineCode",{parentName:"h2"},"mutate")," and the ",Object(r.mdx)("em",{parentName:"h2"},"Mutate Transaction")," callback"),Object(r.mdx)("p",null,"To make any changes call the ",Object(r.mdx)("inlineCode",{parentName:"p"},"mutate")," method on the ",Object(r.mdx)("inlineCode",{parentName:"p"},"Paper")," instance and provide a ",Object(r.mdx)("em",{parentName:"p"},"Mutate Transaction")," callback."),Object(r.mdx)("p",null,"Operations can be destructured from the first argument provided in the ",Object(r.mdx)("em",{parentName:"p"},"Mutation Transaction")," callback."),Object(r.mdx)("p",null,"For example, an ",Object(r.mdx)("inlineCode",{parentName:"p"},"Actor")," document could be created within ",Object(r.mdx)("inlineCode",{parentName:"p"},"mutate")," by using the ",Object(r.mdx)("inlineCode",{parentName:"p"},"create")," operation. In this example only ",Object(r.mdx)("inlineCode",{parentName:"p"},"create")," is being destructured for use but any combination of operations can be used with the callback (see more of the ",Object(r.mdx)("a",Object(a.default)({parentName:"p"},{href:"/docs/paper/mutating-data#transaction-operations"}),"library-provided operations")," below)."),Object(r.mdx)("p",null,"With a GraphQL Schema:"),Object(r.mdx)("pre",null,Object(r.mdx)("code",Object(a.default)({parentName:"pre"},{className:"language-graphql"}),"schema {\n  query: Query\n}\n\ntype Query {\n  allFilms: [Film!]!\n}\n\ntype Film {\n  title: String!\n  actors: [Actor!]!\n}\n\ntype Actor {\n  name: String!\n}\n")),Object(r.mdx)("p",null,"The following ",Object(r.mdx)("em",{parentName:"p"},"Mutate Transaction")," callback will create a ",Object(r.mdx)("inlineCode",{parentName:"p"},"Document")," of the GraphQL ",Object(r.mdx)("inlineCode",{parentName:"p"},"Actor")," type."),Object(r.mdx)("pre",null,Object(r.mdx)("code",Object(a.default)({parentName:"pre"},{className:"language-js"}),"await paper.mutate(({ create }) => {\n  create('Actor', {\n    name: 'Julia Roberts'\n  });\n});\n")),Object(r.mdx)("p",null,Object(r.mdx)("strong",{parentName:"p"},"Note:")," ",Object(r.mdx)("inlineCode",{parentName:"p"},"mutate")," returns a promise and the transaction callback is not considered executed until the promise is fulfilled. Calls to ",Object(r.mdx)("inlineCode",{parentName:"p"},"mutate")," will process transaction callbacks in the order they are called."),Object(r.mdx)("p",null,"All changes within a ",Object(r.mdx)("em",{parentName:"p"},"Mutation Transaction")," callback will be validated via ",Object(r.mdx)("a",Object(a.default)({parentName:"p"},{href:"/docs/paper/validations"}),"Validators")," after the transaction to ensure the new version of the ",Object(r.mdx)("inlineCode",{parentName:"p"},"DocumentStore")," is consistent."),Object(r.mdx)("h2",{id:"transaction-operations"},"Transaction Operations"),Object(r.mdx)("p",null,"Out of the box the following operations can be destructured within the callback:"),Object(r.mdx)("p",null,Object(r.mdx)("inlineCode",{parentName:"p"},"create"),", ",Object(r.mdx)("inlineCode",{parentName:"p"},"find"),", ",Object(r.mdx)("inlineCode",{parentName:"p"},"remove"),", ",Object(r.mdx)("inlineCode",{parentName:"p"},"clone"),", ",Object(r.mdx)("inlineCode",{parentName:"p"},"getStore"),", ",Object(r.mdx)("inlineCode",{parentName:"p"},"queueEvent"),"."),Object(r.mdx)("pre",null,Object(r.mdx)("code",Object(a.default)({parentName:"pre"},{className:"language-js"}),"await paper.mutate(({ create, find, remove, clone, getStore, queueEvent }) => {\n  // do something within the callback\n});\n")),Object(r.mdx)("p",null,"Creating ",Object(r.mdx)("a",Object(a.default)({parentName:"p"},{href:"/docs/paper/operations#creating-custom-operations"}),"custom operations")," can be helpful for creating common functional mutations on the GraphQL Paper ",Object(r.mdx)("inlineCode",{parentName:"p"},"DocumentStore")," or to provide common helpers that are useful within a ",Object(r.mdx)("em",{parentName:"p"},"Transaction Callback"),"."),Object(r.mdx)("h3",{id:"create"},Object(r.mdx)("inlineCode",{parentName:"h3"},"create")),Object(r.mdx)("ul",null,Object(r.mdx)("li",{parentName:"ul"},Object(r.mdx)("a",Object(a.default)({parentName:"li"},{href:"/api/paper/modules/operations.html#create"}),"API"))),Object(r.mdx)("pre",null,Object(r.mdx)("code",Object(a.default)({parentName:"pre"},{className:"language-js"}),"await paper.mutate(({ create }) => {\n  const julia = create('Actor', {\n    name: 'Julia Roberts'\n  });\n});\n")),Object(r.mdx)("p",null,"The first argument is the GraphQL type for the document and the second is an object representing its data, mapping GraphQL fields to the object properties."),Object(r.mdx)("h4",{id:"creating-a-documented-with-connections"},"Creating a Documented with Connections"),Object(r.mdx)("p",null,"The ",Object(r.mdx)("inlineCode",{parentName:"p"},"create")," operation supports the ability to create connections through either by a ",Object(r.mdx)("a",Object(a.default)({parentName:"p"},{href:"#creating-connections-within-create-via-nesting"}),"nested object")," or explicitly through the ",Object(r.mdx)("a",Object(a.default)({parentName:"p"},{href:"#creating-connections-via-document-properties"}),"property on the document"),", both of which are covered below."),Object(r.mdx)("h3",{id:"find"},Object(r.mdx)("inlineCode",{parentName:"h3"},"find")),Object(r.mdx)("ul",null,Object(r.mdx)("li",{parentName:"ul"},Object(r.mdx)("a",Object(a.default)({parentName:"li"},{href:"/api/paper/modules/operations.html#find"}),"API"))),Object(r.mdx)("p",null,"In order to make changes to documents it's important to have access to a version of the document that can be mutated. If there is access to a read-only/frozen/stale document in scope, a mutable version can be looked up via ",Object(r.mdx)("inlineCode",{parentName:"p"},"find"),"."),Object(r.mdx)("pre",null,Object(r.mdx)("code",Object(a.default)({parentName:"pre"},{className:"language-js"}),"let existingDocument;\n\nawait paper.mutate(({ find }) => {\n  const mutableVersion = find(existingDocument);\n});\n")),Object(r.mdx)("h3",{id:"remove"},Object(r.mdx)("inlineCode",{parentName:"h3"},"remove")),Object(r.mdx)("ul",null,Object(r.mdx)("li",{parentName:"ul"},Object(r.mdx)("a",Object(a.default)({parentName:"li"},{href:"/api/paper/modules/operations.html#remove"}),"API"))),Object(r.mdx)("p",null,"To remove a ",Object(r.mdx)("inlineCode",{parentName:"p"},"Document")," from the store use the ",Object(r.mdx)("inlineCode",{parentName:"p"},"remove")," operation."),Object(r.mdx)("pre",null,Object(r.mdx)("code",Object(a.default)({parentName:"pre"},{className:"language-js"}),"await paper.mutate(({ remove }) => {\n  remove(document);\n});\n")),Object(r.mdx)("h3",{id:"clone"},Object(r.mdx)("inlineCode",{parentName:"h3"},"clone")),Object(r.mdx)("ul",null,Object(r.mdx)("li",{parentName:"ul"},Object(r.mdx)("a",Object(a.default)({parentName:"li"},{href:"/api/paper/modules/operations.html#clone"}),"API"))),Object(r.mdx)("p",null,"Use the ",Object(r.mdx)("inlineCode",{parentName:"p"},"clone")," operation to create a new document that copies the properties and connections of an existing document."),Object(r.mdx)("pre",null,Object(r.mdx)("code",Object(a.default)({parentName:"pre"},{className:"language-js"}),"await paper.mutate(({ clone }) => {\n  const newDocument = clone(document);\n});\n")),Object(r.mdx)("h3",{id:"getstore"},Object(r.mdx)("inlineCode",{parentName:"h3"},"getStore")),Object(r.mdx)("ul",null,Object(r.mdx)("li",{parentName:"ul"},Object(r.mdx)("a",Object(a.default)({parentName:"li"},{href:"/api/paper/modules/operations.html#getStore"}),"API"))),Object(r.mdx)("p",null,"This operation gives the current ",Object(r.mdx)("strong",{parentName:"p"},"mutable")," version of the ",Object(r.mdx)("inlineCode",{parentName:"p"},"DocumentStore")," available for mutating within the ",Object(r.mdx)("em",{parentName:"p"},"Mutation Transaction")," callback. This is useful for when access to underlying ",Object(r.mdx)("inlineCode",{parentName:"p"},"DocumentStore")," data structure and its ",Object(r.mdx)("inlineCode",{parentName:"p"},"Documents")," is required. It can also be useful to query by using typical javascript methods, for example:"),Object(r.mdx)("pre",null,Object(r.mdx)("code",Object(a.default)({parentName:"pre"},{className:"language-js"}),"await paper.mutate(({ getStore }) => {\n  const store = getStore();\n  // Get the `Actor` document for \"Julia Roberts\" using available\n  // javascript array methods\n  const julia = store.Actor.find(({ name }) => name === 'Julia Roberts');\n});\n")),Object(r.mdx)("p",null,"If common modifications are being done via ",Object(r.mdx)("inlineCode",{parentName:"p"},"getStore")," consider making a ",Object(r.mdx)("a",Object(a.default)({parentName:"p"},{href:"/docs/paper/operations#creating-custom-operations"}),"custom operation"),"."),Object(r.mdx)("h3",{id:"queueevent"},Object(r.mdx)("inlineCode",{parentName:"h3"},"queueEvent")),Object(r.mdx)("ul",null,Object(r.mdx)("li",{parentName:"ul"},Object(r.mdx)("a",Object(a.default)({parentName:"li"},{href:"/api/paper/modules/operations.html#queueEvent"}),"API"))),Object(r.mdx)("p",null,"Use the ",Object(r.mdx)("inlineCode",{parentName:"p"},"queueEvent")," operation to queue an event to be dispatched after the transaction is complete. The ",Object(r.mdx)("inlineCode",{parentName:"p"},"queueEvent")," takes an instance of ",Object(r.mdx)("inlineCode",{parentName:"p"},"Event"),"."),Object(r.mdx)("pre",null,Object(r.mdx)("code",Object(a.default)({parentName:"pre"},{className:"language-js"}),"await paper.mutate(({ queueEvent }) => {\n  queueEvent(new Event('meow', { /* custom event data */ }));\n});\n")),Object(r.mdx)("h2",{id:"creating-connections-between-documents"},"Creating Connections Between Documents"),Object(r.mdx)("p",null,"A ",Object(r.mdx)("em",{parentName:"p"},"Connection")," is used to create a relationship between Documents where one GraphQL type references another GraphQL type in the GraphQL schema."),Object(r.mdx)("p",null,"A ",Object(r.mdx)("inlineCode",{parentName:"p"},"Document")," reference can be:"),Object(r.mdx)("ul",null,Object(r.mdx)("li",{parentName:"ul"},"one-to-one, ie: one film can have one leading actor:")),Object(r.mdx)("pre",null,Object(r.mdx)("code",Object(a.default)({parentName:"pre"},{className:"language-graphql"}),"type Film {\n  leadingActor: Actor\n}\n")),Object(r.mdx)("ul",null,Object(r.mdx)("li",{parentName:"ul"},"one-to-many, ie: one film can have many actors:")),Object(r.mdx)("pre",null,Object(r.mdx)("code",Object(a.default)({parentName:"pre"},{className:"language-graphql"}),"type Film {\n  leadingActors: [Actor]\n}\n")),Object(r.mdx)("p",null,Object(r.mdx)("strong",{parentName:"p"},"Note:")," Non-null (denoted by a ",Object(r.mdx)("inlineCode",{parentName:"p"},"!"),", ie: ",Object(r.mdx)("inlineCode",{parentName:"p"},"Actor!"),", ",Object(r.mdx)("inlineCode",{parentName:"p"},"[Actor!]!"),", ",Object(r.mdx)("inlineCode",{parentName:"p"},"[Actor!]"),", ",Object(r.mdx)("inlineCode",{parentName:"p"},"[Actor]!"),") variations of these also work and are validated."),Object(r.mdx)("p",null,Object(r.mdx)("strong",{parentName:"p"},"Note:"),' Connections are one direction. If "Document A" is connected to "Document B" and "Document B" is also connected to "Document A" then two connections must be defined explicitly. There is no automatic reflexive assumptions or setup done between connections (although a custom operation could be created to handle these cases).'),Object(r.mdx)("h3",{id:"creating-connections-via-document-properties"},"Creating Connections via Document Properties"),Object(r.mdx)("p",null,"Within a ",Object(r.mdx)("em",{parentName:"p"},"Mutate Transaction")," callback changes can be made to any documents and their properties."),Object(r.mdx)("h4",{id:"one-to-one-connections"},"One-to-One Connections"),Object(r.mdx)("p",null,"To create a one-way one-to-one connection between a document and another, assign the property to a ",Object(r.mdx)("inlineCode",{parentName:"p"},"Document"),", see below where the ",Object(r.mdx)("inlineCode",{parentName:"p"},"leadingActor")," property is connected by assigning the ",Object(r.mdx)("inlineCode",{parentName:"p"},"jeffGoldblum")," document."),Object(r.mdx)("pre",null,Object(r.mdx)("code",Object(a.default)({parentName:"pre"},{className:"language-js"}),"await paper.mutate(({ create }) => {\n  const jeffGoldblum = create('Actor', {\n    name: 'Jeff Goldblum'\n  });\n\n  // as a property within `create`\n  const jurassicPark = create('Film', {\n    name: 'Jurassic Park',\n    leadingActor: jeffGoldblum\n  });\n\n  // or assigned after\n  const lifeAquatic = create('Film', {\n    name: 'The Life Aquatic'\n  });\n\n  lifeAquatic.leadingActor = jeffGoldbum;\n});\n")),Object(r.mdx)("h4",{id:"one-to-many-connections"},"One-to-Many Connections"),Object(r.mdx)("p",null,"To create a one-way one-to-many connection reference documents on the property via an Array, this works with new and existing documents."),Object(r.mdx)("pre",null,Object(r.mdx)("code",Object(a.default)({parentName:"pre"},{className:"language-js"}),"await paper.mutate(({ create }) => {\n  const anjelicaHuston = create('Actor', {\n    name: 'Anjelica Huston'\n  });\n\n  const owenWilson = create('Actor', {\n    name: 'Owen Wilson'\n  });\n\n  // on the `actors` property within `create`\n  const theRoyalTenebaums = create('Film', {\n    title: 'The Royal Tenebaums',\n    actors: [anjelicaHuston, owenWilson]\n  })\n\n  // or assigned after via `push` to an array\n  const theLifeAquatic = create('Film', {\n    title: 'The Life Aquatic'\n  });\n\n  // This works assuming it's a non-null list:\n  // (ie: `actors: [Actor]!` or `actors: [Actor!]!`.\n  //\n  // Otherwise the array needs to be created first since it could be null:\n  // `theLifeAquatic.actors = theLifeAquatic.actors ?? [];`\n  //\n  // see note below for more details\n  theLifeAquatic.actors.push(anjelicaHuston, owenWilson);\n});\n")),Object(r.mdx)("p",null,Object(r.mdx)("strong",{parentName:"p"},"Note:")," While less typical in GraphQL Schemas, if a one-to-many property can nullable (ie: ",Object(r.mdx)("inlineCode",{parentName:"p"},"actors: [Actor]")," ",Object(r.mdx)("em",{parentName:"p"},"without")," an ",Object(r.mdx)("inlineCode",{parentName:"p"},"!")," outside the list) then it's important to make sure you are working with an array before pushing to it. The ",Object(r.mdx)("inlineCode",{parentName:"p"},"??")," can help in this case. If working with a non-null list (",Object(r.mdx)("inlineCode",{parentName:"p"},"[Actor]!")," or  ",Object(r.mdx)("inlineCode",{parentName:"p"},"[Actor!]!"),") then it will already be an array by default."),Object(r.mdx)("pre",null,Object(r.mdx)("code",Object(a.default)({parentName:"pre"},{className:"language-js"}),"await paper.mutate(({ create }) => {\n  film.actors = film.actors ?? [];\n  film.actors.push(newActor);\n});\n")),Object(r.mdx)("h3",{id:"creating-connections-within-create-via-nesting"},"Creating Connections within ",Object(r.mdx)("inlineCode",{parentName:"h3"},"create")," via Nesting"),Object(r.mdx)("p",null,"One powerful technique is to use the ",Object(r.mdx)("inlineCode",{parentName:"p"},"create")," operation with a nested object that includes its connections. This nesting will work recursively. Other documents that have already been created can be included, too."),Object(r.mdx)("pre",null,Object(r.mdx)("code",Object(a.default)({parentName:"pre"},{className:"language-js"}),"await paper.mutate(({ create }) => {\n  // documents created outside of nesting can be used within nesting, too\n  const scarlettJohansson = create('Actor', { name: 'Scarlett Johansson' });\n\n  const isleOfDogs = create('Film', {\n    title: 'Isle of Dogs',\n    actors: [\n      scarlettJohansson,\n      { name: 'Jeff Goldblum' },\n      { name: 'Tilda Swinton' },\n      { name: 'Bill Murray' },\n      { name: 'Bryan Cranston' },\n    ]\n  });\n});\n")),Object(r.mdx)("p",null,"This nested ",Object(r.mdx)("inlineCode",{parentName:"p"},"create")," will end up creating a ",Object(r.mdx)("inlineCode",{parentName:"p"},"Film")," document and four ",Object(r.mdx)("inlineCode",{parentName:"p"},"Actor")," documents, skipping creating ",Object(r.mdx)("inlineCode",{parentName:"p"},"scarlettJohansson")," because the ",Object(r.mdx)("inlineCode",{parentName:"p"},"Actor")," document was already created but it will still be included as a connection."),Object(r.mdx)("h2",{id:"returning-data-outside-the-mutate-transaction-callback"},"Returning Data Outside the ",Object(r.mdx)("em",{parentName:"h2"},"Mutate Transaction")," callback"),Object(r.mdx)("p",null,"It's also very useful to return documents that have been used or created within a ",Object(r.mdx)("inlineCode",{parentName:"p"},"mutate")," transaction to be referenced afterwards. This can be done by returning a document, an array of documents, or an object with documents values, from the ",Object(r.mdx)("em",{parentName:"p"},"Mutate Transaction")," callback. See ",Object(r.mdx)("a",Object(a.default)({parentName:"p"},{href:"/docs/paper/querying-data#returning-documents-from-mutation-transactions"}),Object(r.mdx)("em",{parentName:"a"},"Returning Documents from Mutation Transactions"))," for examples."))}d.isMDXComponent=!0}}]);
"use strict";(self.webpackChunk_graphql_mocks_docs=self.webpackChunk_graphql_mocks_docs||[]).push([[9479],{5141:function(e,n,t){t.d(n,{u:function(){return r}});var a=t(2784);function r(e){return a.createElement(a.Fragment,null,a.createElement("strong",null,"Result: "),a.createElement("pre",{className:"graphql-result"},JSON.stringify(e.result,null,2)))}},46441:function(e,n,t){t.r(n),t.d(n,{assets:function(){return y},contentTitle:function(){return k},default:function(){return N},frontMatter:function(){return f},metadata:function(){return v},toc:function(){return b}});var a=t(28427),r=t(84397),o=(t(2784),t(30876)),i=t(5141),l=["components"],p={toc:[]};function s(e){var n=e.components,t=(0,r.Z)(e,l);return(0,o.kt)("wrapper",(0,a.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'import { Paper } from "graphql-paper";\nimport { GraphQLHandler } from "graphql-mocks";\nimport { extractDependencies } from "graphql-mocks/resolver";\n\nconst graphqlSchema = `\n  schema {\n    query: Query\n  }\n\n  type Query {\n    films: [Film!]!\n  }\n\n  type Film {\n    title: String!\n    year: String!\n    actors: [Actor!]!\n  }\n\n  type Actor {\n    name: String!\n  }\n`;\n\nasync function run() {\n  const paper = new Paper(graphqlSchema);\n\n  // seed with some data about the film "The Notebook"\n  await paper.mutate(({ create }) => {\n    const rachel = create("Actor", {\n      name: "Rachel McAdams",\n    });\n\n    const ryan = create("Actor", {\n      name: "Ryan Gosling",\n    });\n\n    create("Film", {\n      title: "The Notebook",\n      year: "2004",\n      actors: [rachel, ryan],\n    });\n  });\n\n  const resolverMap = {\n    Query: {\n      films(root, args, context, info) {\n        const { paper } = extractDependencies(context, ["paper"]);\n\n        // return all Documents of type `Film`\n        return paper.data.Film;\n      },\n    },\n  };\n\n  const handler = new GraphQLHandler({\n    resolverMap,\n    dependencies: { graphqlSchema, paper },\n  });\n\n  const result = await handler.query(`\n    query {\n      films {\n        title\n        year\n        actors {\n          name\n        }\n      }\n    }\n  `);\n  console.log(result);\n}\n\n// kick everything off!\nrun();\n')))}s.isMDXComponent=!0;var d={data:{films:[{title:"The Notebook",year:"2004",actors:[{name:"Rachel McAdams"},{name:"Ryan Gosling"}]}]}},c=["components"],u={toc:[]};function m(e){var n=e.components,t=(0,r.Z)(e,c);return(0,o.kt)("wrapper",(0,a.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'import { Paper } from "graphql-paper";\nimport { GraphQLHandler } from "graphql-mocks";\nimport { extractDependencies } from "graphql-mocks/resolver";\nimport { v4 as uuid } from "uuid";\n\nconst graphqlSchema = `\n  schema {\n    query: Query\n    mutation: Mutation\n  }\n\n  type Query {\n    noop: Boolean\n  }\n\n  type Mutation {\n    addFilm(input: AddFilmInput): Film!\n  }\n\n  type Film {\n    id: ID!\n    title: String!\n    year: String!\n    actors: [Actor!]!\n  }\n\n  type Actor {\n    id: ID!\n    name: String!\n  }\n\n  input AddFilmInput {\n    title: String!\n    year: String!\n    actorIds: [ID!]\n  }\n`;\n\nasync function run() {\n  const paper = new Paper(graphqlSchema);\n\n  const { tomHanks, wilson } = await paper.mutate(({ create }) => {\n    const tomHanks = create("Actor", {\n      id: uuid(),\n      name: "Tom Hanks",\n    });\n\n    const wilson = create("Actor", {\n      id: uuid(),\n      name: "Wilson the Volleyball",\n    });\n\n    return { tomHanks, wilson };\n  });\n\n  const resolverMap = {\n    Mutation: {\n      addFilm(root, args, context, info) {\n        const { paper } = extractDependencies(context, ["paper"]);\n\n        // find Actor documents based on args.input.actorIds\n        const filmActors = (args.input.actorIds ?? [])\n          .map((actorId) =>\n            paper.data.Actor.find((actor) => actor.id === actorId)\n          )\n          .filter(Boolean);\n\n        // return created Film document, matching `addFilm` return type: Film!\n        const newFilm = paper.mutate(({ create }) => {\n          return create("Film", {\n            id: uuid(),\n            title: args.input.title,\n            year: args.input.year,\n            actors: filmActors,\n          });\n        });\n\n        return newFilm;\n      },\n    },\n  };\n\n  const handler = new GraphQLHandler({\n    resolverMap,\n    dependencies: { graphqlSchema, paper },\n  });\n\n  const result = await handler.query(\n    `\n    mutation($addFilmInput: AddFilmInput) {\n      addFilm(input: $addFilmInput) {\n        title\n        year\n        actors {\n          name\n        }\n      }\n    }\n  `,\n    {\n      addFilmInput: {\n        title: "Cast Away",\n        year: "2000",\n        actorIds: [tomHanks.id, wilson.id],\n      },\n    }\n  );\n  console.log(result);\n}\n\n// kick everything off!\nrun();\n')))}m.isMDXComponent=!0;var h={data:{addFilm:{title:"Cast Away",year:"2000",actors:[{name:"Tom Hanks"},{name:"Wilson the Volleyball"}]}}},g=["components"],f={title:"Using Paper with graphql-mocks"},k=void 0,v={unversionedId:"guides/paper",id:"guides/paper",title:"Using Paper with graphql-mocks",description:"GraphQL Paper can be used on its own but has been designed and tested to integrate with graphql-mocks.",source:"@site/docs/guides/paper.md",sourceDirName:"guides",slug:"/guides/paper",permalink:"/docs/guides/paper",draft:!1,tags:[],version:"current",frontMatter:{title:"Using Paper with graphql-mocks"},sidebar:"docs",previous:{title:"gqlmocks Config File",permalink:"/docs/cli/gqlmocks-config"},next:{title:"Managing Resolver Context",permalink:"/docs/guides/managing-context"}},y={},b=[{value:"Installation",id:"installation",level:2},{value:"Setup",id:"setup",level:2},{value:"Using <code>Paper</code> within Resolver Functions",id:"using-paper-within-resolver-functions",level:2},{value:"Querying Data",id:"querying-data",level:2},{value:"Mutating Data",id:"mutating-data",level:2},{value:"Separation of Concrete and Derived Data",id:"separation-of-concrete-and-derived-data",level:2},{value:"Concrete Data",id:"concrete-data",level:3},{value:"Derived Data",id:"derived-data",level:3},{value:"Derived Types",id:"derived-types",level:4},{value:"Using Resolvers",id:"using-resolvers",level:5},{value:"Using Resolver Wrappers",id:"using-resolver-wrappers",level:5},{value:"Derived Fields",id:"derived-fields",level:4}],w={toc:b};function N(e){var n=e.components,t=(0,r.Z)(e,g);return(0,o.kt)("wrapper",(0,a.Z)({},w,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"GraphQL Paper can be used on its own but has been designed and tested to integrate with ",(0,o.kt)("inlineCode",{parentName:"p"},"graphql-mocks"),"."),(0,o.kt)("p",null,"For more features specific to GraphQL Paper and its capabilities check out the ",(0,o.kt)("a",{parentName:"p",href:"/docs/paper/introducing-paper"},"GraphQL Paper Documentation"),"."),(0,o.kt)("h2",{id:"installation"},"Installation"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"# npm\nnpm install --save-dev graphql-paper graphql\n\n# yarn\nyarn add --dev graphql-paper graphql\n")),(0,o.kt)("h2",{id:"setup"},"Setup"),(0,o.kt)("p",null,"The only setup after installing the ",(0,o.kt)("inlineCode",{parentName:"p"},"graphql-paper")," package is to import it, create a new instance and add it to the GraphQL Handler's dependencies."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"import { Paper } from 'graphql-paper';\nimport { GraphQLHandler } from 'graphql-mocks';\nimport graphqlSchema from './schema';\n\nconst paper = new Paper(graphqlSchema);\nconst handler = new GraphQLHandler({ dependencies: { graphqlSchema, paper }})\n")),(0,o.kt)("h2",{id:"using-paper-within-resolver-functions"},"Using ",(0,o.kt)("inlineCode",{parentName:"h2"},"Paper")," within Resolver Functions"),(0,o.kt)("p",null,"Within a resolver function the ",(0,o.kt)("inlineCode",{parentName:"p"},"paper")," dependency can be extracted using ",(0,o.kt)("inlineCode",{parentName:"p"},"extractDependencies"),"."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"import { extractDependencies } from 'graphql-mocks/resolver';\n\nfunction resolver(parent, args, context, info) {\n    const paper = extractDependencies(context, ['paper']);\n    // do something with the paper store...\n    // see below for query and mutation examples\n}\n")),(0,o.kt)("h2",{id:"querying-data"},"Querying Data"),(0,o.kt)("p",null,"Only top-level Query resolvers need to be specified for the GraphQL Paper Document. The rercursive data structure of Paper Documents from the store will follow Connections to other Paper Documents, automatically resolving the fields backed by ",(0,o.kt)("em",{parentName:"p"},"Concrete Data"),". In the case of ",(0,o.kt)("em",{parentName:"p"},"Derived Data")," there are some examples and patterns to follow below."),(0,o.kt)(s,{mdxType:"PaperQueryingExample"}),(0,o.kt)(i.u,{result:d,mdxType:"GraphQLResult"}),(0,o.kt)("h2",{id:"mutating-data"},"Mutating Data"),(0,o.kt)("p",null,"Similar to ",(0,o.kt)("em",{parentName:"p"},"Querying Data")," only the top-level Mutation resolvers need to be defined returning necessary documents and nested ",(0,o.kt)("em",{parentName:"p"},"Concrete Data")," will be automatically resolved."),(0,o.kt)(m,{mdxType:"PaperMutationExample"}),(0,o.kt)(i.u,{result:h,mdxType:"GraphQLResult"}),(0,o.kt)("h2",{id:"separation-of-concrete-and-derived-data"},"Separation of Concrete and Derived Data"),(0,o.kt)("p",null,"One important thing to consider when using GraphQL Paper with ",(0,o.kt)("inlineCode",{parentName:"p"},"graphql-mocks")," is how data should be modeled. Most of the time the data is dealt with as ",(0,o.kt)("em",{parentName:"p"},"Concrete Data")," and should be stored in the GraphQL Paper store. In other cases it's ",(0,o.kt)("em",{parentName:"p"},"Derived Data")," and should be handled by ",(0,o.kt)("inlineCode",{parentName:"p"},"graphql-mocks")," and its tools. These definitions and examples are expanded on below."),(0,o.kt)("h3",{id:"concrete-data"},"Concrete Data"),(0,o.kt)("p",null,"Concrete data usually represents a distinct entity, might have an ID and defined property values. In the example of GraphQL Paper concrete data is represented by a Paper Document and its properties. Not all GraphQL Types or fields on GraphQL Types should be reflected by concrete data, which is covered in the ",(0,o.kt)("em",{parentName:"p"},"Derived Data")," sections below."),(0,o.kt)("p",null,"An example of concrete data could be a ",(0,o.kt)("inlineCode",{parentName:"p"},"Film")," which is unique and represents a singular entity."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-graphql"},"type Film {\n  title: String!\n}\n")),(0,o.kt)("p",null,"represented concretely by a Paper Document:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"{\n  title: 'The Notebook'\n}\n")),(0,o.kt)("p",null,"This is an example of ",(0,o.kt)("em",{parentName:"p"},"Concrete Data")," represented by a GraphQL Paper Document where its properties mirror the GraphQL Types and its fields which allows for the data to resolve automatically, and recursively through connections and their fields."),(0,o.kt)("h3",{id:"derived-data"},"Derived Data"),(0,o.kt)("p",null,"Derived Data represents data that does not stand on its own and should be handled by ",(0,o.kt)("inlineCode",{parentName:"p"},"graphql-mocks")," in helping resolve a query with supporting data from the GraphQL Paper store. There are two main types of ",(0,o.kt)("em",{parentName:"p"},"Derived Data")," when dealing and resolving GraphQL queries."),(0,o.kt)("h4",{id:"derived-types"},"Derived Types"),(0,o.kt)("p",null,"Derived types are types whose definition is derived by the concrete data it contains but on its own is not reflected in the store. The container type often acts a logical grouping."),(0,o.kt)("p",null,"In this example ",(0,o.kt)("inlineCode",{parentName:"p"},"FilmSearchResults")," represents a container containing the actual results of films and the count. This type should not have any documents stored in GraphQL Paper but can still be resolved by a ",(0,o.kt)("em",{parentName:"p"},"Resolver")," or ",(0,o.kt)("em",{parentName:"p"},"Resolver Wrapper"),"."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-graphql"},"type FilmSearchResults {\n  results: [Film!]!\n  count: Int!\n}\n")),(0,o.kt)("h5",{id:"using-resolvers"},"Using Resolvers"),(0,o.kt)("p",null,"A ",(0,o.kt)("em",{parentName:"p"},"Resolver")," function can be used to resolve the correct shape of the ",(0,o.kt)("em",{parentName:"p"},"Derived Data"),". In the case a ",(0,o.kt)("em",{parentName:"p"},"Resolver")," function already exists then using a ",(0,o.kt)("em",{parentName:"p"},"Resolver Wrapper")," is appropriate (see below)."),(0,o.kt)("p",null,"This example uses the ",(0,o.kt)("inlineCode",{parentName:"p"},"FilmSearchResults")," type from above and assumes that we have a top-level query field ",(0,o.kt)("inlineCode",{parentName:"p"},"searchFilms"),":"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-graphql"},"type Query {\n  searchFilm(query: String!): FilmSearchResults!\n}\n")),(0,o.kt)("p",null,"The ",(0,o.kt)("inlineCode",{parentName:"p"},"searchFilm")," resolver function could look like:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'const  searchFilmResolver = (root, args, context, info) => {\n  const { paper } = extractDependencies(context, ["paper"]);\n  const films = paper.data.Film.filter((film) => film.title.includes(args.query));\n\n  // return the required shape of `FilmSearchResults`\n  return {\n    results: films,\n    count: films.length,\n  };\n}\n')),(0,o.kt)("p",null,"This resolver can be applied to the initial ",(0,o.kt)("inlineCode",{parentName:"p"},"resolverMap")," passed into the ",(0,o.kt)("a",{parentName:"p",href:"/docs/handler/introducing-handler"},"GraphQL Handler")," or applied via ",(0,o.kt)("a",{parentName:"p",href:"/docs/resolver-map/managing-resolvers#using-embed"},(0,o.kt)("inlineCode",{parentName:"a"},"embed")),"."),(0,o.kt)("h5",{id:"using-resolver-wrappers"},"Using Resolver Wrappers"),(0,o.kt)("p",null,"In some special cases the data might already be represented by a field with a resolver that resolves the correct data but not in the supporting shape of the ",(0,o.kt)("em",{parentName:"p"},"Derived Type"),". In this case a ",(0,o.kt)("em",{parentName:"p"},"Resolver Wrapper")," can be used to retrieve the data of the original resolver and return a modified form. This has the added benefit of decoupling the resolver sourcing the data from the wrapper that transforms it to the shape expected, making the wrapper re-usable also in cases where this transform might be needed again."),(0,o.kt)("p",null,"In this example the ",(0,o.kt)("inlineCode",{parentName:"p"},"films")," property on an ",(0,o.kt)("inlineCode",{parentName:"p"},"Actor")," might already be returning the ",(0,o.kt)("inlineCode",{parentName:"p"},"films")," property but not in the shape of ",(0,o.kt)("inlineCode",{parentName:"p"},"FilmSearchResults"),"."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-graphql"},"type Actor {\n  films(query: String!): FilmSearchResults!\n}\n")),(0,o.kt)("p",null,"Assuming the original resolver returns an array of ",(0,o.kt)("inlineCode",{parentName:"p"},"Film")," documents we could use this wrapper:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"import { createWrapper, WrapperFor } from 'graphql-mocks/resolver';\n\nconst wrapper = createWrapper('FilmSearchResults', WrapperFor.FIELD, function(originalResolver, wrapperOptions) {\n  return function filmSearchResultsWrapper(parent, args, context, info) {\n    const films = await originalResolver(parent, args, context, info);\n    return {\n      results: films,\n      count: films.length\n    };\n  };\n});\n")),(0,o.kt)("h4",{id:"derived-fields"},"Derived Fields"),(0,o.kt)("p",null,"In other cases derived fields could be something that derives its value from other fields or when filtering the existing data based on the arguments."),(0,o.kt)("p",null,"In the case that the derived data is filtered or refined based on arguments, and the data exists by the resolver already, it's best to use a resolver wrapper. See ",(0,o.kt)("a",{parentName:"p",href:"/docs/guides/automatic-filtering"},(0,o.kt)("em",{parentName:"a"},"Automatic Resolver Filtering with Wrappers"))," for ideas and examples."),(0,o.kt)("p",null,"This is an example of a value being derived from other fields. We wouldn't want to store the ",(0,o.kt)("inlineCode",{parentName:"p"},"speed")," on the Paper Document since it can be determined from ",(0,o.kt)("inlineCode",{parentName:"p"},"miles")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"timeInHours"),". The ",(0,o.kt)("inlineCode",{parentName:"p"},"speed")," data itself would would be best represented by a resolver."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-graphql"},"type Trip {\n  miles: Float!\n  timeInHours: Float!\n\n  # miles per hour (miles / timeInHours)\n  speed: Float!\n}\n")),(0,o.kt)("p",null,"The resolver for the ",(0,o.kt)("inlineCode",{parentName:"p"},"speed")," field would look like:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"function tripSpeedResolver(parent, args, context, info) {\n  const { miles, timeInHours } = parent;\n  return miles / timeInHours;\n}\n")),(0,o.kt)("p",null,"This resolver can be applied to the initial ",(0,o.kt)("inlineCode",{parentName:"p"},"resolverMap")," passed into the ",(0,o.kt)("a",{parentName:"p",href:"/docs/handler/introducing-handler"},"GraphQL Handler")," or applied via ",(0,o.kt)("a",{parentName:"p",href:"/docs/resolver-map/managing-resolvers#using-embed"},(0,o.kt)("inlineCode",{parentName:"a"},"embed")),"."))}N.isMDXComponent=!0},30876:function(e,n,t){t.d(n,{Zo:function(){return d},kt:function(){return m}});var a=t(2784);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var p=a.createContext({}),s=function(e){var n=a.useContext(p),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},d=function(e){var n=s(e.components);return a.createElement(p.Provider,{value:n},e.children)},c={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},u=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,o=e.originalType,p=e.parentName,d=l(e,["components","mdxType","originalType","parentName"]),u=s(t),m=r,h=u["".concat(p,".").concat(m)]||u[m]||c[m]||o;return t?a.createElement(h,i(i({ref:n},d),{},{components:t})):a.createElement(h,i({ref:n},d))}));function m(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var o=t.length,i=new Array(o);i[0]=u;var l={};for(var p in n)hasOwnProperty.call(n,p)&&(l[p]=n[p]);l.originalType=e,l.mdxType="string"==typeof e?e:r,i[1]=l;for(var s=2;s<o;s++)i[s]=t[s];return a.createElement.apply(null,i)}return a.createElement.apply(null,t)}u.displayName="MDXCreateElement"}}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{121:function(e,t,i){"use strict";i.r(t),i.d(t,"MDXContext",(function(){return d})),i.d(t,"MDXProvider",(function(){return p})),i.d(t,"mdx",(function(){return f})),i.d(t,"useMDXComponents",(function(){return m})),i.d(t,"withMDXComponents",(function(){return s}));var n=i(0),r=i.n(n);function a(e,t,i){return t in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}function l(){return(l=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(e[n]=i[n])}return e}).apply(this,arguments)}function h(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),i.push.apply(i,n)}return i}function c(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?h(Object(i),!0).forEach((function(t){a(e,t,i[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):h(Object(i)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))}))}return e}function o(e,t){if(null==e)return{};var i,n,r=function(e,t){if(null==e)return{};var i,n,r={},a=Object.keys(e);for(n=0;n<a.length;n++)i=a[n],t.indexOf(i)>=0||(r[i]=e[i]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)i=a[n],t.indexOf(i)>=0||Object.prototype.propertyIsEnumerable.call(e,i)&&(r[i]=e[i])}return r}var d=r.a.createContext({}),s=function(e){return function(t){var i=m(t.components);return r.a.createElement(e,l({},t,{components:i}))}},m=function(e){var t=r.a.useContext(d),i=t;return e&&(i="function"==typeof e?e(t):c(c({},t),e)),i},p=function(e){var t=m(e.components);return r.a.createElement(d.Provider,{value:t},e.children)},g={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},u=r.a.forwardRef((function(e,t){var i=e.components,n=e.mdxType,a=e.originalType,l=e.parentName,h=o(e,["components","mdxType","originalType","parentName"]),d=m(i),s=n,p=d["".concat(l,".").concat(s)]||d[s]||g[s]||a;return i?r.a.createElement(p,c(c({ref:t},h),{},{components:i})):r.a.createElement(p,c({ref:t},h))}));function f(e,t){var i=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var a=i.length,l=new Array(a);l[0]=u;var h={};for(var c in t)hasOwnProperty.call(t,c)&&(h[c]=t[c]);h.originalType=e,h.mdxType="string"==typeof e?e:n,l[1]=h;for(var o=2;o<a;o++)l[o]=i[o];return r.a.createElement.apply(null,l)}return r.a.createElement.apply(null,i)}u.displayName="MDXCreateElement"},51:function(e,t,i){"use strict";i.r(t),i.d(t,"frontMatter",(function(){return l})),i.d(t,"metadata",(function(){return h})),i.d(t,"rightToc",(function(){return c})),i.d(t,"default",(function(){return d}));var n=i(2),r=i(7),a=(i(0),i(121)),l={title:"Introducing Highlight"},h={unversionedId:"highlight/introducing-highlight",id:"highlight/introducing-highlight",isDocsHomePage:!1,title:"Introducing Highlight",description:"One of the most important parts about mocking a GraphQL API is being able to quickly and effectively target specific parts of the GraphQL Schema. Highlight is a declarative, extensible, system for describing Named Types, and their fields, of the GraphQL Schema. With this type of control it becomes quick to mock specific types and fields and use Highlights in Resolver Map Middlewares and other utilities.",source:"@site/docs/highlight/introducing-highlight.md",slug:"/highlight/introducing-highlight",permalink:"/docs/highlight/introducing-highlight",version:"current",sidebar:"docs",previous:{title:"Creating Custom Middlewares",permalink:"/docs/resolver-map/creating-middlewares"},next:{title:"Available Highlighters",permalink:"/docs/highlight/available-highlighters"}},c=[{value:"The <code>Highlight</code> instance",id:"the-highlight-instance",children:[]},{value:"References",id:"references",children:[]},{value:"Pulling Highlighted References from a <code>Highlight</code> instance",id:"pulling-highlighted-references-from-a-highlight-instance",children:[]},{value:"<code>highlight</code> Middleware Option",id:"highlight-middleware-option",children:[]}],o={rightToc:c};function d(e){var t=e.components,i=Object(r.default)(e,["components"]);return Object(a.mdx)("wrapper",Object(n.default)({},o,i,{components:t,mdxType:"MDXLayout"}),Object(a.mdx)("p",null,"One of the most important parts about mocking a GraphQL API is being able to quickly and effectively target specific parts of the GraphQL Schema. Highlight is a declarative, extensible, system for describing ",Object(a.mdx)("em",{parentName:"p"},"Named Types"),", and their fields, of the GraphQL Schema. With this type of control it becomes quick to mock specific types and fields and use Highlights in Resolver Map Middlewares and other utilities."),Object(a.mdx)("p",null,"Here is an brief example of using ",Object(a.mdx)("em",{parentName:"p"},"Highlight"),":"),Object(a.mdx)("pre",null,Object(a.mdx)("code",Object(n.default)({parentName:"pre"},{className:"language-js"}),"import { hi, field } from '@graphql-mocks/highlight';\nimport graphqlSchema from './schema';\n\nconst highlights = hi(graphqlSchema).include(field(['Query', '*']));\n")),Object(a.mdx)("p",null,"In this example, ",Object(a.mdx)("inlineCode",{parentName:"p"},"field")," is a Highlighter and it targets fields on the schema. The Highlighter being used with the Highlight system will capture all the fields (denoted by the ",Object(a.mdx)("inlineCode",{parentName:"p"},"*"),") on the ",Object(a.mdx)("inlineCode",{parentName:"p"},"Query")," type of the schema. Highlighters are what are used to declaratively identify the different parts of a GraphQL schema. There are ",Object(a.mdx)("a",Object(n.default)({parentName:"p"},{href:"/docs/highlight/available-highlighters"}),"more highlighters")," to check out, also learn how to ",Object(a.mdx)("a",Object(n.default)({parentName:"p"},{href:"/docs/highlight/creating-highlighters"}),"create your own"),"."),Object(a.mdx)("h2",{id:"the-highlight-instance"},"The ",Object(a.mdx)("inlineCode",{parentName:"h2"},"Highlight")," instance"),Object(a.mdx)("pre",null,Object(a.mdx)("code",Object(n.default)({parentName:"pre"},{className:"language-js"}),"import { hi, Highlight } from '@graphql-mocks/highlight';\nimport graphqlSchema from './schema';\nconst h1 = hi(graphqlSchema);\nconst h2 = new Highlight(graphqlSchema);\n")),Object(a.mdx)("p",null,Object(a.mdx)("inlineCode",{parentName:"p"},"hi")," or the ",Object(a.mdx)("inlineCode",{parentName:"p"},"Highlight")," constructor can be imported from ",Object(a.mdx)("inlineCode",{parentName:"p"},"@graphql-mocks/highlight")," and both will produce a ",Object(a.mdx)("inlineCode",{parentName:"p"},"Highlight")," instance. An instance has three available methods:"),Object(a.mdx)("ul",null,Object(a.mdx)("li",{parentName:"ul"},Object(a.mdx)("inlineCode",{parentName:"li"},"include")," - Add additional highlights/references to be included"),Object(a.mdx)("li",{parentName:"ul"},Object(a.mdx)("inlineCode",{parentName:"li"},"exclude")," - Remove specified highlights/references from being included"),Object(a.mdx)("li",{parentName:"ul"},Object(a.mdx)("inlineCode",{parentName:"li"},"filter")," - Filter the existing selection to include the specified highlights/references")),Object(a.mdx)("p",null,Object(a.mdx)("strong",{parentName:"p"},"Note:")," All three of these take the same arguments, as many Higlighters or ",Object(a.mdx)("inlineCode",{parentName:"p"},"Reference"),"s to include/exclude/filter, and return a new ",Object(a.mdx)("inlineCode",{parentName:"p"},"Highlight")," instance. That is each instance is ",Object(a.mdx)("em",{parentName:"p"},"immutable")," and any modification through its public APIs produces a new instance."),Object(a.mdx)("p",null,Object(a.mdx)("em",{parentName:"p"},"Highlight all Query and Mutation fields while excluding the Query.users field")),Object(a.mdx)("pre",null,Object(a.mdx)("code",Object(n.default)({parentName:"pre"},{className:"language-js"}),"const highlights = hi(graphqlSchema)\n  .include(field(['Query', '*'], ['Mutation', '*']))\n  .exclude(field(['Query', 'users']));\n")),Object(a.mdx)("h2",{id:"references"},"References"),Object(a.mdx)("p",null,"The underlying primitive for Highlight and many of the utilities in graphql-mocks are References. References can define:"),Object(a.mdx)("ul",null,Object(a.mdx)("li",{parentName:"ul"},"GraphQL types by a single string as a ",Object(a.mdx)("a",Object(n.default)({parentName:"li"},{href:"pathname:///api/graphql-mocks/modules/highlight.types.html#TypeReference"}),"Type Reference"),", ",Object(a.mdx)("inlineCode",{parentName:"li"},'"Query"')," for example"),Object(a.mdx)("li",{parentName:"ul"},"GraphQL fields by a tuple ",Object(a.mdx)("a",Object(n.default)({parentName:"li"},{href:"pathname:///api/graphql-mocks/modules/highlight.types.html#FieldReference"}),"Field Reference")," ",Object(a.mdx)("inlineCode",{parentName:"li"},'["Query", "allUsers"]')," of the type name and field name.")),Object(a.mdx)("p",null,"Any functions using the ",Object(a.mdx)("a",Object(n.default)({parentName:"p"},{href:"pathname:///api/graphql-mocks/modules/highlight.types.html#Reference"}),Object(a.mdx)("inlineCode",{parentName:"a"},"Reference"))," type accept either a Type Reference or a Field Reference."),Object(a.mdx)("h2",{id:"pulling-highlighted-references-from-a-highlight-instance"},"Pulling Highlighted References from a ",Object(a.mdx)("inlineCode",{parentName:"h2"},"Highlight")," instance"),Object(a.mdx)("p",null,"A ",Object(a.mdx)("inlineCode",{parentName:"p"},"Highlight")," instance stores the ",Object(a.mdx)("a",Object(n.default)({parentName:"p"},{href:"/docs/highlight/introducing-highlight#references"}),"References")," that have been highlighted. These can be pulled and used for many of the underlying utilities that use ",Object(a.mdx)("inlineCode",{parentName:"p"},"Reference"),"s for arguments."),Object(a.mdx)("pre",null,Object(a.mdx)("code",Object(n.default)({parentName:"pre"},{className:"language-js"}),"const higlights = hi(graphqlSchema).include(field(['Query', '*']));\nconsole.log(highlights);\n")),Object(a.mdx)("p",null,"Would log a list of highlighted references, for example:"),Object(a.mdx)("pre",null,Object(a.mdx)("code",Object(n.default)({parentName:"pre"},{className:"language-js"}),"[\n  ['Query', 'users'],\n  ['Query', 'customers'],\n  ['Query', 'products']\n  // ... including all other highlighted References\n]\n")),Object(a.mdx)("h2",{id:"highlight-middleware-option"},Object(a.mdx)("inlineCode",{parentName:"h2"},"highlight")," Middleware Option"),Object(a.mdx)("p",null,"Much of the highlighting will happen in Resolver Map Middlewares or as arguments for Resolver Map Middlewares, like with ",Object(a.mdx)("a",Object(n.default)({parentName:"p"},{href:"/docs/resolver-map/managing-resolvers#wrap-existing-resolvers-with-resolver-wrappers"}),Object(a.mdx)("inlineCode",{parentName:"a"},"embed")),". It is useful to support a ",Object(a.mdx)("inlineCode",{parentName:"p"},"highlight")," argument that conforms to the ",Object(a.mdx)("a",Object(n.default)({parentName:"p"},{href:"pathname:///api/graphql-mocks/modules/highlight.types.html#CoercibleHighlight"}),Object(a.mdx)("inlineCode",{parentName:"a"},"CoercibleHighlight"))," interface and provides a flexible argument for users of the Middleware. More on this design pattern is covered in Creating Middlewares, but it's usually easiest to supply a callback where the highlight instance is already provided:"),Object(a.mdx)("pre",null,Object(a.mdx)("code",Object(n.default)({parentName:"pre"},{className:"language-js"}),"middleware({\n  highlight: (h) => h.include(field(['Query', '*']))\n});\n")),Object(a.mdx)("p",null,"The ",Object(a.mdx)("inlineCode",{parentName:"p"},"CoercibleHighlight")," type includes raw ",Object(a.mdx)("a",Object(n.default)({parentName:"p"},{href:"/docs/highlight/introducing-highlight#references"}),"References"),"."))}d.isMDXComponent=!0}}]);
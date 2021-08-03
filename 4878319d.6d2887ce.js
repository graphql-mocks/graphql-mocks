(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{65:function(e,n,t){"use strict";t.r(n),t.d(n,"frontMatter",(function(){return o})),t.d(n,"metadata",(function(){return p})),t.d(n,"rightToc",(function(){return c})),t.d(n,"default",(function(){return d}));var a=t(2),r=t(6),i=(t(0),t(91)),l=["components"],o={id:"creating-middlewares",title:"Creating Custom Middlewares"},p={unversionedId:"resolver-map/creating-middlewares",id:"resolver-map/creating-middlewares",isDocsHomePage:!1,title:"Creating Custom Middlewares",description:"Anatomy of a Resolver Map Middleware",source:"@site/docs/resolver-map/creating-middlewares.md",slug:"/resolver-map/creating-middlewares",permalink:"/docs/resolver-map/creating-middlewares",version:"current",sidebar:"docs",previous:{title:"Available Middlewares",permalink:"/docs/resolver-map/available-middlewares"},next:{title:"Introducing Highlight",permalink:"/docs/highlight/introducing-highlight"}},c=[{value:"Anatomy of a Resolver Map Middleware",id:"anatomy-of-a-resolver-map-middleware",children:[]},{value:"Adding options to a Middleware",id:"adding-options-to-a-middleware",children:[{value:"<code>highlight</code> option",id:"highlight-option",children:[]}]},{value:"Handling External Dependencies",id:"handling-external-dependencies",children:[{value:"Shared Dependencies",id:"shared-dependencies",children:[]},{value:"Isolated Dependencies",id:"isolated-dependencies",children:[]}]},{value:"Complete Example",id:"complete-example",children:[]},{value:"Useful Utilities",id:"useful-utilities",children:[{value:"<code>setResolver</code>",id:"setresolver",children:[]},{value:"<code>getResolver</code>",id:"getresolver",children:[]},{value:"<code>applyWrappers</code>",id:"applywrappers",children:[]}]}],s={rightToc:c};function d(e){var n=e.components,t=Object(r.a)(e,l);return Object(i.b)("wrapper",Object(a.a)({},s,t,{components:n,mdxType:"MDXLayout"}),Object(i.b)("h2",{id:"anatomy-of-a-resolver-map-middleware"},"Anatomy of a Resolver Map Middleware"),Object(i.b)("p",null,"Resovler Map Middlewares represent the lazy application of changes to a Resolver Map. A ",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"pathname:///api/graphql-mocks/modules/types.html#ResolverMapMiddleware"}),"Resolver Map Middleware")," receives a Resolver Map, along with some contextual options, and returns a Resolver Map. The Resolver Map returned does not need to be the same one that was passed in but it will represent the Resolver Map going forward."),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-js"}),"async (resolverMap, packOptions) => {\n  // make any modifications and return a resolver map\n  return resolverMap;\n}\n")),Object(i.b)("p",null,"with ",Object(i.b)("inlineCode",{parentName:"p"},"packOptions")," representing:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-javascript"}),"{\n  state: Object\n  dependencies: Object\n}\n")),Object(i.b)("p",null,"Note: Only these properties should be relied on. Do not add additional properties, there is no guarantee they will be preserved."),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("inlineCode",{parentName:"li"},"state")," \u2014 Useful for any storing any references that should be persisted for accessing from the outside, via the ",Object(i.b)("a",Object(a.a)({parentName:"li"},{href:"pathname:///api/graphql-mocks/classes/GraphQLHandler.html#state"}),Object(i.b)("inlineCode",{parentName:"a"},"state")," property")," on a ",Object(i.b)("inlineCode",{parentName:"li"},"GraphQLHandler")," instance."),Object(i.b)("li",{parentName:"ul"},Object(i.b)("inlineCode",{parentName:"li"},"dependencies")," \u2014 Contains any external dependencies initially passed in when creating the ",Object(i.b)("inlineCode",{parentName:"li"},"GraphQLHandler"),".")),Object(i.b)("p",null,"The ",Object(i.b)("inlineCode",{parentName:"p"},"packOptions")," object is also available within Resolver Wrappers."),Object(i.b)("h2",{id:"adding-options-to-a-middleware"},"Adding options to a Middleware"),Object(i.b)("p",null,"The easiest way of adding options to a Resolver Map is to use a function factory that provides any additional options by its arguments which are in scope for the inner Resolver Map Middleware function."),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-js"}),"const middlewareFunction = (options) => {\n  // return a resolver map middleware with options in scope\n  return (resolverMap, packOptions) => {\n    // ... do something with the `options` reference\n    return resolverMap;\n  }\n}\n")),Object(i.b)("p",null,"Then it can be used where needed, for example:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-js"}),"const handler = new GraphQLHandler({\n  resolverMap,\n  middlewares: [middlewareFunction(options)],\n});\n")),Object(i.b)("h3",{id:"highlight-option"},Object(i.b)("inlineCode",{parentName:"h3"},"highlight")," option"),Object(i.b)("p",null,"For many Middlewares it is useful to provide a ",Object(i.b)("inlineCode",{parentName:"p"},"highlight")," option when a Middleware can operate on user-defined portions of the GraphQL Schema. The ",Object(i.b)("inlineCode",{parentName:"p"},"highlight")," option uses the Highlight system and conforms to the ",Object(i.b)("inlineCode",{parentName:"p"},"CoercibleHighlight")," type."),Object(i.b)("p",null,"By using ",Object(i.b)("inlineCode",{parentName:"p"},"CoercibleHighlight")," it provides a flexible option by accepting:"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},"References, an array of ",Object(i.b)("a",Object(a.a)({parentName:"li"},{href:"/docs/highlight/introducing-highlight#references"}),"References")),Object(i.b)("li",{parentName:"ul"},"Highlight callback function ",Object(i.b)("inlineCode",{parentName:"li"},"(h) => { return h.include(['Query', 'user']) }"),", a callback where the highlight instance is setup and expects a returned ",Object(i.b)("inlineCode",{parentName:"li"},"Highlight")," instance."),Object(i.b)("li",{parentName:"ul"},Object(i.b)("inlineCode",{parentName:"li"},"Highlight")," instance, provided directly by the consumers of the middleware")),Object(i.b)("p",null,"These three options can be converted into a ",Object(i.b)("inlineCode",{parentName:"p"},"Highlight")," instance with the ",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"pathname:///api/graphql-mocks/modules/highlight.utils.html#coerceHighlight"}),Object(i.b)("inlineCode",{parentName:"a"},"coerceHighlight")," utility"),"."),Object(i.b)("p",null,'If the default behavior is to "highlight the entire schema" for a the ',Object(i.b)("inlineCode",{parentName:"p"},"highlight")," option the ",Object(i.b)("inlineCode",{parentName:"p"},"highlightAllCallback")," can be used as the default value which will highlight everything in the schema."),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-js"}),"import { coerceHighlight } from 'graphql-mocks/highlight/utils';\n\nconst middleware = ({ highlight }) => {\n  return (resolverMap, packOptions) => {\n    const graphqlSchema = packOptions.dependencies?.graphqlSchema;\n\n    // ensures that a Highlight instance is provided based from\n    // either references, a highlight callback, or a highlight instance\n    const coercedHighlight = coerceHighlight(highlight);\n  }\n};\n")),Object(i.b)("h2",{id:"handling-external-dependencies"},"Handling External Dependencies"),Object(i.b)("p",null,"A dependency in this case is something external to the Resolver Map Middleware that can/must be provided for the Resolver Map Middleware. An example might be a reference to a global object, or an instance of"),Object(i.b)("h3",{id:"shared-dependencies"},"Shared Dependencies"),Object(i.b)("p",null,"If a dependency is considered shared amongst multiple Resolver Map Middlewares or Resolver Wrappers use the ",Object(i.b)("inlineCode",{parentName:"p"},"dependencies")," the external dependencies, ",Object(i.b)("inlineCode",{parentName:"p"},"packOptions.dependencies"),",  provided on the second argument of a Resolver Map Middleware."),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-js"}),"const middleware = return (resolverMap, packOptions) => {\n  // pull `fooDependency` reference off packOptions.dependencies\n  const foo = packOptions.dependencies?.fooDependency\n\n  if (!foo) {\n    throw new Error('`foo` is a required dependency');\n  }\n}\n")),Object(i.b)("h3",{id:"isolated-dependencies"},"Isolated Dependencies"),Object(i.b)("p",null,"When a dependency is used only for a single instance of a middleware it can be provided as an ",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"/docs/resolver-map/creating-middlewares#adding-options-to-a-middleware"}),"option in a factory function"),"."),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-js"}),"const middlewareFunction = ({ someDependency }) => {\n  return (resolverMap, packOptions) => {\n    // ... do something with the `someDependency` reference\n    return resolverMap;\n  }\n}\n")),Object(i.b)("h2",{id:"complete-example"},"Complete Example"),Object(i.b)("p",null,"To show a complete example where a highlight option, with a default ",Object(i.b)("inlineCode",{parentName:"p"},"highlightAllCallback")," option, is used to iterate over the references and add a resolver for the reference."),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-js"}),"import { walk, coerceHighlight } from 'graphql-mocks/highlight/utils';\nimport { setResolver } from 'graphql-mocks/resolver-map';\nimport { highlightAllCallback } from 'graphql-mocks/resolver-map/utils';\n\nconst middleware(options) {\n  // will either be the given highlight option or fallback to highlighting all\n  const highlight = coerceHighlight(options?.highlight ?? highlightAllCallback);\n\n  return async (resolverMap, packOptions) => {\n    const graphqlSchema = packOptions.dependencies?.graphqlSchema;\n\n    // use references from highlight to iterate over all options\n    await walk(graphqlSchema, highlight.references, (reference) => {\n      setResolver(resolverMap, reference, () => 'resolver function!', { replace: true });\n    });\n\n    return resolverMap;\n  }\n}\n")),Object(i.b)("h2",{id:"useful-utilities"},"Useful Utilities"),Object(i.b)("p",null,"When operating on the landscape of a Resolver Map there are some useful utilities to consider using."),Object(i.b)("h3",{id:"setresolver"},Object(i.b)("inlineCode",{parentName:"h3"},"setResolver")),Object(i.b)("p",null,Object(i.b)("inlineCode",{parentName:"p"},"import { setResolver } from 'graphql-mocks/resolver-map';")),Object(i.b)("p",null,Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"pathname:///api/graphql-mocks/modules/resolverMap.html#setResolver"}),"API Documentation")),Object(i.b)("p",null,"Add a Resolver function to a Resolver Map at a given reference."),Object(i.b)("h3",{id:"getresolver"},Object(i.b)("inlineCode",{parentName:"h3"},"getResolver")),Object(i.b)("p",null,Object(i.b)("inlineCode",{parentName:"p"},"import { getResolver } from 'graphql-mocks/resolver-map';")),Object(i.b)("p",null,Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"pathname:///api/graphql-mocks/modules/resolverMap.html#getResolver"}),"API Documentation")),Object(i.b)("p",null,"Get a Resolver function from a Resolver Map for a given reference."),Object(i.b)("h3",{id:"applywrappers"},Object(i.b)("inlineCode",{parentName:"h3"},"applyWrappers")),Object(i.b)("p",null,Object(i.b)("inlineCode",{parentName:"p"},"import { applyWrappers } from 'graphql-mocks/resolver';")),Object(i.b)("p",null,Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"pathname:///api/graphql-mocks/modules/resolver.html#applyWrappers"}),"API Documentation")),Object(i.b)("p",null,"Generally, it's easiest to use ",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"/docs/resolver-map/available-middlewares#embed"}),Object(i.b)("inlineCode",{parentName:"a"},"embed"))," and ",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"/docs/resolver-map/available-middlewares#layer"}),Object(i.b)("inlineCode",{parentName:"a"},"layer"))," Resolver Map Middleware functions to add wrappers. In other cases it might be useful for a custom Resolver Map Middleware to have an array of wrappers passed in as an option and apply them to a Resolver function using ",Object(i.b)("inlineCode",{parentName:"p"},"applyWrappers"),"."))}d.isMDXComponent=!0},91:function(e,n,t){"use strict";t.d(n,"a",(function(){return d})),t.d(n,"b",(function(){return m}));var a=t(0),r=t.n(a);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function l(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?l(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):l(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function p(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var c=r.a.createContext({}),s=function(e){var n=r.a.useContext(c),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},d=function(e){var n=s(e.components);return r.a.createElement(c.Provider,{value:n},e.children)},h={inlineCode:"code",wrapper:function(e){var n=e.children;return r.a.createElement(r.a.Fragment,{},n)}},b=r.a.forwardRef((function(e,n){var t=e.components,a=e.mdxType,i=e.originalType,l=e.parentName,c=p(e,["components","mdxType","originalType","parentName"]),d=s(t),b=a,m=d["".concat(l,".").concat(b)]||d[b]||h[b]||i;return t?r.a.createElement(m,o(o({ref:n},c),{},{components:t})):r.a.createElement(m,o({ref:n},c))}));function m(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var i=t.length,l=new Array(i);l[0]=b;var o={};for(var p in n)hasOwnProperty.call(n,p)&&(o[p]=n[p]);o.originalType=e,o.mdxType="string"==typeof e?e:a,l[1]=o;for(var c=2;c<i;c++)l[c]=t[c];return r.a.createElement.apply(null,l)}return r.a.createElement.apply(null,t)}b.displayName="MDXCreateElement"}}]);
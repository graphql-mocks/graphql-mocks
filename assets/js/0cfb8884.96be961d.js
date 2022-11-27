"use strict";(self.webpackChunk_graphql_mocks_docs=self.webpackChunk_graphql_mocks_docs||[]).push([[3288],{83495:function(e,t,n){n.r(t),n.d(t,{assets:function(){return p},contentTitle:function(){return l},default:function(){return m},frontMatter:function(){return s},metadata:function(){return c},toc:function(){return d}});var r=n(28427),a=n(84397),o=(n(2784),n(30876)),i=["components"],s={id:"managing-context",title:"Managing Resolver Context"},l=void 0,c={unversionedId:"guides/managing-context",id:"guides/managing-context",title:"Managing Resolver Context",description:"Every GraphQL Resolver has a context argument. The graphql-mocks framework manages this context object and provides various entry points to include additional properties on the context object.",source:"@site/docs/guides/managing-context.md",sourceDirName:"guides",slug:"/guides/managing-context",permalink:"/docs/guides/managing-context",draft:!1,tags:[],version:"current",frontMatter:{id:"managing-context",title:"Managing Resolver Context"},sidebar:"docs",previous:{title:"Using Paper with graphql-mocks",permalink:"/docs/guides/paper"},next:{title:"Automatic Resolver Filtering with Wrappers",permalink:"/docs/guides/automatic-filtering"}},p={},d=[{value:"Initial Context",id:"initial-context",level:2},{value:"Query Context",id:"query-context",level:2},{value:"Resolver Wrapper Context",id:"resolver-wrapper-context",level:2},{value:"Framework Managed Context",id:"framework-managed-context",level:2},{value:"Dependencies",id:"dependencies",level:3},{value:"Network Requests and Responses",id:"network-requests-and-responses",level:3}],u={toc:d};function m(e){var t=e.components,n=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Every GraphQL Resolver has a ",(0,o.kt)("a",{parentName:"p",href:"/docs/resolver/using-resolvers#context-parameter-third"},"context argument"),". The ",(0,o.kt)("inlineCode",{parentName:"p"},"graphql-mocks")," framework manages this context object and provides various entry points to include additional properties on the context object."),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("a",{parentName:"li",href:"#initial-context"},"Initital Context")),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("a",{parentName:"li",href:"#query-context"},"Query Context")),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("a",{parentName:"li",href:"#resolver-wrapper-context"},"Resolver Wrapper Context")),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("a",{parentName:"li",href:"#framework-managed-context"},"Framework Managed Context"))),(0,o.kt)("p",null,"All of these contexts are flattened into a single context object available within a Resolver:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"function resolver(parent, args, context, info) {\n  // the context object is available as the third argument in a resolver\n}\n")),(0,o.kt)("h2",{id:"initial-context"},"Initial Context"),(0,o.kt)("p",null,"The optional initial context object is used as the base context, and is passed into the constructor of ",(0,o.kt)("inlineCode",{parentName:"p"},"GraphQLHandler"),":"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"const handler = new GraphQLHandler({\n  initialContext: {\n    /*\n      provides the base for all context objects\n    */\n  }\n});\n")),(0,o.kt)("h2",{id:"query-context"},"Query Context"),(0,o.kt)("p",null,"An additional context object can be included on a per-query basis on the third argument of ",(0,o.kt)("inlineCode",{parentName:"p"},"query")," method of the ",(0,o.kt)("inlineCode",{parentName:"p"},"GraphQLHandler")," instance."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"const additionalContext = {};\nawait handler.query(query, variables, additonalContext);\n")),(0,o.kt)("h2",{id:"resolver-wrapper-context"},"Resolver Wrapper Context"),(0,o.kt)("p",null,'A Resolver Wrapper can return a new "outer" resolver that wraps the initial resolver. The "outer" resolver is a resolver function and therefore has access to the same context argument where it can be modified.'),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"import { createWrapper, WrapperFor } from 'graphql-mocks/resolver';\n\nconst wrapper = createWrapper('my-wrapper', WrapperFor.FIELD, function resolverWrapper(originalResolver, wrapperOptions) {\n  return async function outerResolver(parent, args, context, info) {\n\n    // access to the `context` object here can be modified\n    // and conditionally changed what is passed to the\n    // `originalResolver`\n\n    return await originalResolver(parent, args, context, info);\n  };\n});\n")),(0,o.kt)("p",null,"Learn more with ",(0,o.kt)("a",{parentName:"p",href:"/docs/resolver/introducing-wrappers"},"Introducing Resolver Wrappers")," and ",(0,o.kt)("a",{parentName:"p",href:"/docs/resolver/creating-wrappers"},"Creating Custom Wrappers"),"."),(0,o.kt)("h2",{id:"framework-managed-context"},"Framework Managed Context"),(0,o.kt)("p",null,"The ",(0,o.kt)("inlineCode",{parentName:"p"},"graphql-mocks")," framework manages the context available in Resolvers to include additional helpful references to dependencies and current network requests and responses."),(0,o.kt)("h3",{id:"dependencies"},"Dependencies"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"/docs/handler/introducing-handler#dependencies"},"Dependencies")," added to a ",(0,o.kt)("inlineCode",{parentName:"p"},"GraphQLHandler")," can be accessed within a Resolver Wrapper via the ",(0,o.kt)("a",{parentName:"p",href:"pathname:///api/graphql-mocks/modules/resolver.html#extractDependencies"},(0,o.kt)("inlineCode",{parentName:"a"},"extractDependencies")," function"),"."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"function resolver(parent, args, context, info) {\n  const { paper, anotherDependency } = extractDependencies(context, ['paper', 'anotherDependency']);\n}\n")),(0,o.kt)("h3",{id:"network-requests-and-responses"},"Network Requests and Responses"),(0,o.kt)("p",null,"Most ",(0,o.kt)("a",{parentName:"p",href:"/docs/network/introducing-network-handlers"},"Network Handlers")," will include the request and/or response, and other useful context within the resolver ",(0,o.kt)("inlineCode",{parentName:"p"},"context")," argument. These can be destrutured from the context object and are documented for each network handler."),(0,o.kt)("p",null,"For example the ",(0,o.kt)("a",{parentName:"p",href:"/docs/network/msw#resolver-context"},"Mock Service Worker (",(0,o.kt)("inlineCode",{parentName:"a"},"msw"),") Network Handler")," includes the ",(0,o.kt)("inlineCode",{parentName:"p"},"msw")," property with access to the request and response."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"function resolver(parent, args, context, info) {\n  const { msw } = context;\n  // request and response from the `msw` request handler\n  const { req, res } = msw;\n}\n")))}m.isMDXComponent=!0},30876:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return m}});var r=n(2784);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),c=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=c(e.components);return r.createElement(l.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),u=c(n),m=a,h=u["".concat(l,".").concat(m)]||u[m]||d[m]||o;return n?r.createElement(h,i(i({ref:t},p),{},{components:n})):r.createElement(h,i({ref:t},p))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=u;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:a,i[1]=s;for(var c=2;c<o;c++)i[c]=n[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}u.displayName="MDXCreateElement"}}]);
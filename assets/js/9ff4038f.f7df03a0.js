"use strict";(self.webpackChunk_graphql_mocks_docs=self.webpackChunk_graphql_mocks_docs||[]).push([[2353],{59667:function(e,t,n){n.r(t),n.d(t,{assets:function(){return p},contentTitle:function(){return l},default:function(){return h},frontMatter:function(){return s},metadata:function(){return c},toc:function(){return u}});var r=n(28427),o=n(84397),a=(n(2784),n(30876)),i=["components"],s={id:"introduction",title:"Introduction"},l=void 0,c={unversionedId:"getting-started/introduction",id:"getting-started/introduction",title:"Introduction",description:"GraphQL has proven itself to be a powerful tool in building APIs. A single GraphQL endpoint supports an extremely",source:"@site/docs/getting-started/introduction.md",sourceDirName:"getting-started",slug:"/getting-started/introduction",permalink:"/docs/getting-started/introduction",draft:!1,tags:[],version:"current",frontMatter:{id:"introduction",title:"Introduction"},sidebar:"docs",next:{title:"Installation",permalink:"/docs/getting-started/installation"}},p={},u=[{value:"\ud83d\udd0b Batteries Included",id:"-batteries-included",level:2},{value:"\ud83d\udee0 Tools Included, too",id:"-tools-included-too",level:2},{value:"\u270c\ud83c\udffd\ud83d\udc9c Share Feedback and Questions",id:"-share-feedback-and-questions",level:2}],d={toc:u};function h(e){var t=e.components,n=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"GraphQL has proven itself to be a powerful tool in building APIs. A single GraphQL endpoint supports an extremely\nflexible query language. This has created a challenge in mocking and creating mock APIs. Unlike other libraries,\n",(0,a.kt)("inlineCode",{parentName:"p"},"graphql-mocks")," does not use a single method of configuration or convention to setup mock GraphQL APIs. Instead it\nprovides a set of composable tools and utilities that can be used together to flexibly create a mock GraphQL API."),(0,a.kt)("h2",{id:"-batteries-included"},"\ud83d\udd0b Batteries Included"),(0,a.kt)("p",null,"Testing, mocking or prototyping, use ",(0,a.kt)("inlineCode",{parentName:"p"},"graphql-mocks")," with its GraphQL utilities, ",(0,a.kt)("em",{parentName:"p"},"Resolver Map Middlewares")," and\n",(0,a.kt)("em",{parentName:"p"},"Resolver Wrappers")," to get started. Use the GraphQL Paper for out-of-the-box stateful queries using\nan in-memory store. The ",(0,a.kt)("inlineCode",{parentName:"p"},"spyWrapper")," can be used to wrap Sinon spies around resolvers easily in tests. The\n",(0,a.kt)("inlineCode",{parentName:"p"},"logWrapper")," quickly gives insights into logging Resolver activity. The application of these, and more, can be\nconditionally applied to your GraphQL schema using a query-like technique called ",(0,a.kt)("em",{parentName:"p"},"Highlight"),". The layering of all of\nthese creates a reusable, declarative system for creating mock GraphQL APIs."),(0,a.kt)("h2",{id:"-tools-included-too"},"\ud83d\udee0 Tools Included, too"),(0,a.kt)("p",null,"Managing the GraphQL API surface area of a Resolvers under different mock scenarios can be tricky. That's why this\nlibrary provides common GraphQL utilities, typescript types, and the APIs to easily create Resolver Map Middlewares and\nResolver Wrappers to help organize and speed up development. Together, these allow for the creation of reusable\nabstractions around common scenarios and contexts to organize and mock any GraphQL API. The out-of-the-box Resolver\nWrappers and Resolver Map Middlewares are built on the same underlying APIs. General-purpose abstractions can be shared\nwith the community to help others bootstrap and prototype APIs more quickly."),(0,a.kt)("h2",{id:"-share-feedback-and-questions"},"\u270c\ud83c\udffd\ud83d\udc9c Share Feedback and Questions"),(0,a.kt)("p",null,"There's still lots of possibilities that are under development and being explored. I would love to hear any ideas,\ncomments or feedback."),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://discord.gg/eJxddt2CJS"},"Chat on discord")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/graphql-mocks/graphql-mocks/pulls"},"Create a pull request")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/graphql-mocks/graphql-mocks/issues/new"},"Open an issue")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://www.twitter.com/chadian"},"Ping me on twitter"))))}h.isMDXComponent=!0},30876:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return h}});var r=n(2784);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=r.createContext({}),c=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=c(e.components);return r.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),d=c(n),h=o,m=d["".concat(l,".").concat(h)]||d[h]||u[h]||a;return n?r.createElement(m,i(i({ref:t},p),{},{components:n})):r.createElement(m,i({ref:t},p))}));function h(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,i=new Array(a);i[0]=d;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:o,i[1]=s;for(var c=2;c<a;c++)i[c]=n[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"}}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{67:function(e,r,t){"use strict";t.r(r),t.d(r,"frontMatter",(function(){return p})),t.d(r,"metadata",(function(){return o})),t.d(r,"rightToc",(function(){return i})),t.d(r,"default",(function(){return s}));var n=t(2),a=(t(0),t(91));const p={title:"Creating Custom Wrappers"},o={unversionedId:"resolver/creating-wrappers",id:"resolver/creating-wrappers",isDocsHomePage:!1,title:"Creating Custom Wrappers",description:"As previously shown, a Resolver Wrapper is a function that receives a Resolver and must return a Resolver. This design",source:"@site/docs/resolver/creating-wrappers.md",slug:"/resolver/creating-wrappers",permalink:"/docs/resolver/creating-wrappers",version:"current",sidebar:"docs",previous:{title:"Available Wrappers",permalink:"/docs/resolver/available-wrappers"},next:{title:"Using Resolver Maps",permalink:"/docs/resolver-map/using-resolver-maps"}},i=[{value:"Generic Resolver Wrapper",id:"generic-resolver-wrapper",children:[]},{value:"<code>createWrapper</code>",id:"createwrapper",children:[{value:"Arguments",id:"arguments",children:[]}]}],l={rightToc:i};function s({components:e,...r}){return Object(a.b)("wrapper",Object(n.a)({},l,r,{components:e,mdxType:"MDXLayout"}),Object(a.b)("p",null,"As previously shown, a Resolver Wrapper is a function that receives a Resolver and must return a Resolver. This design\nallows for a returned Resolver function that wraps the original. The original Resolver can be ",Object(a.b)("inlineCode",{parentName:"p"},"await"),"ed for a result,\nthe arguments can be checked, changed, same with the final returned result.\nThe Generic Resolver Wrapper shows the basic"),Object(a.b)("h2",{id:"generic-resolver-wrapper"},"Generic Resolver Wrapper"),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},Object(a.b)("a",Object(n.a)({parentName:"li"},{href:"pathname:///api/graphql-mocks/modules/resolver.types.html#GenericWrapperFunction"}),"API"))),Object(a.b)("pre",null,Object(a.b)("code",Object(n.a)({parentName:"pre"},{className:"language-js"}),"const wrapper = function (originalResolver, wrapperOptions) {\n  return async function (parent, args, context, info) {\n    console.log('Inside the wrapper');\n\n    // Awaiting the result of the original using the parameters\n    // passed in from the wrapped resolver\n    const result = await originalResolver(parent, args, context, info);\n\n    console.log(\"Returning original resolver result\", result);\n    return result;\n  }\n}\n")),Object(a.b)("sup",null,Object(a.b)("strong",null,"Note: While this is a valid Resolver Wrapper Function it is recommended to use the `createWrapper` for most cases")),Object(a.b)("p",null,Object(a.b)("inlineCode",{parentName:"p"},"wrapperOptions")," includes useful contextual details about the Resolver being wrapped. Including ",Object(a.b)("inlineCode",{parentName:"p"},"wrapperOptions.type"),"\nfor the GraphQL type and ",Object(a.b)("inlineCode",{parentName:"p"},"wrapperOptions.field")," if it is wrapping a Field Resolver. Check out the\n",Object(a.b)("a",Object(n.a)({parentName:"p"},{href:"pathname:///api/graphql-mocks/modules/resolver.types.html#BaseWrapperOptions"}),Object(a.b)("inlineCode",{parentName:"a"},"BaseWrapperOptions")," type")," to see the other properties on\n`wrapperOptions."),Object(a.b)("p",null,"As we have seen in the ",Object(a.b)("a",Object(n.a)({parentName:"p"},{href:"/docs/resolver/using-resolvers"}),"Using Resolver")," there are two types of Resolvers: Field\nResolvers and Type Resolvers. Both can be wrapped but it's important to note the arguments to these two Resolver\nfunctions are different. Therefore, there are some Resolver Wrappers that can only be used for Field Resolvers, or Type Resolvers. To make this easier it is recommended to use the ",Object(a.b)("inlineCode",{parentName:"p"},"createWrapper")," helper which provides additional type checks and guards at runtime. Feel free to use the"),Object(a.b)("h2",{id:"createwrapper"},Object(a.b)("inlineCode",{parentName:"h2"},"createWrapper")),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},Object(a.b)("a",Object(n.a)({parentName:"li"},{href:"pathname:///api/graphql-mocks/modules/resolver.html#createWrapper"}),"API"))),Object(a.b)("p",null,"Using ",Object(a.b)("inlineCode",{parentName:"p"},"createWrapper")," helps by providing more context about the wrapper and includes the following benefits:"),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},"The wrapper is named which helps in debugging through multiple wrappers"),Object(a.b)("li",{parentName:"ul"},"The second argument will apply the right types for ",Object(a.b)("inlineCode",{parentName:"li"},"originalResolver")," and ",Object(a.b)("inlineCode",{parentName:"li"},"wrapperOptions")),Object(a.b)("li",{parentName:"ul"},"There are runtime checks to ensure that type specified by second argument match the resolver being wrapped")),Object(a.b)("p",null,"Keeping the same example as before, using ",Object(a.b)("inlineCode",{parentName:"p"},"createWrapper"),"."),Object(a.b)("pre",null,Object(a.b)("code",Object(n.a)({parentName:"pre"},{className:"language-js"}),"import { createWrapper, WrapperFor } from 'graphql-mocks/resolver';\n\nconst wrapper = createWrapper('my-wrapper', WrapperFor.FIELD, function(originalResolver, wrapperOptions) {\n  return (parent, args, context, info) {\n    console.log('Inside the wrapper');\n\n    // Awaiting the result of the original using the parameters\n    // passed in from the wrapped resolver\n    const result = await originalResolver(parent, args, context, info);\n\n    console.log(\"Returning original resolver result\", result);\n    return result;\n  };\n});\n")),Object(a.b)("h3",{id:"arguments"},"Arguments"),Object(a.b)("table",null,Object(a.b)("thead",{parentName:"table"},Object(a.b)("tr",{parentName:"thead"},Object(a.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Argument"),Object(a.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"From the Example"),Object(a.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(a.b)("tbody",{parentName:"table"},Object(a.b)("tr",{parentName:"tbody"},Object(a.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Name"),Object(a.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(a.b)("inlineCode",{parentName:"td"},"my-wrapper")),Object(a.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Provides the name of the wrapper")),Object(a.b)("tr",{parentName:"tbody"},Object(a.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"WrapperFor"),Object(a.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(a.b)("inlineCode",{parentName:"td"},"WrapperFor.FIELD")),Object(a.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(a.b)("inlineCode",{parentName:"td"},"WrapperFor.FIELD"),", ",Object(a.b)("inlineCode",{parentName:"td"},"WrapperFor.TYPE"),", ",Object(a.b)("inlineCode",{parentName:"td"},"WrapperFor.ANY"),". The constant that specifies the type of Resolver the wrapper can apply to. ",Object(a.b)("inlineCode",{parentName:"td"},"WrapperFor.ANY")," can be used if the Wrapper can be used for both Type Resolvers and Field Resolvers.")),Object(a.b)("tr",{parentName:"tbody"},Object(a.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Wrapper Function"),Object(a.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(a.b)("em",{parentName:"td"},"see function in example")),Object(a.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"The Resolver Wrapper function. The ",Object(a.b)("inlineCode",{parentName:"td"},"originalResolver")," and ",Object(a.b)("inlineCode",{parentName:"td"},"wrapperOptions")," will be typed based on the ",Object(a.b)("inlineCode",{parentName:"td"},"WrapperFor")," constant.")))))}s.isMDXComponent=!0},91:function(e,r,t){"use strict";t.d(r,"a",(function(){return b})),t.d(r,"b",(function(){return m}));var n=t(0),a=t.n(n);function p(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function o(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function i(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?o(Object(t),!0).forEach((function(r){p(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function l(e,r){if(null==e)return{};var t,n,a=function(e,r){if(null==e)return{};var t,n,a={},p=Object.keys(e);for(n=0;n<p.length;n++)t=p[n],r.indexOf(t)>=0||(a[t]=e[t]);return a}(e,r);if(Object.getOwnPropertySymbols){var p=Object.getOwnPropertySymbols(e);for(n=0;n<p.length;n++)t=p[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var s=a.a.createContext({}),c=function(e){var r=a.a.useContext(s),t=r;return e&&(t="function"==typeof e?e(r):i(i({},r),e)),t},b=function(e){var r=c(e.components);return a.a.createElement(s.Provider,{value:r},e.children)},u={inlineCode:"code",wrapper:function(e){var r=e.children;return a.a.createElement(a.a.Fragment,{},r)}},d=a.a.forwardRef((function(e,r){var t=e.components,n=e.mdxType,p=e.originalType,o=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),b=c(t),d=n,m=b["".concat(o,".").concat(d)]||b[d]||u[d]||p;return t?a.a.createElement(m,i(i({ref:r},s),{},{components:t})):a.a.createElement(m,i({ref:r},s))}));function m(e,r){var t=arguments,n=r&&r.mdxType;if("string"==typeof e||n){var p=t.length,o=new Array(p);o[0]=d;var i={};for(var l in r)hasOwnProperty.call(r,l)&&(i[l]=r[l]);i.originalType=e,i.mdxType="string"==typeof e?e:n,o[1]=i;for(var s=2;s<p;s++)o[s]=t[s];return a.a.createElement.apply(null,o)}return a.a.createElement.apply(null,t)}d.displayName="MDXCreateElement"}}]);
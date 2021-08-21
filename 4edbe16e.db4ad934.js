(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{104:function(e,t,n){"use strict";n.d(t,"a",(function(){return u})),n.d(t,"b",(function(){return f}));var r=n(0),o=n.n(r);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var p=o.a.createContext({}),l=function(e){var t=o.a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},u=function(e){var t=l(e.components);return o.a.createElement(p.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},b=o.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,a=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),u=l(n),b=r,f=u["".concat(a,".").concat(b)]||u[b]||d[b]||i;return n?o.a.createElement(f,c(c({ref:t},p),{},{components:n})):o.a.createElement(f,c({ref:t},p))}));function f(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,a=new Array(i);a[0]=b;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:r,a[1]=c;for(var p=2;p<i;p++)a[p]=n[p];return o.a.createElement.apply(null,a)}return o.a.createElement.apply(null,n)}b.displayName="MDXCreateElement"},66:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return a})),n.d(t,"metadata",(function(){return c})),n.d(t,"rightToc",(function(){return s})),n.d(t,"default",(function(){return l}));var r=n(2),o=n(6),i=(n(0),n(104)),a={id:"introduction",title:"Introduction"},c={unversionedId:"network/introduction",id:"network/introduction",isDocsHomePage:!1,title:"Introduction",description:"GraphQL is network-agnostic and works across any protocol where a request can be sent, and a response received. In most cases GraphQL uses HTTP but it can also use web sockets. This agnostic flexibility extends to graphql-mocks allowing for portable mocks which can work in node.js, the browser, and can be integrated with different libraries to handle network requests.",source:"@site/docs/network/introduction.md",slug:"/network/introduction",permalink:"/docs/network/introduction",version:"current",sidebar:"docs",previous:{title:"Managing IDs",permalink:"/docs/paper/guides/managing-ids"},next:{title:"Nock",permalink:"/docs/network/nock"}},s=[{value:"Supported Node Options",id:"supported-node-options",children:[{value:"Nock",id:"nock",children:[]}]}],p={rightToc:s};function l(e){var t=e.components,n=Object(o.a)(e,["components"]);return Object(i.b)("wrapper",Object(r.a)({},p,n,{components:t,mdxType:"MDXLayout"}),Object(i.b)("p",null,"GraphQL is network-agnostic and works across any protocol where a request can be sent, and a response received. In most cases GraphQL uses HTTP but it can also use web sockets. This agnostic flexibility extends to ",Object(i.b)("inlineCode",{parentName:"p"},"graphql-mocks")," allowing for portable mocks which can work in node.js, the browser, and can be integrated with different libraries to handle network requests."),Object(i.b)("p",null,"Depending on the situation different network handling will be appropriate for your mocking use-case. To make things easier ",Object(i.b)("inlineCode",{parentName:"p"},"graphql-mocks")," provides different packages to integrate with these different network scenarios, packages with the ",Object(i.b)("inlineCode",{parentName:"p"},"network")," prefix (",Object(i.b)("inlineCode",{parentName:"p"},"@graphql-mocks/network-*"),") are supported integrations."),Object(i.b)("h2",{id:"supported-node-options"},"Supported Node Options"),Object(i.b)("h3",{id:"nock"},"Nock"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"/docs/network/nock"}),"Documentation"))),Object(i.b)("p",null,"Nock is useful for testing and mocking http requests in Node. Using the ",Object(i.b)("inlineCode",{parentName:"p"},"@graphql-mocks/network-nock")," package makes it easy to set up a ",Object(i.b)("inlineCode",{parentName:"p"},"graphql-mocks")," GraphQL handler with Nock."))}l.isMDXComponent=!0}}]);
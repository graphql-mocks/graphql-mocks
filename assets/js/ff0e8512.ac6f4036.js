"use strict";(self.webpackChunk_graphql_mocks_docs=self.webpackChunk_graphql_mocks_docs||[]).push([[466],{24555:function(e,n,t){t.r(n),t.d(n,{assets:function(){return s},contentTitle:function(){return l},default:function(){return g},frontMatter:function(){return a},metadata:function(){return f},toc:function(){return p}});var o=t(28427),i=t(84397),r=(t(2784),t(30876)),c=["components"],a={id:"gqlmocks-config",title:"gqlmocks Config File"},l=void 0,f={unversionedId:"cli/gqlmocks-config",id:"cli/gqlmocks-config",title:"gqlmocks Config File",description:"The gqlmocks can use a configuration file, gqlmocks.config.js, in the root of a project. The paths and options specified by the gqlmocks config file make it easier to run other commands with specified defaults, and will provide the basis for future options.",source:"@site/docs/cli/gqlmocks-config.md",sourceDirName:"cli",slug:"/cli/gqlmocks-config",permalink:"/docs/cli/gqlmocks-config",draft:!1,tags:[],version:"current",frontMatter:{id:"gqlmocks-config",title:"gqlmocks Config File"},sidebar:"docs",previous:{title:"Quick Mocking with Serve",permalink:"/docs/cli/quick-mocking"},next:{title:"Using Paper with graphql-mocks",permalink:"/docs/guides/paper"}},s={},p=[{value:"Creating a gqlmocks config",id:"creating-a-gqlmocks-config",level:2},{value:"Config Info and Validation",id:"config-info-and-validation",level:2}],u={toc:p};function g(e){var n=e.components,t=(0,i.Z)(e,c);return(0,r.kt)("wrapper",(0,o.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"The gqlmocks can use a configuration file, ",(0,r.kt)("inlineCode",{parentName:"p"},"gqlmocks.config.js"),", in the root of a project. The paths and options specified by the gqlmocks config file make it easier to run other commands with specified defaults, and will provide the basis for future options."),(0,r.kt)("h2",{id:"creating-a-gqlmocks-config"},"Creating a gqlmocks config"),(0,r.kt)("p",null,"Running the ",(0,r.kt)("inlineCode",{parentName:"p"},"npx gqlmocks config generate")," command will interactively step through creating a config file, alternatively the options for generating the config can be specified by its flags, too."),(0,r.kt)("h2",{id:"config-info-and-validation"},"Config Info and Validation"),(0,r.kt)("p",null,"Use ",(0,r.kt)("inlineCode",{parentName:"p"},"npx gqlmocks config info")," to double-check that a config file is parsed and reflecting the expected information. Use ",(0,r.kt)("inlineCode",{parentName:"p"},"npx gqlmocks config validate")," to enforce that the config file is considered parsable and valid."))}g.isMDXComponent=!0},30876:function(e,n,t){t.d(n,{Zo:function(){return s},kt:function(){return g}});var o=t(2784);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function r(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);n&&(o=o.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,o)}return t}function c(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?r(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):r(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function a(e,n){if(null==e)return{};var t,o,i=function(e,n){if(null==e)return{};var t,o,i={},r=Object.keys(e);for(o=0;o<r.length;o++)t=r[o],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(o=0;o<r.length;o++)t=r[o],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var l=o.createContext({}),f=function(e){var n=o.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):c(c({},n),e)),t},s=function(e){var n=f(e.components);return o.createElement(l.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return o.createElement(o.Fragment,{},n)}},u=o.forwardRef((function(e,n){var t=e.components,i=e.mdxType,r=e.originalType,l=e.parentName,s=a(e,["components","mdxType","originalType","parentName"]),u=f(t),g=i,d=u["".concat(l,".").concat(g)]||u[g]||p[g]||r;return t?o.createElement(d,c(c({ref:n},s),{},{components:t})):o.createElement(d,c({ref:n},s))}));function g(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var r=t.length,c=new Array(r);c[0]=u;var a={};for(var l in n)hasOwnProperty.call(n,l)&&(a[l]=n[l]);a.originalType=e,a.mdxType="string"==typeof e?e:i,c[1]=a;for(var f=2;f<r;f++)c[f]=t[f];return o.createElement.apply(null,c)}return o.createElement.apply(null,t)}u.displayName="MDXCreateElement"}}]);
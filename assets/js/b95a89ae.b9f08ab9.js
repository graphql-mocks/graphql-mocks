"use strict";(self.webpackChunk_graphql_mocks_docs=self.webpackChunk_graphql_mocks_docs||[]).push([[445],{14178:function(e,t,n){n.r(t),n.d(t,{assets:function(){return p},contentTitle:function(){return l},default:function(){return m},frontMatter:function(){return s},metadata:function(){return c},toc:function(){return u}});var a=n(28427),r=n(84397),o=(n(2784),n(30876)),i=["components"],s={id:"technical-notes",title:"Technical Notes"},l=void 0,c={unversionedId:"paper/technical-notes",id:"paper/technical-notes",title:"Technical Notes",description:"Storage & Immutability",source:"@site/docs/paper/technical-notes.md",sourceDirName:"paper",slug:"/paper/technical-notes",permalink:"/docs/paper/technical-notes",draft:!1,tags:[],version:"current",frontMatter:{id:"technical-notes",title:"Technical Notes"},sidebar:"docs",previous:{title:"Validations",permalink:"/docs/paper/validations"},next:{title:"Generating Data with Factories",permalink:"/docs/paper/guides/factories"}},p={},u=[{value:"Storage &amp; Immutability",id:"storage--immutability",level:2},{value:"Documents",id:"documents",level:2},{value:"Document Key",id:"document-key",level:3},{value:"Connections",id:"connections",level:3},{value:"GraphQL Type Name",id:"graphql-type-name",level:3},{value:"Transaction Lifecycle",id:"transaction-lifecycle",level:2},{value:"Connection Lookup, Expansion and Collapsing",id:"connection-lookup-expansion-and-collapsing",level:2},{value:"<code>nullDocument</code>",id:"nulldocument",level:2},{value:"Performance",id:"performance",level:2}],d={toc:u};function m(e){var t=e.components,n=(0,r.Z)(e,i);return(0,o.kt)("wrapper",(0,a.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h2",{id:"storage--immutability"},"Storage & Immutability"),(0,o.kt)("p",null,"GraphQL Paper uses ",(0,o.kt)("inlineCode",{parentName:"p"},"immer")," under the hood to be able to handle changes and optimize sharing references for unchanged portions in an object tree. ",(0,o.kt)("inlineCode",{parentName:"p"},"Document"),"s and ",(0,o.kt)("inlineCode",{parentName:"p"},"DocumentStore"),"s are considered stale-on-arrival which means they should not be directly edited. There are safeguards in place that try and prevent editing a document or store outside of a ",(0,o.kt)("em",{parentName:"p"},"Mutate Transaction"),". This immutability also allows versioning the ",(0,o.kt)("inlineCode",{parentName:"p"},"DocumentStore")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"Document"),"s. Comparing different versions of documents is also possible based on their Document Keys."),(0,o.kt)("h2",{id:"documents"},"Documents"),(0,o.kt)("p",null,"Documents have a few hidden symboled properties that assist with tracking some internal state:"),(0,o.kt)("h3",{id:"document-key"},"Document Key"),(0,o.kt)("p",null,"Document Keys are uniquely generated string at the time a document is created. It is an internal identifier or reference used by the library to be able to track and reference a document across versions. This leaves any ",(0,o.kt)("inlineCode",{parentName:"p"},"ID"),' fields on a GraphQL type as data in "user land" although GraphQL Paper does provide a validator to check that ',(0,o.kt)("inlineCode",{parentName:"p"},"ID"),"s on fields are unique within a type."),(0,o.kt)("h3",{id:"connections"},"Connections"),(0,o.kt)("p",null,"Connections for a document are stored as an array of document keys (strings) representing the documents they are connected to."),(0,o.kt)("h3",{id:"graphql-type-name"},"GraphQL Type Name"),(0,o.kt)("p",null,'Documents are "typed" by a GraphQL type. The type is registered when a document is created and should never change.'),(0,o.kt)("h2",{id:"transaction-lifecycle"},"Transaction Lifecycle"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"Call ",(0,o.kt)("inlineCode",{parentName:"li"},"mutate")," with a ",(0,o.kt)("em",{parentName:"li"},"Mutate Transaction")," callback"),(0,o.kt)("li",{parentName:"ol"},"Any previous transactions are waited to finish, in order, before the provided the transaction can run"),(0,o.kt)("li",{parentName:"ol"},"Expand connections so that properties references the appropriate connected documents"),(0,o.kt)("li",{parentName:"ol"},"Run ",(0,o.kt)("inlineCode",{parentName:"li"},"beforeTransaction")," hooks"),(0,o.kt)("li",{parentName:"ol"},"Call the transaction callback using ",(0,o.kt)("inlineCode",{parentName:"li"},"immer")),(0,o.kt)("li",{parentName:"ol"},"Run ",(0,o.kt)("inlineCode",{parentName:"li"},"afterTransaction")," hooks"),(0,o.kt)("li",{parentName:"ol"},"Capture any returned documents as represented by their keys"),(0,o.kt)("li",{parentName:"ol"},"Collapse connections so that references are stashed by their document key"),(0,o.kt)("li",{parentName:"ol"},"Run validations on new version created by ",(0,o.kt)("inlineCode",{parentName:"li"},"immer")),(0,o.kt)("li",{parentName:"ol"},"Determine which events can be created by comparing new and old versions of the store"),(0,o.kt)("li",{parentName:"ol"},"Dispatch store events and custom events"),(0,o.kt)("li",{parentName:"ol"},"Set new version as the current"),(0,o.kt)("li",{parentName:"ol"},"Push the new version on to the history"),(0,o.kt)("li",{parentName:"ol"},"Return transaction captured keys as frozen Documents for the ",(0,o.kt)("inlineCode",{parentName:"li"},"mutate")," call")),(0,o.kt)("h2",{id:"connection-lookup-expansion-and-collapsing"},"Connection Lookup, Expansion and Collapsing"),(0,o.kt)("p",null,"When accessing Documents outside of a ",(0,o.kt)("em",{parentName:"p"},"Mutate Transaction")," the documents are wrapped in a proxy to assist with lookups of connections and to prevent document properties from being mutated outside a ",(0,o.kt)("em",{parentName:"p"},"Mutate Transaction"),". The proxy also has a reference to the copy of the store when the document is retrieved ensuring that any connections looked up will also be ",(0,o.kt)("em",{parentName:"p"},"frozen")," at the same point in time."),(0,o.kt)("p",null,"Before a transaction can occur each document has its connections expanded from document properties by the array of document keys to references to the other documents. If the field supports a GraphQL List type then the documents are represented as an array of Documents."),(0,o.kt)("p",null,"After a transaction any document properties that have references are collapsed into an internal array for connections, being stored as document keys."),(0,o.kt)("h2",{id:"nulldocument"},(0,o.kt)("inlineCode",{parentName:"h2"},"nullDocument")),(0,o.kt)("p",null,"Since GraphQL has a concept of nullable lists, that is lists that contain null, and connections are represented by documents there is a special reserved ",(0,o.kt)("inlineCode",{parentName:"p"},"nullDocument")," used in storing lists that contain null. This is a special case and not something that normally crops up during average usage and is kept relatively hidden in the library but would be important to consider when writing a custom validator that needs to check connections. During expansion of connections ",(0,o.kt)("inlineCode",{parentName:"p"},"nullDocuments")," in lists are represented by ",(0,o.kt)("inlineCode",{parentName:"p"},"null")," values and when collapsed the proxy ensures that any lists containing ",(0,o.kt)("inlineCode",{parentName:"p"},"nullDocuments")," are represented by ",(0,o.kt)("inlineCode",{parentName:"p"},"null")," also."),(0,o.kt)("h2",{id:"performance"},"Performance"),(0,o.kt)("p",null,'Because GraphQL Paper handles everything "in memory" as javascript data structures it should be relatively quick for most use cases. If there is a case where it is slow please open an issue on github. There are some low-hanging fruit but also a desire to avoid early over optimizations.'))}m.isMDXComponent=!0},30876:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return m}});var a=n(2784);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=a.createContext({}),c=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=c(e.components);return a.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),d=c(n),m=r,h=d["".concat(l,".").concat(m)]||d[m]||u[m]||o;return n?a.createElement(h,i(i({ref:t},p),{},{components:n})):a.createElement(h,i({ref:t},p))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=d;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:r,i[1]=s;for(var c=2;c<o;c++)i[c]=n[c];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"}}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[210],{1294:function(e,n){e.exports=function(e){const n="bool byte i16 i32 i64 double string binary";return{name:"Thrift",keywords:{keyword:"namespace const typedef struct enum service exception void oneway set list map required optional",built_in:n,literal:"true false"},contains:[e.QUOTE_STRING_MODE,e.NUMBER_MODE,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,{className:"class",beginKeywords:"struct enum service exception",end:/\{/,illegal:/\n/,contains:[e.inherit(e.TITLE_MODE,{starts:{endsWithParent:!0,excludeEnd:!0}})]},{begin:"\\b(set|list|map)\\s*<",end:">",keywords:n,contains:["self"]}]}}}}]);
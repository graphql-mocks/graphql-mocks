(self.webpackChunk_graphql_mocks_docs=self.webpackChunk_graphql_mocks_docs||[]).push([[3494],{64855:function(e){function s(...e){return e.map((e=>{return(s=e)?"string"==typeof s?s:s.source:null;var s})).join("")}e.exports=function(e){const a={ruleDeclaration:/^[a-zA-Z][a-zA-Z0-9-]*/,unexpectedChars:/[!@#$^&',?+~`|:]/},n=e.COMMENT(/;/,/$/),c={className:"attribute",begin:s(a.ruleDeclaration,/(?=\s*=)/)};return{name:"Augmented Backus-Naur Form",illegal:a.unexpectedChars,keywords:["ALPHA","BIT","CHAR","CR","CRLF","CTL","DIGIT","DQUOTE","HEXDIG","HTAB","LF","LWSP","OCTET","SP","VCHAR","WSP"].join(" "),contains:[c,n,{className:"symbol",begin:/%b[0-1]+(-[0-1]+|(\.[0-1]+)+){0,1}/},{className:"symbol",begin:/%d[0-9]+(-[0-9]+|(\.[0-9]+)+){0,1}/},{className:"symbol",begin:/%x[0-9A-F]+(-[0-9A-F]+|(\.[0-9A-F]+)+){0,1}/},{className:"symbol",begin:/%[si]/},e.QUOTE_STRING_MODE,e.NUMBER_MODE]}}}}]);
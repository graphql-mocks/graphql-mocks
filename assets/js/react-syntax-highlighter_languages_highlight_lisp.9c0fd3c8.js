(self.webpackChunk_graphql_mocks_docs=self.webpackChunk_graphql_mocks_docs||[]).push([[7287],{32807:function(e){e.exports=function(e){var n="[a-zA-Z_\\-+\\*\\/<=>&#][a-zA-Z0-9_\\-+*\\/<=>&#!]*",a="\\|[^]*?\\|",i="(-|\\+)?\\d+(\\.\\d+|\\/\\d+)?((d|e|f|l|s|D|E|F|L|S)(\\+|-)?\\d+)?",s={className:"literal",begin:"\\b(t{1}|nil)\\b"},l={className:"number",variants:[{begin:i,relevance:0},{begin:"#(b|B)[0-1]+(/[0-1]+)?"},{begin:"#(o|O)[0-7]+(/[0-7]+)?"},{begin:"#(x|X)[0-9a-fA-F]+(/[0-9a-fA-F]+)?"},{begin:"#(c|C)\\("+i+" +"+i,end:"\\)"}]},b=e.inherit(e.QUOTE_STRING_MODE,{illegal:null}),c=e.COMMENT(";","$",{relevance:0}),g={begin:"\\*",end:"\\*"},r={className:"symbol",begin:"[:&]"+n},t={begin:n,relevance:0},o={begin:a},d={contains:[l,b,g,r,{begin:"\\(",end:"\\)",contains:["self",s,b,l,t]},t],variants:[{begin:"['`]\\(",end:"\\)"},{begin:"\\(quote ",end:"\\)",keywords:{name:"quote"}},{begin:"'"+a}]},m={variants:[{begin:"'"+n},{begin:"#'"+n+"(::"+n+")*"}]},u={begin:"\\(\\s*",end:"\\)"},v={endsWithParent:!0,relevance:0};return u.contains=[{className:"name",variants:[{begin:n,relevance:0},{begin:a}]},v],v.contains=[d,m,u,s,l,b,c,g,r,o,t],{name:"Lisp",illegal:/\S/,contains:[l,e.SHEBANG(),s,b,c,d,m,u,t]}}}}]);
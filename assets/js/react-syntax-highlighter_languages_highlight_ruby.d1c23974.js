(self.webpackChunk_graphql_mocks_docs=self.webpackChunk_graphql_mocks_docs||[]).push([[6943],{79535:function(e){function n(...e){return e.map((e=>{return(n=e)?"string"==typeof n?n:n.source:null;var n})).join("")}e.exports=function(e){var a,s="([a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?)",i={keyword:"and then defined module in return redo if BEGIN retry end for self when next until do begin unless END rescue else break undef not super class case require yield alias while ensure elsif or include attr_reader attr_writer attr_accessor __FILE__",built_in:"proc lambda",literal:"true false nil"},r={className:"doctag",begin:"@[A-Za-z]+"},b={begin:"#<",end:">"},c=[e.COMMENT("#","$",{contains:[r]}),e.COMMENT("^=begin","^=end",{contains:[r],relevance:10}),e.COMMENT("^__END__","\\n$")],t={className:"subst",begin:/#\{/,end:/\}/,keywords:i},d={className:"string",contains:[e.BACKSLASH_ESCAPE,t],variants:[{begin:/'/,end:/'/},{begin:/"/,end:/"/},{begin:/`/,end:/`/},{begin:/%[qQwWx]?\(/,end:/\)/},{begin:/%[qQwWx]?\[/,end:/\]/},{begin:/%[qQwWx]?\{/,end:/\}/},{begin:/%[qQwWx]?</,end:/>/},{begin:/%[qQwWx]?\//,end:/\//},{begin:/%[qQwWx]?%/,end:/%/},{begin:/%[qQwWx]?-/,end:/-/},{begin:/%[qQwWx]?\|/,end:/\|/},{begin:/\B\?(\\\d{1,3}|\\x[A-Fa-f0-9]{1,2}|\\u[A-Fa-f0-9]{4}|\\?\S)\b/},{begin:/<<[-~]?'?(\w+)\n(?:[^\n]*\n)*?\s*\1\b/,returnBegin:!0,contains:[{begin:/<<[-~]?'?/},e.END_SAME_AS_BEGIN({begin:/(\w+)/,end:/(\w+)/,contains:[e.BACKSLASH_ESCAPE,t]})]}]},l="[0-9](_?[0-9])*",g={className:"number",relevance:0,variants:[{begin:`\\b([1-9](_?[0-9])*|0)(\\.(${l}))?([eE][+-]?(${l})|r)?i?\\b`},{begin:"\\b0[dD][0-9](_?[0-9])*r?i?\\b"},{begin:"\\b0[bB][0-1](_?[0-1])*r?i?\\b"},{begin:"\\b0[oO][0-7](_?[0-7])*r?i?\\b"},{begin:"\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*r?i?\\b"},{begin:"\\b0(_?[0-7])+r?i?\\b"}]},o={className:"params",begin:"\\(",end:"\\)",endsParent:!0,keywords:i},_=[d,{className:"class",beginKeywords:"class module",end:"$|;",illegal:/=/,contains:[e.inherit(e.TITLE_MODE,{begin:"[A-Za-z_]\\w*(::\\w+)*(\\?|!)?"}),{begin:"<\\s*",contains:[{begin:"("+e.IDENT_RE+"::)?"+e.IDENT_RE}]}].concat(c)},{className:"function",begin:n(/def\s*/,(a=s+"\\s*(\\(|;|$)",n("(?=",a,")"))),keywords:"def",end:"$|;",contains:[e.inherit(e.TITLE_MODE,{begin:s}),o].concat(c)},{begin:e.IDENT_RE+"::"},{className:"symbol",begin:e.UNDERSCORE_IDENT_RE+"(!|\\?)?:",relevance:0},{className:"symbol",begin:":(?!\\s)",contains:[d,{begin:s}],relevance:0},g,{className:"variable",begin:"(\\$\\W)|((\\$|@@?)(\\w+))(?=[^@$?])(?![A-Za-z])(?![@$?'])"},{className:"params",begin:/\|/,end:/\|/,relevance:0,keywords:i},{begin:"("+e.RE_STARTERS_RE+"|unless)\\s*",keywords:"unless",contains:[{className:"regexp",contains:[e.BACKSLASH_ESCAPE,t],illegal:/\n/,variants:[{begin:"/",end:"/[a-z]*"},{begin:/%r\{/,end:/\}[a-z]*/},{begin:"%r\\(",end:"\\)[a-z]*"},{begin:"%r!",end:"![a-z]*"},{begin:"%r\\[",end:"\\][a-z]*"}]}].concat(b,c),relevance:0}].concat(b,c);t.contains=_,o.contains=_;var E=[{begin:/^\s*=>/,starts:{end:"$",contains:_}},{className:"meta",begin:"^([>?]>|[\\w#]+\\(\\w+\\):\\d+:\\d+>|(\\w+-)?\\d+\\.\\d+\\.\\d+(p\\d+)?[^\\d][^>]+>)(?=[ ])",starts:{end:"$",contains:_}}];return c.unshift(b),{name:"Ruby",aliases:["rb","gemspec","podspec","thor","irb"],keywords:i,illegal:/\/\*/,contains:[e.SHEBANG({binary:"ruby"})].concat(E).concat(c).concat(_)}}}}]);
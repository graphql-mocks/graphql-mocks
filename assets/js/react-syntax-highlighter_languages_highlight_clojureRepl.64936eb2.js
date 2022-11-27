exports.id = 3610;
exports.ids = [3610];
exports.modules = {

/***/ 52314:
/***/ ((module) => {

/*
Language: Clojure REPL
Description: Clojure REPL sessions
Author: Ivan Sagalaev <maniac@softwaremaniacs.org>
Requires: clojure.js
Website: https://clojure.org
Category: lisp
*/

/** @type LanguageFn */
function clojureRepl(hljs) {
  return {
    name: 'Clojure REPL',
    contains: [{
      className: 'meta',
      begin: /^([\w.-]+|\s*#_)?=>/,
      starts: {
        end: /$/,
        subLanguage: 'clojure'
      }
    }]
  };
}

module.exports = clojureRepl;


/***/ })

};
;
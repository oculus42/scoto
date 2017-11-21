/**
 * Scototype
 * Nestable, Testable, Isolable Scopes using Prototype chains
 * @type {{isolate: scoto.isolate, rebase: scoto.rebase, child: scoto.child, parent: scoto.parent, walk: scoto.walk, bind: scoto.bind, flatten: scoto.flatten}}
 */
const scoto = (function(){

    /**
     * Provide an array of the successive parent scopes.
     * Useful for identifying shadowed variables
     * or scope nesting depth.
     * @param {Object} scope
     * @returns {Array}
     */
    const walk = function (scope) {
        const scopes = [];
        let currentScope = scope;

        while (currentScope) {
            scopes.push(currentScope);
            currentScope = Object.getPrototypeOf(currentScope);
        }

        return scopes;
    };

    return {

        /**
         * Return this scope without any parents.
         * @param {Object} scope
         * @returns {Object}
         */
        isolate: function (scope) {
            return Object.assign(Object.create(null), scope);
        },

        /**
         * Create a version of the this scope with a different prototype.
         * @param {Object} scope
         * @param {Object} newBase
         * @returns {Object}
         */
        rebase: function (scope, newBase) {
            return Object.assign(Object.create(newBase), scope);
        },

        /**
         * Create a new scope child from the passed scope.
         * @param {Object} scope
         * @returns {Object}
         */
        child: function (scope) {
            return Object.create(scope);
        },

        /**
         * Obtain the parent of the current scope.
         * @param {Object} scope
         * @returns {Object}
         */
        parent: function (scope) {
            return Object.getPrototypeOf(scope);
        },

        /**
         * Provide an array of the successive parent scopes.
         * Useful for identifying shadowed variables
         * or scope nesting depth.
         * @param {Object} scope
         * @returns {Array}
         */
        walk: walk,

        /**
         * Bind a function so the context is a scototype.
         * Defaults to a new child, but can be overridden with noNest
         * @param {function} fn
         * @param {Object} scope
         * @param {boolean} noNest
         * @returns {function}
         */
        bind: function (fn, scope, noNest) {
            return fn.bind(noNest ? scope : Object.create(scope));
        },

        /**
         * Accumulate the values of the scototype chain in a single object.
         * @param {Object} scope
         * @returns {Object}
         */
        flatten: function(scope) {
            return Object.assign(Object.create(null), ...walk(scope).reverse());
        }
    }
}());
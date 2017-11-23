/**
 * Scototype
 * Nestable, Testable, Isolable Scopes using Prototype chains
 */
class Scoto {

    /**
     * Provide an array of the successive parent scopes.
     * Useful for identifying shadowed variables,
     * scope nesting depth, or flattening the scope.
     * @param {Object} scope
     * @returns {Array}
     */
    static walk(scope) {
        const scopes = [];
        let currentScope = scope;

        while (currentScope) {
            scopes.push(currentScope);
            currentScope = Object.getPrototypeOf(currentScope);
        }

        return scopes;
    }

    /**
      * Create a plain object for a base.
      * @returns {Object}
      */
    static new() { return Object.create(null) }

    /**
      * Create a new scope child from the passed scope.
      * @param {Object} scope
      * @returns {Object}
      */
    static child(scope) { return Object.create(scope) }

    /**
      * Return this scope without any parents.
      * @param {Object} scope
      * @returns {Object}
      */
    static isolate(scope) { return Object.assign(Object.create(null), scope) }

    /**
      * Create a version of the this scope with a different prototype.
      * @param {Object} scope
      * @param {Object} newBase
      * @returns {Object}
      */ 
    static rebase(scope, newBase) { return Object.assign(Object.create(newBase), scope) }

     /**
       * Obtain the parent of the current scope.
       * @param scope
       * @returns {Object|null}
       */
     static parent(scope) { return Object.getPrototypeOf(scope) }

     /**
       * Bind a function so the context is a scototype.
       * Defaults to a new child, but can be overridden with noNest
       * @param {Function} fn
       * @param {Object} scope
       * @param {boolean} noNest
       * @returns {Function}
       */
      static bind(fn, scope, noNest) { return fn.bind(noNest ? scope : Object.create(scope)) }

     /**
       * Accumulate the values of the scototype chain in a single object.
       * @param {Object} scope
       * @returns {Object}
       */
      static flatten(scope) { return Object.assign(Object.create(null), ...this.walk(scope).reverse()) }
}

module.exports = Scoto;

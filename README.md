# Scototypes (Scoto)
## Nestable, Testable, Isolable Scopes using Prototype chains

[![NPM](https://nodei.co/npm/scoto.png?compact=true)](https://npmjs.org/package/scoto)

Since ECMAscript 3, scopes are a foundational element of JavaScript.
Concepts like *closures* depend on the automatic creation of severally-nested scopes.
Scopes are not without complications. They all chain up to the `root` object.
They shadow variables. They can't be shared directly.

For most purposes, though, scopes are quite like *prototypes*. 

### Enter *Scototypes*

Scototypes provide the nesting and hierarchy of scopes using JavaScript prototypes.
You can walk the hierarchy of a scototype, isolate the current, 
attach it to a different chain, or even flatten the hierarchy into a new object.

Scototypes can mimic regular scopes by starting with your root object:

```javascript
const myScope = Scoto.child(window);
const nestedScope = Scoto.child(myScope);

nestedScope.console.log('This works!');
```

Or you can make isolated scopes:

```javascript
const myIsolatedScope = Scoto.new(null);
const nestedScope = Scoto.child(myIsolatedScope);

// console is undefined.
nestedScope.console.log('This will error.'); 
```

Scototypes use a few simple prototype methods to support nesting scope or data inheritance. 
Forty lines of code and comments cover most of the examples:
```javascript
// isolate ensures no inherited prototype.
const defaults = Scoto.isolate({
  players: 1,
  gameTime: 60000, // one minute
  maxEnemies: 5
});

// rebase puts keys into a new object with a prototype chain
const appSettings = Scoto.rebase(getAppSettings(), defaults);

const userSettings = {
  gameTime: 45000,
  maxEnemies: 8
};

// rebase again to keep building the hierarchy
const currentSettings = Scoto.rebase(userSettings, appSettings);

// flatten merges the properties into a single object.
// Useful for exporting or saving.
const exportState = Scoto.flatten(currentSettings);

// child continues to build on a hierarchy.
const gameState = Scoto.child(currentSettings);

// Now we can assign additional keys to our state
gameState.enemies = [];
gameState.direction = 0;
gameState.started = true;

if (shouldStartDangerMode()) {
  // We don't need to track previous state for the scototype.
  // We just shadow the "older" values. 
  gameState.maxEnemies = 12;
}

if (shouldEndDangerMode()) {
  // Deleting variables eliminates shadowing.
  delete gameState.maxEnemies;
}
```

All methods in `Scoto` are non-mutating.

### Scototype Context

Since scototypes provide nested scopes, we can optionally bind them as *contexts*.

```javascript
function submitNewScore(score) {
  // Clear variable name for nesting.
  const scoto = this;

  if (undefined === scoto.scores) {
    getScores.call(scoto)
      .then(function(scores) {
        // Push scores onto the current scoto
        scoto.scores = scores;
        // Call this function again with the current scoto
        submitNewScore.call(scoto, score);
      }.bind(scoto));
    return;
  }

  http.post(`${scoto.baseURL}/score`, {score})
  .then(receiveScoreResponse.bind(scoto), handleError.bind(scoto));

}

function receiveAddScoreResponse(data) {
  const scoto = this;
  scoto.scores = data.scores;
  scoto.lastGameRank = data.gameRank;

  updateSplashScreen.call(scoto);
}

```

Because scototypes are standard objects, you can bind them as a context with the native 
`Function.prototype.bind` and with convenience tools like [Lo-dash _.bindAll](https://lodash.com/docs#bindAll).

`Scoto` includes `bind` and `binder` as well. These provide the ability to create a new 
nested context instead of binding the current `Scoto`. `binder` provides a sort of 
*partial application* to allow easy reuse of a particular bind behavior.

```javascript
function getMethodsWithContext(context, nest) {
  return myMethods.map(Scoto.binder(context, nest));
}
```

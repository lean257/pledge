'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js ES6-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

function $Promise(executor){
    if (typeof executor !== 'function'){
        throw new TypeError ('executor is not a function')
    };
    this._handlerGroups= [];
    this._state = 'pending';
    this._internalResolve = function(data){
        if (this._state == 'pending'){
            this._state = 'fulfilled'
            this._value = data;
        };
        if (!this._handlerGroups.length) return;
        else this._callHandlers();
    };
    this._internalReject = function(reason){
        if (this._state == 'pending'){
            this._state = 'rejected'
            this._value = reason;
        }
    };
    executor(this._internalResolve.bind(this), this._internalReject.bind(this))

}

$Promise.prototype._callHandlers = function() {
  // console.log(this._handlerGroups);
  if (this._state == 'fulfilled') {
    while (this._handlerGroups.length) {
      if (typeof this._handlerGroups[0].successCb !== 'function') return;
      this._handlerGroups[0].successCb(this._value)
      this._handlerGroups.shift()
    }
  }
}
//constructor function
$Promise.prototype.then = function(successCb, errorCb){
  if (typeof successCb !== 'function') successCb = null;
  if (typeof errorCb !== 'function') errorCb = null;
  this._handlerGroups.push({'successCb': successCb, 'errorCb': errorCb})
  // console.log('state in then', this._state)
  if (this._state == 'pending') return;

  this._callHandlers();
}





/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = $Promise;

So in a Node-based project we could write things like this:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/

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


    executor(this._internalResolve.bind(this), this._internalReject.bind(this))

}
$Promise.prototype._internalResolve = function(data){
  if (this._state == 'pending'){
      this._state = 'fulfilled'
      this._value = data;
  };
  if (!this._handlerGroups.length) return;
  else if (this._handlerGroups[0].downstreamPromise) {
    this._handlerGroups[0].downstreamPromise._internalResolve(this._value)
  }
  this._callHandlers();
};

$Promise.prototype._internalReject = function(reason){
  if (this._state == 'pending'){
    this._state = 'rejected'
    this._value = reason;
  }
  if (!this._handlerGroups.length) return;
  else if (this._handlerGroups[0].downstreamPromise) {
    this._handlerGroups[0].downstreamPromise._internalReject(this._value)
  }
  this._callHandlers();
};

$Promise.prototype._callHandlers = function() {
  // if (this.state === 'pending') return;
  // this._handlerGroups.forEach(handler => {
  //   let cb = handler[this._state === 'fulfilled' ? 'successCb' : 'errorCb'];
  //   if(cb) {
  //     try{
  //       let value = cb(this._value);
  //       if (value instanceof $Promise) {
  //         value.then(
  //           handler.downstreamPromise._internalResolve.bind(handler.downstreamPromise)
  //           handler.downstreamPromise._internalReject.bind(handler.downstreamPromise)
  //         )
  //       } else {
  //         handler.downstreamPromise._internalResolve(value);
  //       }
  //     }
  //     catch(err){
  //       handler.downstreamPromise._internalReject(err);
  //     }
  //   } else {
  //     if(this._state === 'fulfilled') {
  //       handler.downstreamPromise._internalResolve(this._value)
  //     } else {
  //       handler.downstreamPromise._internalReject(this._value)
  //     }
  //   }
  // }, this);
  // this._handlerGroups = [];
  if (this._state == 'fulfilled') {
    while (this._handlerGroups.length) {
      if (typeof this._handlerGroups[0].successCb !== 'function') return;
      this._handlerGroups[0].successCb(this._value)
      this._handlerGroups.shift()
    }
  } else if (this._state == 'rejected'){
    while (this._handlerGroups.length) {
      if (typeof this._handlerGroups[0].errorCb !== 'function') return;
      this._handlerGroups[0].errorCb(this._value)
      this._handlerGroups.shift()
    }
  }
}

$Promise.prototype.catch = function(func){
  return this.then(null, func);
}

$Promise.prototype.then = function(successCb, errorCb){
  if (typeof successCb !== 'function') successCb = null;
  if (typeof errorCb !== 'function') errorCb = null;
  let downstreamPromise = new $Promise(function(){});
  // downstreamPromise._internalResolve(this._callHandlers)
  this._handlerGroups.push({'successCb': successCb, 'errorCb': errorCb, 'downstreamPromise': downstreamPromise})
  this._callHandlers();
  return downstreamPromise;
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

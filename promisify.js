var fs = require('fs')

function myPromise() {
  this.handlerQueue = []
  this.isPromise = true
}

myPromise.prototype.then = function (onFulfilled, onRejected) {
  var handler = {}
  if (typeof onFulfilled === 'function') {
    handler.resolve = onFulfilled
  }
  if (typeof onRejected === 'function') {
    handler.reject = onRejected
  }
  this.handlerQueue.push(handler)
  return this
}

function myDeferred() {
  this.state = 'pending'
  this.promise = new myPromise()
}

myDeferred.prototype.resolve = function (obj) {
  this.state = 'fulfilled'
  var promise = this.promise
  var handler = {}

  while (handler = promise.handlerQueue.shift()) {
    if (handler && handler.resolve) {
      var res = handler.resolve(obj)
      if (res && res.isPromise) {
        res.handlerQueue = promise.handlerQueue
        this.promise = res
        return
      } else {
        obj = res
      }
    }
  }
}

myDeferred.prototype.reject = function (obj) {
  this.state = 'rejected'
  var promise = this.promise
  var handler = {}

  while (handler = promise.handlerQueue.shift()) {
    if (handler && handler.reject) {
      var res = handler.reject(obj)
      if (res && res.isPromise) {
        res.handlerQueue = promise.handlerQueue
        this.promise = res
        return
      } else {
        obj = res
      }
    }
  }
}

myDeferred.prototype.callback = function() {
  return (err, result) => {
    if(err) {
      this.reject(err)
    }else{
      this.resolve(result)
    }
  }
}

var promisify = function(method) {
  if(typeof method !== 'function') {
    throw new TypeError('is not a function')
  }
  return function() {
    const deferred = new myDeferred()
    var args = Array.prototype.slice.call(arguments, 0)
    args.push(deferred.callback())
    method.apply(this, args) // 异步代码
    return deferred.promise
  }
}

var readFile = promisify(fs.readFile);
readFile('index.js').then((res) => {
  console.log(res)
  return readFile('index2.js')
}).then((res) => {
  console.log(res)
})
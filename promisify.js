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

function asyncDosomething(flag) {
  const deferred = new myDeferred()
  setTimeout(() => {
    if(flag) {
      deferred.resolve({code: '200', message: '调用成功!'})
    }else{
      deferred.reject({code: '404', message: '调用失败!'})
    }
  }, 3000)
  return deferred.promise
}

asyncDosomething(1).then((res) => {
  console.log(res)
})
function myPromise() {
  this.handlerQueue = [] // 每一个元素都包含reslove和reject
  this.isPromise = true
}

myPromise.prototype.then = function(onFulfilled, onRejected) {
  var handler = {}
  console.log(onFulfilled, '=>') // 可以确定的是： 先把所有的then方法调用一遍
  if(typeof onFulfilled === 'function') {
    handler.resolve = onFulfilled
  }
  if(typeof onRejected === 'function') {
    handler.reject = onRejected
  }
  this.handlerQueue.push(handler)
  return this
}

myPromise.prototype.catch = function(onRejected) {
  var handler = {}
  if(typeof onRejected === 'function') {
    handler.reject = onRejected
  }
  this.handlerQueue.push(handler)
  return this
}

function myDeferred() {
  this.state = 'pending'
  this.promise = new myPromise()
}

myDeferred.prototype.resolve = function(obj) {
  this.state = 'fulfilled'
  var promise = this.promise
  var handler = {}

  while(handler = promise.handlerQueue.shift()) {
    if(handler && handler.resolve) {
      var res = handler.resolve(obj)
      if(res && res.isPromise) {
        res.handlerQueue = promise.handlerQueue
        this.promise = res
        return
      } else {
        obj = res
      }
    }
  }
}

myDeferred.prototype.reject = function(obj) {
  this.state = 'reject'
  var promise = this.promise
  var handler = {}

  while(handler = promise.handlerQueue.shift()) {
    if(handler && handler.reject) {
      var res = handler.reject(obj)
      if(res && res.isPromise) {
        res.handlerQueue = promise.handlerQueue // 老的queue指向新的queue
        this.promise = res // 老的promise 指向新的promise
        return
      }else{
        obj = res
      }
    }
  }
}

function asyncDosomething(flag) {
  const deferred = new myDeferred()
  setTimeout(function() {
    if(flag) {
      deferred.resolve({code: '200', message: '调用成功'})
    }else{
      deferred.reject({code: '404', message: '调用失败'})
    }
  }, 3000)
  return deferred.promise
}

// then按顺序添加，reslove按顺序执行
asyncDosomething(1).then((res) => {
  console.log(res, 1)
  return asyncDosomething(0)
}).then((res) => {
  console.log(res, 2)
}).catch((err) => {
  console.log(err, 3)
})


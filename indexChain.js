
function myPromise() {
  this.handlerQueue = []
  this.isPromise = true
}

myPromise.prototype.then = function(onFulfilled, onRejected) {
  var handler = {}
  if(typeof  onFulfilled === "function") {
    handler.resolve = onFulfilled
  }
  if(typeof  onRejected === "function") {
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

  // 当数组中没有元素的时候就停止while循环.
  while(handler = promise.handlerQueue.shift() ) {
    if(handler && handler.resolve) {
      var res = handler.resolve(obj) // then方法返回的内容
      if(res && res.isPromise) { // 如果返回的promise对象， promise对象必定有isPromise属性并且这个属性的值为 ‘true’
        res.handlerQueue = promise.handlerQueue // 返回的promise对象的 handleQueue = 第一个promise对象 // 就是一个引用地址 then push 清空
        this.promise = res //
        return
      } else {
        obj = res
      }
    }
  }
}

myDeferred.prototype.reject = function(obj) {
  this.state = 'rejected'
  var promise = this.promise
  var handler = {}

  // 当数组中没有元素的时候就停止while循环.
  while(handler = promise.handlerQueue.shift() ) {
    if(handler && handler.reject) {
      var res = handler.reject(obj) // then方法返回的内容
      if(res && res.isPromise) { // 如果返回的promise对象， promise对象必定有isPromise属性并且这个属性的值为 ‘true’
        res.handlerQueue = promise.handlerQueue // 返回的promise对象的 handleQueue = 第一个promise对象 // 就是一个引用地址 then push 清空
        this.promise = res //
        return
      } else {
        obj = res
      }
    }
  }
}


function asyncDosomething(flag) {
  const deferred = new myDeferred()
  setTimeout(function() {
    if(flag) {
      deferred.resolve({code: '200', message: '调用成功!'})
    } else {
      deferred.reject({code: '404', message: '调用失败!'})
    }
  }, 3000)
  return deferred.promise
}


asyncDosomething(1).then((res) => { // then方法返回的是this 所以我们在resolve中改造的应该是this.
  console.log(res, 'then1')
  return asyncDosomething(0)
}).then((res) => {
  console.log(res, 'then2')
}, (err) => {
  console.log(err, 'then2-err')
})
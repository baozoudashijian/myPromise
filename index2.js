
function myPromise() {
  this.state = "pendding"
  this.handler = {}
}

myPromise.prototype.then = function(resolve, reject) {
  if(resolve) {
    this.handler.resolve = resolve
  }
  if(reject) {
    this.handler.reject = reject
  }
}

function myDeferred() {
  this.promise = new myPromise()
}
myDeferred.prototype.resolve = function(data) {
  this.state = 'success'
  if(this.promise.handler && this.promise.handler.resolve) {
    this.promise.handler.resolve(data)
  }
}
myDeferred.prototype.reject = function(err) {
  this.state = 'failed'
  if(this.promise.handler && this.promise.handler.reject) {
    this.promise.handler.reject(err)
  }
}


// asyncDoSomething是异步处理
function asyncDoSomething(flag) {
  let deferred = new myDeferred()
  setTimeout(() => {
    if(flag) {
      deferred.resolve({code: 200, message: '调用成功!'})
    } else {
      deferred.reject({code: 404, message: '调用失败!'})
    }
  }, 3000)
  return deferred.promise
}

asyncDoSomething(0).then((res) => {
  console.log(res)
},(err) => {
  console.log(err)
})
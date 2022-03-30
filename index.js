
function myPromise() {
    this.handler = {}
}
// then函数就是将回调函数存放起来.
myPromise.prototype.then = function(onFuldilled, onRejected) {
    var handler = {}

    if(typeof onFuldilled === 'function') {
        handler.resolve = onFuldilled
    }

    if(typeof onRejected === 'function') {
        handler.reject = onRejected
    }
    this.handler = handler
    return this
}


function myDeferred() {
    this.state = 'pending';
    this.promise = new myPromise()
}

myDeferred.prototype.resolve = function(obj) {
    console.log(this) // 这个this不等与上面的this // this是个变量，方法没有调用前我们都不确定this的指向，或者说你目前是按照你想向的方式去调用.
    this.state = 'fulfilled'
    var handler = this.promise.handler
    if(handler && handler.resolve) {
        handler.resolve(obj)
    }
}

myDeferred.prototype.reject = function(obj) {
    this.state = 'reject'
    var handler = this.promise.handler
    if(handler && handler.reject) {
        handler.reject(obj)
    }
}

function asyncDoSomething() {
    
}
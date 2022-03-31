
function myPromise() {
    // this.__proto__ = myPromise.prototype
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


function myDeferred(fn) {
    this.state = 'pending';
    this.promise = new myPromise()
    fn(this.resolve.bind(this), this.reject.bind(this))
}

myDeferred.prototype.resolve = function(obj) {
    console.log(this.promise) // 这个this不等与上面的this // this是个变量，方法没有调用前我们都不确定this的指向，或者说你目前是按照你想向的方式去调用.
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

// 异步代码
function asyncDoSomething(flag, message) {
    var deferred = new myDeferred((resolve, reject) => {
        setTimeout(function() {
            if(flag) {
                console.log(resolve.toString(), '11111')
                resolve({code: '200', message: message})
            } else {
                reject({code: '400', message: '拒绝'})
            }
        }, 3000)
    })


    return deferred.promise
}


// asyncDoSomething(1, 'TD-King') > return deferred.promise 【这一部分代码返回myPromise对象】

asyncDoSomething(0, 'TD-King').then((data) => {
    console.log(data)
}, (err) => {
    console.log(err)
})
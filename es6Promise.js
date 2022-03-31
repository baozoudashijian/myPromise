function asyncDoSomething(flag, message) {
  var promise = new Promise((resolve, reject) => {
    setTimeout(function() {
      if(flag) {
        resolve({code: '200', message: message})
      } else {
        reject({code: '400', message: '拒绝'})
      }
    }, 3000)
  })


  // 使用promise对象去解决异步问题, 这个对象首先必须返回的是promise
  return promise
}

asyncDoSomething(1, 'TD-King').then((data) => {
  console.log(data)
}, (err) => {
  console.log(err)
})
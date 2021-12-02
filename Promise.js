;(function (root, factory) {
  if (typeof module === 'object') {
    // node 环境就用 module.exports 导出 Promise
    module.exports = factory()
  } else {
    // 浏览器环境则直接绑定到 window.Promise 上
    root['Promise'] = factory()
  }
})(this, function () {
  const pending = 'pending'
  const fulfilled = 'fulfilled'
  const rejected = 'rejected'

  class Promise {
    constructor(func) {
      this.state = pending
      // resolve 或者 reject 的值都用 this.result 来存
      this.result = undefined
      // resolve 或者 reject 时要把所有通过 .then 和 .catch 产生的新的 promise 的 state 也修改一下
      // 到时候直接执行这些 callbacks 就行了
      this.callbacks = []

      try {
        func(this.resolve, this.reject)
      } catch (err) {
        this.reject(err)
      }
    }

    resolve = result => {
      if (this.state !== pending) {
        return
      }
      this.state = fulfilled
      this.result = result

      this.callbacks.forEach(cb => {
        cb()
      })
    }

    reject = result => {
      if (this.state !== pending) {
        return
      }
      this.state = rejected
      this.result = result

      this.callbacks.forEach(cb => {
        cb()
      })
    }

    then(onFulfilled, onRejected) {
      // 先创建一个新的 promise ，后面会直接返回它
      // 这里定义了 resolve 和 reject 是为了在 callback 里面来修改 promise 的 state
      let resolve, reject
      const newPromise = new Promise((_resolve, _reject) => {
        resolve = _resolve
        reject = _reject
      })

      const callback = () => {
        // 因为 .then 和 .catch 都算是微任务，所以这里我们用 queueMicrotask 来执行
        queueMicrotask(() => {
          try {
            let newResult
            if (this.state === fulfilled) {
              // 对应于 .then(v => v + 1) 和 .then() 这两种情况
              newResult =
                typeof onFulfilled === 'function'
                  ? onFulfilled(this.result)
                  : this.result
            } else if (typeof onRejected === 'function') {
              // 对应于 .catch(err => xxx)
              newResult = onRejected(this.result)
            } else {
              // 对应于 .catch() 或者直接没有 .catch 时
              reject(this.result)
              return
            }

            // 对应于 a = Promise.resolve().then(() => a)
            if (newResult === newPromise) {
              throw TypeError('Chaining cycle detected for promise #<Promise>')
            }
            // 类似于 Promise.resolve().then(() => Promise.resolve()) 这种返回一个 promise 时
            if (newResult instanceof Promise) {
              // 这种时候是这个返回的 promise 的 state 决定 newPromise 的 state
              newResult.then(resolve, reject)
            } else {
              resolve(newResult)
            }
          } catch (err) {
            reject(err)
          }
        })
      }

      if (this.state === pending) {
        this.callbacks.push(callback)
      } else {
        callback()
      }

      return newPromise
    }

    catch(onRejected) {
      return this.then(undefined, onRejected)
    }

    static resolve(result) {
      return new Promise(resolve => {
        resolve(result)
      })
    }

    static reject(result) {
      return new Promise((resolve, reject) => {
        reject(result)
      })
    }
  }

  return Promise
})

自己实现的一个 Promise 。

Promise 规范见 [Promises/A+](https://promisesaplus.com/) ，这里没考虑 [2.3.3](https://promisesaplus.com/#point-53) ，也就是 `.then(func)` 中 func 的返回值是一个对象或者函数的场景。

`yarn test` 执行的是 `promises-aplus-tests ./promise-for-test.js --grep 2.3.3 --invert` ，这里也是去掉了 `2.3.3` 对应的测试用例，其它测试用例均能通过。

了解更多异步和 Promise --> https://github.com/findxc/blog/issues/61
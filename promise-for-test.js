const Promise = require('./Promise')

const resolved = v => {
  return Promise.resolve(v)
}

const rejected = v => {
  return Promise.reject(v)
}

const deferred = () => {
  let resolve, reject
  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })
  return {
    promise,
    resolve,
    reject,
  }
}

module.exports = {
  resolved,
  rejected,
  deferred,
}

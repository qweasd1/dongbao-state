/**
 * Created by tony on 4/2/17.
 */
'use strict'

const warningFn = () => {
  console.warn(`It looks like you're trying to use Dongbao without the middleware! For Dongbao to work, you need to run CreateDongbaoMiddleware() and apply it as middleware to your Redux Store.`)
}
let resolvedDispatch = warningFn
let resolvedGetState = warningFn

export let dispatch = (...args) => {
  return resolvedDispatch(...args)
}
export let getState = (...args) => {
  return resolvedGetState(...args)
}

export default function createMiddleware (options) {
  return (stateUtils) => {
    resolvedDispatch = stateUtils.dispatch
    resolvedGetState = stateUtils.getState
    return (next) => {
      return action => {
        const result = next(action)
        return result
      }
    }
  }
}


/**
 * Created by tony on 4/2/17.
 */
'use strict'

import {storeCreated} from './global'


const warningFn = () => {
  console.warn(`It looks like you're trying to use Dongbao without the middleware! For Dongbao to work, you need to run CreateDongbaoMiddleware() and apply it as middleware to your Redux Store.`)
}
let resolvedDispatch = warningFn
let resolvedGetState = warningFn

export let dispatch = (...args) => {
  return resolvedDispatch(...args)
}
export let getState = () => {
  return resolvedGetState()
}

export let Config = (store) => {
  resolvedDispatch = store.dispatch
  resolvedGetState = store.getState
  storeCreated()
}


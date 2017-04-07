/**
 * Created by tony on 4/2/17.
 */
'use strict'

import {addLocalReducers} from './global'
import {deepget, createRalativePathSelector} from './utils'

import {dispatch,getState} from './config'
import {parsePaths} from './path'


function globalActionName(prefix, localName) {
  if (prefix === "") {
    return localName
  }
  else {
    return `${prefix}/${localName}`
  }
}


let createSingleReducer = (options) => {
  options.actions = options.actions || {}
  options.effects = options.effects || {}
  
  
  // create paths and prefix, add them to options, so plugins can use them
  let paths = options.paths = parsePaths(options.path)
  let action_prefix = options.prefix = paths.join("/")
  
  
  // TODO: workaround for unittest, will use mock for jest in the future
  let _dispatch = options.__dispatch__ || dispatch
  
  
  
  
  // process plugins: it will modify the options in sequence
  let plugins = options.plugins || []
  
  
  // you can return new options in plugins, this will be the new plugins
  // you can also return nothing and modify the origin options, this will pass to the sub sequence
  for (let i = 0; i < plugins.length; i++) {
    let result = plugins[i](options)
    if (result !== undefined) {
      options = result
    }
  }
  // extract initialState after plugin processing so plugin can change state
  let initialState = options.initial
  
  let localActions = options.actions
  let globalActions = Object.keys(localActions).reduce((_globalActions, localName) => {
    _globalActions[globalActionName(action_prefix,localName)] = localActions[localName]
    return _globalActions
  }, {})
  
  // create action reducer
  let actionReducers = function (state, action) {
    let {type, payload, error, meta} = action
    let reducer = globalActions[type]
    if (reducer !== undefined) {
      return reducer(state, payload, error, meta)
    }
    else {
      return state || initialState
    }
  }
  
  // local action creator which will bind to all effect methods
  let actionDispatchers = {}
  
  
  for (let localName in localActions) {
    let actionType = globalActionName(action_prefix,localName)
    let actionCreator = function (payload, error, meta) {
      return {
        type: actionType,
        payload: payload,
        error: error,
        meta: meta
      }
    }
    
    let actionDispatcher = function (payload, error, meta) {
      _dispatch(actionCreator(payload, error, meta))
    }
    
    if (localName in actionDispatchers) {
      throw new Error(`duplicate action name: ${localName} for state ${action_prefix}`)
    }
    
    // add to local dispatcher (consume by effect)
    actionDispatchers[localName] = actionDispatcher
    
    
    // add to reducer (to let other module access them easily)
    actionReducers[localName] = actionDispatcher
  }
  
  // create local state getState method
  let localGetState = ()=>{
    return deepget(getState(),paths)
  }
  
  localGetState.get = (stateSelector)=>{
    return createRalativePathSelector(paths,stateSelector)(getState())
  }
  
  // create effects creator & dispatcher
  let finalEffects = options.effects
  for (let localName in finalEffects) {
    let actionType = globalActionName(action_prefix,localName)
    
    if (localName in actionDispatchers) {
      throw new Error(`duplicate effect name: ${localName} for state ${action_prefix}`)
    }
    
    // we wrap the call to finalEffects as a promise (you return promise from effect)
    let effectFn = (payload, error, meta) => {
      // actionDispatcher(payload,error,meta)
      return Promise.resolve(finalEffects[localName].bind(actionDispatchers)(payload, localGetState,error,meta))
    }
    
    // add to local dispatcher
    actionDispatchers[localName] = effectFn
    
    // add to reducer for other module to access
    actionReducers[localName] = effectFn
    
  }
  
  // compose the final result
  actionReducers.$prefix = action_prefix
  actionReducers.$paths = paths
  actionReducers.$initialState = initialState
  actionReducers.$actionDispatchers = actionDispatchers
  
  return actionReducers
  
}


export let State = (stateConfigs)=>{
  if (!Array.isArray(stateConfigs)) {
    stateConfigs = [stateConfigs]
  }
  
  let reducers = stateConfigs.map(createSingleReducer)
  // add to global reducers
  addLocalReducers(reducers)
  
  if (reducers.length === 1) {
    return reducers[0]
  }
  else {
    return reducers
  }
}
  
  






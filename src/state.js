/**
 * Created by tony on 4/2/17.
 */
'use strict'

import {addLocalActions} from './global'
import {dispatch,getState} from './config'
import parsePaths from './path'


function globalActionName(prefix, localName) {
  if (prefix === "") {
    return localName
  }
  else {
    return `${prefix}/${localName}`
  }
}


export let State = (options) => {
  options.actions = options.actions || {}
  options.effects = options.effects || {}
  
  // check if options is valid
  if (!options.dir || typeof options.dir !== 'string') {
    throw new Error(`a string 'dir' is required for a state`)
  }
  
  // create paths and prefix, add them to options, so plugins can use them
  let paths = options.paths = parsePaths(options.dir)
  let action_prefix = options.prefix = paths.join("/")
  
  
  // TODO: workaround for unittest, will use mock for jest in the future
  let _dispatch = options.__dispatch__ || dispatch
  
  let initialState = options.initial
  
  
  // process plugins: it will modify the options in sequence
  let plugins = options.plugins || []
  delete options.plugins
  
  // you can return new options in plugins, this will be the new plugins
  // you can also return nothing and modify the origin options, this will pass to the sub sequence
  for (let i = 0; i < plugins.length; i++) {
    let result = plugins[i](options)
    if (result !== undefined) {
      options = result
    }
  }
  
  
  
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
  
  
  // create effects creator & dispatcher
  let finalEffects = options.effects
  for (let localName in finalEffects) {
    let actionType = globalActionName(action_prefix,localName)
    // let actionCreator = function (payload, error, meta) {
    //   return {
    //     type: actionType,
    //     payload: payload,
    //     error: error,
    //     meta: meta
    //   }
    // }
    //
    // let actionDispatcher = function (payload, error, meta) {
    //   _dispatch(actionCreator(payload, error, meta))
    // }
    //
    
    
    if (localName in actionDispatchers) {
      throw new Error(`duplicate effect name: ${localName} for state ${action_prefix}`)
    }
    
    // we wrap the call to finalEffects as a promise (you return promise from effect)
    let effectFn = (payload, error, meta) => {
      // actionDispatcher(payload,error,meta)
      return Promise.resolve(finalEffects[localName].bind(actionDispatchers)(payload, getState))
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
  
  // add to global actions
  addLocalActions(actionDispatchers, actionReducers)
  
 
  
  return actionReducers
  
}







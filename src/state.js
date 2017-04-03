/**
 * Created by tony on 4/2/17.
 */
'use strict'

import {addAction, addEffect} from './action';
import {dispatch} from './config';
import parsePaths from './path';


function State(options) {
  options.actions = options.actions || {}
  options.effects = options.effects || {}
  
  // TODO: workaround for unittest, will use mock for jest in the future
  let _dispatch = options.__dispatch__ || dispatch
  
  // check if options is valid
  if (!options.dir || typeof options.dir !== 'string') {
    throw new Error(`a string 'dir' is required for a state`)
  }
  
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
  
  // create action creator & dispatcher
  let paths = parsePaths(options.dir)
  let action_prefix = paths.join("/")
  
  let localActions = options.actions
  let globalActions = Object.keys(localActions).reduce((_globalActions,localName)=>{
    _globalActions[`${action_prefix}/${localName}`] = localActions[localName]
    return _globalActions
  },{})
  
  // create action reducer
  let actionReducer = function (state, action) {
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
    let actionType = `${action_prefix}/${localName}`
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
    
    // add to global actions
    addAction(paths, actionType, actionDispatcher)
    
    // add to reducer (to let other module access them easily)
    actionReducer[localName] = actionDispatcher
  }
  
  
  // create effects creator & dispatcher
  let finalEffects = options.effects
  for (let localName in finalEffects) {
    let actionType = `${action_prefix}/${localName}`
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
    let effectFn = (payload,error,meta)=>{
      // actionDispatcher(payload,error,meta)
      return Promise.resolve(finalEffects[localName].bind(actionDispatchers)(payload,error,meta))
    }
    
    // add to local dispatcher
    actionDispatchers[localName] = effectFn
    
    // add to reducer for other module to access
    actionReducer[localName] = effectFn
    
    // add to global actions, effectFn will bind 'this' to local actionDispatchers
    addEffect(paths,actionType, effectFn)
    
    
  }
  
  
  // compose the final result
  
  actionReducer.$paths = paths
  actionReducer.$initialState = initialState
  
  return actionReducer
  
}

export default State





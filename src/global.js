/**
 * Created by tony on 4/2/17.
 */
'use strict'
import {deepmerge, deepget} from './utils';
import {dispatch} from './config'


export let Actions = {}
export let States = []
export let initState = {}

// used by rootReducer
let prefixReducerMapper = {}

// flag which indicate
let isStoreCreated = false


let STATE_DYNAMICALLY_ADD = "@@dongbao/stateDynamicallyAdd"

export function calcNextRootStateFromLocalState(localNewState, rootPreviousState, paths) {
  if (paths.length === 0) {
    return localNewState
  }
  let newRootState, cursor
  newRootState = cursor = {...rootPreviousState}
  let i
  for (i = 0; i < paths.length - 1; i++) {
    cursor = cursor[paths[i]] = {...cursor[paths[i]]}
  }
  
  cursor[paths[i]] = localNewState
  
  return newRootState
}

export let RootReducer = (state = initState, action) => {
  
  // handle new states added
  if (action.type === STATE_DYNAMICALLY_ADD) {
    let reducers = action.payload
    let reducer = reducers[0]
    let nextState = calcNextRootStateFromLocalState(reducer.$initialState, state, reducer.$paths)
    
    // if only one state added, just update the state, if more than one, generate nextState from one reducer and then merge the new initState from others
    if (reducers.length === 1) {
      return nextState
    }
    else {
      for (let i = 1; i < reducers.length; i++) {
        deepmerge(nextState,reducers[i].$paths,reducers[i].$initialState)
      }
      
      return nextState
    }
  }
  
  let prefix = action.type.substring(0, action.type.lastIndexOf("/"))
  let reducer = prefixReducerMapper[prefix]
  
  //if unknown action return orign state
  if (!reducer) {
    return state
  }
  
  let paths = reducer.$paths
  let previousState = deepget(state, paths)
  let newState = reducer(previousState, action)
  if (newState === previousState) {
    return state
  }
  else {
    return calcNextRootStateFromLocalState(newState, state, paths)
  }
}


function updateInitial(actionReducer) {
  if (actionReducer.$paths.length === 0) {
    for (let key of Object.keys(actionReducer.$initialState)) {
      initState[key] = actionReducer.$initialState[key]
    }
  }
  else {
    deepmerge(initState, actionReducer.$paths, actionReducer.$initialState)
  }
}

function addSingleReducer(actionReducer) {
  let localActions = actionReducer.$actionDispatchers
  if (actionReducer.$paths.length === 0) {
    for (let actionName of Object.keys(localActions)) {
      Actions[actionName] = localActions[actionName]
    }
  }
  else {
    deepmerge(Actions, actionReducer.$paths, localActions)
  }
  
  prefixReducerMapper[actionReducer.$prefix] = actionReducer
  States.push(actionReducer)
  
  
}


export let addLocalReducers = (actionReducers) => {
  if (!Array.isArray(actionReducers)) {
    actionReducers = [actionReducers]
  }
  
  if (actionReducers.length === 0) {
    return
  }
  
  actionReducers.forEach(reducer => {
    addSingleReducer(reducer)
  })
  
  if (isStoreCreated) {
    dispatch({
      type: STATE_DYNAMICALLY_ADD,
      payload: actionReducers
    })
  }
  else {
    actionReducers.forEach(reducer => {
      updateInitial(reducer)
    })
  }
}

// used by Config which let addLocalReducers knows we are already initialized, so if new State dispatch @@dongbao/newStateAdd event which merge initial state into origin state
export let storeCreated = () => {
  isStoreCreated = true
}

// use internally for unit test
export let reset = () => {
  Actions = {}
  States = []
  prefixReducerMapper = {}
  initState = {}
}


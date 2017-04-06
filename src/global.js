/**
 * Created by tony on 4/2/17.
 */
'use strict'
import {deepmerge, deepget} from './utils';



export let Actions = {}
export let States = []
export let initState = {}

// used by rootReducer
let prefixReducerMapper = {}

export let RootReducer = (state = initState,action)=> {
    let prefix = action.type.substring(0,action.type.lastIndexOf("/"))
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
      if (paths.length === 0) {
        return newState
      }
      let newRootState, cursor
      newRootState = cursor = {...state}
      let i
      for (i = 0; i < paths.length - 1; i++) {
        cursor = cursor[paths[i]] = {...cursor[paths[i]]}
      }
      
      cursor[paths[i]] = newState
      
      return newRootState
    }
}




function updateInitial(actionReducer){
  if (actionReducer.$paths.length === 0) {
    for (let key of Object.keys(actionReducer.$initialState)) {
      initState[key] = actionReducer.$initialState[key]
    }
  }
  else {
    deepmerge(initState,actionReducer.$paths,actionReducer.$initialState)
  }
}

export let addLocalActions = ( localActions, actionReduers) => {
  if (actionReduers.$paths.length === 0) {
    for (let actionName of Object.keys(localActions)) {
      Actions[actionName] = localActions[actionName]
    }
  }
  else {
    deepmerge(Actions, actionReduers.$paths, localActions)
  }
  
  updateInitial(actionReduers)
  prefixReducerMapper[actionReduers.$prefix] = actionReduers
  States.push(actionReduers)
}


// use internally for unit test
export let reset = ()=>{
  Actions = {}
  States = []
  prefixReducerMapper = {}
  initState = {}
}

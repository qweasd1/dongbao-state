/**
 * Created by tony on 4/2/17.
 */
'use strict'
import {deepset} from './utils';
import {combineStateReduer} from './combineStateReducer'



export let Actions = {}
export let States = []
export let initState = {}




function updateInitial(actionReducer){
  if (actionReducer.$paths.length === 0) {
    for (let key of Object.keys(actionReducer.$initialState)) {
      initState[key] = actionReducer.$initialState[key]
    }
  }
  else {
    deepset(initState,actionReducer.$paths,actionReducer.$initialState)
  }
}

export let addLocalActions = ( localActions, actionReduers) => {
  if (actionReduers.$paths.length === 0) {
    for (let actionName of Object.keys(localActions)) {
      Actions[actionName] = localActions[actionName]
    }
  }
  else {
    deepset(Actions, actionReduers.$paths, localActions)
  }
  
  updateInitial(actionReduers)
  
  States.push(actionReduers)
}

export let CreateRootReducer = ()=>{
  return combineStateReduer(States)
}

// use internally for unit test
export let Reset = ()=>{
  Actions = {}
  States = []
  initState = {}
}

/**
 * Created by tony on 4/3/17.
 */
'use strict'
import {deepget} from './utils'





export let combineStateReduer = (states) => {
  
  let prefixReducerMapper = states.reduce((mapper,state)=>{
    mapper[state.$prefix] = state
    return mapper
  },{})
  
  return (state,action)=> {
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
}



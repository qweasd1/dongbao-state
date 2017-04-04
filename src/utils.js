/**
 * Created by tony on 4/2/17.
 */
'use strict'
import {FILE_PATH_SPLIT_PATTEN, parsePaths} from './path'


/**
 * deep get property of obj for given paths
 * @param obj
 * @param paths
 * @return {*}
 */
export function deepget(obj, paths) {
  if (paths.length === 0) {
    return obj
  }
  
  let i, _obj = obj
  for (i = 0; i < paths.length - 1; i++) {
    _obj = _obj[paths[i]]
    if (typeof _obj !== 'object') {
      throw new Error(`can't deep get obj:${JSON.stringify(obj, null, 2)} for path:${paths.join(".")}`)
    }
  }
  return _obj[paths[i]]
}

/**
 * deep set property of obj for given paths
 * @param obj
 * @param paths
 * @param value
 * @return {*}
 */
export function deepset(obj, paths, value) {
  if (paths.length === 0) {
    throw new Error(`paths length for deep set should be more than 1`)
  }
  
  let i, _obj = obj, attr
  for (i = 0; i < paths.length - 1; i++) {
    attr = _obj[paths[i]]
    if (typeof attr !== 'object') {
      if (attr === undefined || attr === null) {
        //TODO: here we have some performance penalty (turn this to a for loop to boost performance)
        _obj = _obj[paths[i]] = {}
      }
      else {
        throw new Error(`can't deep set obj:${JSON.stringify(obj, null, 2)} for path:${paths.join(".")}`)
      }
    }
    else {
      _obj = attr
    }
  }
  return _obj[paths[i]] = value
}

/**
 * create selector of state from dir, will be used when binding state to react Component
 * @param dir {string}
 * @return {function(*)}
 */
export function createDirSelector(dir) {
  let paths = parsePaths(dir)
  return (state) => {
    return deepget(state, paths)
  }
}

/**
 * create selector of root state by using relative path
 * @param paths
 * @param relativePath
 * @return {function(*=)}
 */
export function createRalativePathSelector(paths, relativePath) {
  // TODO: we don't include enough error check here, like reach inaccessible path, will add in the future
  let resolvePaths
  if (relativePath.startsWith("/")) {
    resolvePaths = relativePath.split(FILE_PATH_SPLIT_PATTEN).slice(1)
    
  }
  else {
    resolvePaths = [...paths]
    
    let relativePaths = relativePath.split(FILE_PATH_SPLIT_PATTEN)
    
    while (relativePaths.length > 0) {
      let segmenet = relativePaths.shift()
      if (segmenet === ".") {
        // do nothing, it's only hint for use relative paths
        
      }
      else if (segmenet === "..") {
        resolvePaths.pop()
      }
      else {
        resolvePaths.push(segmenet)
      }
    }
  }
  
  resolvePaths = resolvePaths.filter(x => x !== "");
  
  // use to boost performance when select sub state from root state, only when state change we do a deepget
  let previousSelectedSubState = undefined
  let previousRootState = undefined
  
  return (state) => {
    if (state === previousRootState) {
      return previousSelectedSubState
    }
    else {
      previousSelectedSubState = deepget(state, resolvePaths)
      previousRootState = state
      return previousSelectedSubState
    }
  }
}

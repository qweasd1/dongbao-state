/**
 * Created by tony on 4/2/17.
 */
'use strict'

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
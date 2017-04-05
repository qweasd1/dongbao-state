/**
 * Created by tony on 4/2/17.
 */
'use strict'
export const FILE_PATH_SPLIT_PATTEN = /[\\\/]/

let cache = {}

export function parsePaths(path) {
  
  // use cache
  if (cache[path]) {
    return cache[path]
  }
  
  if (path === undefined) {
    path = ""
  }
  
  let rawpaths = path.split(FILE_PATH_SPLIT_PATTEN)
  
  if (rawpaths[0] === "") {
    rawpaths.unshift()
  }
  
  if (rawpaths[rawpaths.length - 1] === "") {
    rawpaths.pop()
  }
  
  let srcPosition = rawpaths.lastIndexOf("src")
  let resolvedPaths
  
  if (srcPosition !== -1) {
    resolvedPaths = rawpaths.slice(srcPosition+1)
  }
  else {
    resolvedPaths = rawpaths
  }
  
  cache[path]= resolvedPaths
  return resolvedPaths
  
}


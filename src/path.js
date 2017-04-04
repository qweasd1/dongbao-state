/**
 * Created by tony on 4/2/17.
 */
'use strict'
export const FILE_PATH_SPLIT_PATTEN = /[\\\/]/

let cache = {}

export function parsePaths(dir) {
  
  // use cache
  if (cache[dir]) {
    return cache[dir]
  }
  
  
  let rawpaths = dir.split(FILE_PATH_SPLIT_PATTEN)
  
  let srcPosition = rawpaths.lastIndexOf("src")
  if (srcPosition === -1) {
    throw new Error("'src' should in your 'dir' path")
  }
  return rawpaths.slice(srcPosition+1)
  
}


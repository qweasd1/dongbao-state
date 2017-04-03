/**
 * Created by tony on 4/2/17.
 */
'use strict'
const FILE_PATH_SPLIT_PATTEN = /[\\\/]/

export default function parsePaths(dir) {
  let rawpaths = dir.split(FILE_PATH_SPLIT_PATTEN)
  
  let srcPosition = rawpaths.lastIndexOf("src")
  if (srcPosition === -1) {
    throw new Error("'src' should in your 'dir' path")
  }
  return rawpaths.slice(srcPosition+1)
  
}



'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parsePaths = parsePaths;
var FILE_PATH_SPLIT_PATTEN = exports.FILE_PATH_SPLIT_PATTEN = /[\\\/]/;

var cache = {};

function parsePaths(dir) {
  if (cache[dir]) {
    return cache[dir];
  }

  var rawpaths = dir.split(FILE_PATH_SPLIT_PATTEN);

  var srcPosition = rawpaths.lastIndexOf("src");
  if (srcPosition === -1) {
    throw new Error("'src' should in your 'dir' path");
  }
  return rawpaths.slice(srcPosition + 1);
}
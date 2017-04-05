
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parsePaths = parsePaths;
var FILE_PATH_SPLIT_PATTEN = exports.FILE_PATH_SPLIT_PATTEN = /[\\\/]/;

var cache = {};

function parsePaths(path) {
  if (cache[path]) {
    return cache[path];
  }

  if (path === undefined) {
    path = "";
  }

  var rawpaths = path.split(FILE_PATH_SPLIT_PATTEN);

  if (rawpaths[0] === "") {
    rawpaths.unshift();
  }

  if (rawpaths[rawpaths.length - 1] === "") {
    rawpaths.pop();
  }

  var srcPosition = rawpaths.lastIndexOf("src");
  var resolvedPaths = void 0;

  if (srcPosition !== -1) {
    resolvedPaths = rawpaths.slice(srcPosition + 1);
  } else {
    resolvedPaths = rawpaths;
  }

  cache[path] = resolvedPaths;
  return resolvedPaths;
}
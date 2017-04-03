
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parsePaths;
var FILE_PATH_SPLIT_PATTEN = /[\\\/]/;

function parsePaths(dir) {
  var rawpaths = dir.split(FILE_PATH_SPLIT_PATTEN);

  var srcPosition = rawpaths.lastIndexOf("src");
  if (srcPosition === -1) {
    throw new Error("'src' should in your 'dir' path");
  }
  return rawpaths.slice(srcPosition + 1);
}
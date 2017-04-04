
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.deepget = deepget;
exports.deepset = deepset;
exports.createDirSelector = createDirSelector;
exports.createRalativePathSelector = createRalativePathSelector;

var _path = require('./path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function deepget(obj, paths) {
  if (paths.length === 0) {
    return obj;
  }

  var i = void 0,
      _obj = obj;
  for (i = 0; i < paths.length - 1; i++) {
    _obj = _obj[paths[i]];
    if ((typeof _obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(_obj)) !== 'object') {
      throw new Error('can\'t deep get obj:' + JSON.stringify(obj, null, 2) + ' for path:' + paths.join("."));
    }
  }
  return _obj[paths[i]];
}

function deepset(obj, paths, value) {
  if (paths.length === 0) {
    throw new Error('paths length for deep set should be more than 1');
  }

  var i = void 0,
      _obj = obj,
      attr = void 0;
  for (i = 0; i < paths.length - 1; i++) {
    attr = _obj[paths[i]];
    if ((typeof attr === 'undefined' ? 'undefined' : (0, _typeof3.default)(attr)) !== 'object') {
      if (attr === undefined || attr === null) {
        _obj = _obj[paths[i]] = {};
      } else {
        throw new Error('can\'t deep set obj:' + JSON.stringify(obj, null, 2) + ' for path:' + paths.join("."));
      }
    } else {
      _obj = attr;
    }
  }
  return _obj[paths[i]] = value;
}

function createDirSelector(dir) {
  var paths = (0, _path.parsePaths)(dir);
  return function (state) {
    return deepget(state, paths);
  };
}

function createRalativePathSelector(paths, relativePath) {
  var resolvePaths = void 0;
  if (relativePath.startsWith("/")) {
    resolvePaths = relativePath.split(_path.FILE_PATH_SPLIT_PATTEN).slice(1);
  } else {
    resolvePaths = [].concat((0, _toConsumableArray3.default)(paths));

    var relativePaths = relativePath.split(_path.FILE_PATH_SPLIT_PATTEN);

    while (relativePaths.length > 0) {
      var segmenet = relativePaths.shift();
      if (segmenet === ".") {} else if (segmenet === "..") {
        resolvePaths.pop();
      } else {
        resolvePaths.push(segmenet);
      }
    }
  }

  resolvePaths = resolvePaths.filter(function (x) {
    return x !== "";
  });

  var previousSelectedSubState = undefined;
  var previousRootState = undefined;

  return function (state) {
    if (state === previousRootState) {
      return previousSelectedSubState;
    } else {
      previousSelectedSubState = deepget(state, resolvePaths);
      previousRootState = state;
      return previousSelectedSubState;
    }
  };
}
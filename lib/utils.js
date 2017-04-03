
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.deepget = deepget;
exports.deepset = deepset;
exports.createDirSelector = createDirSelector;

var _path = require('./path');

var _path2 = _interopRequireDefault(_path);

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
  var paths = (0, _path2.default)(dir);
  return function (state) {
    return deepget(state, paths);
  };
}
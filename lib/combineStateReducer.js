
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combineStateReduer = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var combineStateReduer = exports.combineStateReduer = function combineStateReduer(states) {

  var prefixReducerMapper = states.reduce(function (mapper, state) {
    mapper[state.$prefix] = state;
    return mapper;
  }, {});

  return function (state, action) {
    var prefix = action.type.substring(0, action.type.lastIndexOf("/"));
    var reducer = prefixReducerMapper[prefix];

    if (!reducer) {
      return state;
    }

    var paths = reducer.$paths;
    var previousState = (0, _utils.deepget)(state, paths);
    var newState = reducer(previousState, action);
    if (newState === previousState) {
      return state;
    } else {
      if (paths.length === 0) {
        return newState;
      }
      var newRootState = void 0,
          cursor = void 0;
      newRootState = cursor = (0, _extends3.default)({}, state);
      var i = void 0;
      for (i = 0; i < paths.length - 1; i++) {
        cursor = cursor[paths[i]] = (0, _extends3.default)({}, cursor[paths[i]]);
      }

      cursor[paths[i]] = newState;

      return newRootState;
    }
  };
};
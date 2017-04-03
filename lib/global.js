
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Reset = exports.CreateRootReducer = exports.addLocalActions = exports.initState = exports.States = exports.Actions = undefined;

var _utils = require('./utils');

var _combineStateReducer = require('./combineStateReducer');

var Actions = exports.Actions = {};
var States = exports.States = [];
var initState = exports.initState = {};

function updateInitial(actionReducer) {
  if (actionReducer.$paths.length === 0) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = Object.keys(actionReducer.$initialState)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;

        initState[key] = actionReducer.$initialState[key];
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  } else {
    (0, _utils.deepset)(initState, actionReducer.$paths, actionReducer.$initialState);
  }
}

var addLocalActions = exports.addLocalActions = function addLocalActions(localActions, actionReduers) {
  if (actionReduers.$paths.length === 0) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = Object.keys(localActions)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var actionName = _step2.value;

        Actions[actionName] = localActions[actionName];
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  } else {
    (0, _utils.deepset)(Actions, actionReduers.$paths, localActions);
  }

  updateInitial(actionReduers);

  States.push(actionReduers);
};

var CreateRootReducer = exports.CreateRootReducer = function CreateRootReducer() {
  return (0, _combineStateReducer.combineStateReduer)(States);
};

var Reset = exports.Reset = function Reset() {
  exports.Actions = Actions = {};
  exports.States = States = [];
  exports.initState = initState = {};
};
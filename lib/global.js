
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reset = exports.storeCreated = exports.addLocalReducers = exports.RootReducer = exports.initState = exports.States = exports.Actions = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.calcNextRootStateFromLocalState = calcNextRootStateFromLocalState;

var _utils = require('./utils');

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Actions = exports.Actions = {};
var States = exports.States = [];
var initState = exports.initState = {};

var prefixReducerMapper = {};

var isStoreCreated = false;

var STATE_DYNAMICALLY_ADD = "@@dongbao/stateDynamicallyAdd";

function calcNextRootStateFromLocalState(localNewState, rootPreviousState, paths) {
  if (paths.length === 0) {
    return localNewState;
  }
  var newRootState = void 0,
      cursor = void 0;
  newRootState = cursor = (0, _extends3.default)({}, rootPreviousState);
  var i = void 0;
  for (i = 0; i < paths.length - 1; i++) {
    cursor = cursor[paths[i]] = (0, _extends3.default)({}, cursor[paths[i]]);
  }

  cursor[paths[i]] = localNewState;

  return newRootState;
}

var RootReducer = exports.RootReducer = function RootReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initState;
  var action = arguments[1];

  if (action.type === STATE_DYNAMICALLY_ADD) {
    var reducers = action.payload;
    var _reducer = reducers[0];
    var nextState = calcNextRootStateFromLocalState(_reducer.$initialState, state, _reducer.$paths);

    if (reducers.length === 1) {
      return nextState;
    } else {
      for (var i = 1; i < reducers.length; i++) {
        (0, _utils.deepmerge)(nextState, reducers[i].$paths, reducers[i].$initialState);
      }

      return nextState;
    }
  }

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
    return calcNextRootStateFromLocalState(newState, state, paths);
  }
};

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
    (0, _utils.deepmerge)(initState, actionReducer.$paths, actionReducer.$initialState);
  }
}

function addSingleReducer(actionReducer) {
  var localActions = actionReducer.$actionDispatchers;
  if (actionReducer.$paths.length === 0) {
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
    (0, _utils.deepmerge)(Actions, actionReducer.$paths, localActions);
  }

  prefixReducerMapper[actionReducer.$prefix] = actionReducer;
  States.push(actionReducer);
}

var addLocalReducers = exports.addLocalReducers = function addLocalReducers(actionReducers) {
  if (!Array.isArray(actionReducers)) {
    actionReducers = [actionReducers];
  }

  if (actionReducers.length === 0) {
    return;
  }

  actionReducers.forEach(function (reducer) {
    addSingleReducer(reducer);
  });

  if (isStoreCreated) {
    (0, _config.dispatch)({
      type: STATE_DYNAMICALLY_ADD,
      payload: actionReducers
    });
  } else {
    actionReducers.forEach(function (reducer) {
      updateInitial(reducer);
    });
  }
};

var storeCreated = exports.storeCreated = function storeCreated() {
  isStoreCreated = true;
};

var reset = exports.reset = function reset() {
  exports.Actions = Actions = {};
  exports.States = States = [];
  prefixReducerMapper = {};
  exports.initState = initState = {};
};
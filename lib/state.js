
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.State = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _global = require('./global');

var _utils = require('./utils');

var _config = require('./config');

var _path = require('./path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function globalActionName(prefix, localName) {
  if (prefix === "") {
    return localName;
  } else {
    return prefix + '/' + localName;
  }
}

var createSingleReducer = function createSingleReducer(options) {
  options.actions = options.actions || {};
  options.effects = options.effects || {};
  options.methods = options.methods || {};

  var paths = options.paths = (0, _path.parsePaths)(options.path);
  var action_prefix = options.prefix = paths.join("/");

  var _dispatch = options.__dispatch__ || _config.dispatch;

  var plugins = options.plugins || [];

  for (var i = 0; i < plugins.length; i++) {
    var result = plugins[i](options);
    if (result !== undefined) {
      options = result;
    }
  }

  var initialState = options.initial;

  var localActions = options.actions;
  var globalActions = Object.keys(localActions).reduce(function (_globalActions, localName) {
    _globalActions[globalActionName(action_prefix, localName)] = localActions[localName];
    return _globalActions;
  }, {});

  var actionReducers = function actionReducers(state, action) {
    var type = action.type,
        payload = action.payload,
        error = action.error,
        meta = action.meta;

    var reducer = globalActions[type];
    if (reducer !== undefined) {
      return reducer(state, payload, error, meta);
    } else {
      return state || initialState;
    }
  };

  var actionDispatchers = {};

  var _loop = function _loop(localName) {
    var actionType = globalActionName(action_prefix, localName);
    var actionCreator = function actionCreator(payload, error, meta) {
      return {
        type: actionType,
        payload: payload,
        error: error,
        meta: meta
      };
    };

    var actionDispatcher = function actionDispatcher(payload, error, meta) {
      _dispatch(actionCreator(payload, error, meta));
    };

    if (localName in actionDispatchers) {
      throw new Error('duplicate action name: ' + localName + ' for state ' + action_prefix);
    }

    actionDispatchers[localName] = actionDispatcher;

    actionReducers[localName] = actionDispatcher;
  };

  for (var localName in localActions) {
    _loop(localName);
  }

  var localGetState = function localGetState() {
    return (0, _utils.deepget)((0, _config.getState)(), paths);
  };

  localGetState.get = function (stateSelector) {
    return (0, _utils.createRalativePathSelector)(paths, stateSelector)((0, _config.getState)());
  };

  var finalEffects = options.effects;

  var _loop2 = function _loop2(localName) {
    var actionType = globalActionName(action_prefix, localName);

    if (localName in actionDispatchers) {
      throw new Error('duplicate effect name: ' + localName + ' for state ' + action_prefix);
    }

    var effectFn = function effectFn(payload, error, meta) {
      return Promise.resolve(finalEffects[localName].bind(actionDispatchers)(payload, localGetState, error, meta));
    };

    actionDispatchers[localName] = effectFn;

    actionReducers[localName] = effectFn;
  };

  for (var localName in finalEffects) {
    _loop2(localName);
  }

  var methods = options.methods;

  var _loop3 = function _loop3(localName) {
    var method = methods[localName];
    var states = void 0;
    if (typeof method === "function") {
      states = ["."];
    } else if ((typeof method === 'undefined' ? 'undefined' : (0, _typeof3.default)(method)) === "object") {
      states = method.states;
      method = method.method;
    } else {
      throw new Error('in [' + action_prefix + ']: method can only be object or function');
    }

    var stateSelectors = states.map(function (state) {
      return (0, _utils.createRalativePathSelector)(paths, state);
    });

    var methodFn = function methodFn() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return method.apply(actionDispatchers, stateSelectors.map(function (selector) {
        return selector((0, _config.getState)());
      }).concat(args));
    };
    actionDispatchers[localName] = methodFn;
    actionReducers[localName] = methodFn;
  };

  for (var localName in methods) {
    _loop3(localName);
  }

  actionReducers.$prefix = action_prefix;
  actionReducers.$paths = paths;
  actionReducers.$initialState = initialState;
  actionReducers.$actionDispatchers = actionDispatchers;

  return actionReducers;
};

var State = exports.State = function State(stateConfigs) {
  if (!Array.isArray(stateConfigs)) {
    stateConfigs = [stateConfigs];
  }

  var reducers = stateConfigs.map(createSingleReducer);

  (0, _global.addLocalReducers)(reducers);

  if (reducers.length === 1) {
    return reducers[0];
  } else {
    return reducers;
  }
};
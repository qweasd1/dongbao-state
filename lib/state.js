
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.State = undefined;

var _global = require('./global');

var _config = require('./config');

var _path = require('./path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function globalActionName(prefix, localName) {
  if (prefix === "") {
    return localName;
  } else {
    return prefix + '/' + localName;
  }
}

var State = exports.State = function State(options) {
  options.actions = options.actions || {};
  options.effects = options.effects || {};

  if (!options.dir || typeof options.dir !== 'string') {
    throw new Error('a string \'dir\' is required for a state');
  }

  var paths = options.paths = (0, _path2.default)(options.dir);
  var action_prefix = options.prefix = paths.join("/");

  var _dispatch = options.__dispatch__ || _config.dispatch;

  var initialState = options.initial;

  var plugins = options.plugins || [];
  delete options.plugins;

  for (var i = 0; i < plugins.length; i++) {
    var result = plugins[i](options);
    if (result !== undefined) {
      options = result;
    }
  }

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

  var finalEffects = options.effects;

  var _loop2 = function _loop2(localName) {
    var actionType = globalActionName(action_prefix, localName);


    if (localName in actionDispatchers) {
      throw new Error('duplicate effect name: ' + localName + ' for state ' + action_prefix);
    }

    var effectFn = function effectFn(payload, error, meta) {
      return Promise.resolve(finalEffects[localName].bind(actionDispatchers)(payload, _config.getState));
    };

    actionDispatchers[localName] = effectFn;

    actionReducers[localName] = effectFn;
  };

  for (var localName in finalEffects) {
    _loop2(localName);
  }

  actionReducers.$prefix = action_prefix;
  actionReducers.$paths = paths;
  actionReducers.$initialState = initialState;

  (0, _global.addLocalActions)(actionDispatchers, actionReducers);

  return actionReducers;
};
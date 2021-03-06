
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Config = exports.getState = exports.dispatch = undefined;

var _global = require('./global');

var warningFn = function warningFn() {
  console.warn('It looks like you\'re trying to use Dongbao without the middleware! For Dongbao to work, you need to run CreateDongbaoMiddleware() and apply it as middleware to your Redux Store.');
};
var resolvedDispatch = warningFn;
var resolvedGetState = warningFn;

var dispatch = exports.dispatch = function dispatch() {
  return resolvedDispatch.apply(undefined, arguments);
};
var getState = exports.getState = function getState() {
  return resolvedGetState();
};

var Config = exports.Config = function Config(store) {
  resolvedDispatch = store.dispatch;
  resolvedGetState = store.getState;
  (0, _global.storeCreated)();
};
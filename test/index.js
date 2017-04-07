/**
 * Created by tony on 4/3/17.
 */
'use strict'
let dongbao = require('../src/index')
let {calcNextRootStateFromLocalState} = require('../src/global')

calcNextRootStateFromLocalState({c:1}, {}, ["a","b"])
console.log(calcNextRootStateFromLocalState({c:1}, {}, ["a","b"]));

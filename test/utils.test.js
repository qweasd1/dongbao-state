/**
 * Created by tony on 4/2/17.
 */
'use strict'
import {deepget, deepset, createDirSelector} from '../src/utils';

describe("deep get", () => {
  test("simple", () => {
    expect(deepget({a: 1}, ["a"])).toEqual(1)
  })
  
  test("nested", () => {
    expect(deepget({a: {b: {c: 1}}}, ["a", "b", "c"])).toEqual(1)
  })
  
  test("path not correct (contains none obj in paths)", () => {
    expect(() => {
      deepget({a: 1}, ["a", "b"])
    }).toThrow()
  })
})


describe("deep set", () => {
  test("simple", () => {
    let obj = {}
    let value = deepset(obj, ["a"], 1)
    expect(value).toEqual(1)
    expect(obj).toEqual({a: 1})
  })
  
  test("nested", () => {
    let obj = {}
    let value = deepset(obj, ["a", "b", "c"], 1)
    expect(value).toEqual(1)
    expect(obj).toEqual({a: {b: {c: 1}}})
  })
  
  
  test("path not correct (contains none obj in paths)", () => {
    expect(() => {
      let obj = {a: 1}
      let value = deepset(obj, ["a", "b", "c"], 1)
    }).toThrow()
  })
  
  test("0 path, should throw error", () => {
    expect(() => {
      let obj = {a: 1}
      let value = deepset(obj, [], 1)
    }).toThrow()
  })
})


describe("createDirSelector", () => {
  test("create selector", () => {
    let selector = createDirSelector("src/user")
    expect(selector({user: "tony"})).toEqual("tony")
  })
})


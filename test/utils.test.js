/**
 * Created by tony on 4/2/17.
 */
'use strict'
import {deepget, deepset, deepmerge, createDirSelector,createRalativePathSelector} from '../src/utils';

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


describe("createRalativePathSelector",()=>{
  let selector
  let state = {
    entries:{
      people:[{name:"tony"}],
      products:[]
    }
  }
  
  test("parse absolute path (only '/')", () => {
    selector = createRalativePathSelector(["entries","people"],"/")
    expect(selector(state)).toEqual(state)
  })
  
  test("parse absolute path ('/**')", () => {
    selector = createRalativePathSelector(["entries","people"],"/entries/people")
    expect(selector(state)).toEqual(state.entries.people)
  })
  
  test("parse relative path (only '.' ) ", () => {
    selector = createRalativePathSelector(["entries","people"],".")
    expect(selector(state)).toEqual(state.entries.people)
  })
  
  test("parse relative path ('./**' ) ", () => {
    selector = createRalativePathSelector(["entries"],"./people")
    expect(selector(state)).toEqual(state.entries.people)
  })
  
  test("parse relative path (only '..' ) ", () => {
    selector = createRalativePathSelector(["entries","people"],"..")
    expect(selector(state)).toEqual(state.entries)
  })
  
  test("parse relative path ('../**' ) ", () => {
    selector = createRalativePathSelector(["entries","people"],"../products")
    expect(selector(state)).toEqual(state.entries.products)
  })
  
})

describe("deepmerge",()=>{
  test("paths.length > 0", () => {
    let obj = {
      a:{
        b:1
      }
    }
    
    expect(deepmerge(obj,["a"],{c:2})).toEqual({
      a:{
        b:1,
        c:2
      }
    })
  })
  
  test("paths.length == 0", () => {
    let obj = {
      a:{
        b:1
      }
    }
    
    expect(deepmerge(obj,[],{c:2})).toEqual({
      a:{
        b:1,
        
      },
      c:2
    })
  })
  
  test("merge none obj value", () => {
    let obj = {
      a:{
        b:1
      }
    }
    
    expect(deepmerge(obj,["c"],2)).toEqual({
      a:{
        b:1,
      },
      c:2
    })
  })
  
  test("merge none obj value at root is forbidden", () => {
    // TODO: add in future
  })
})
/**
 * Created by tony on 4/2/17.
 */
'use strict'
import {parsePaths} from '../src/path';

describe("has 'src' in path",()=>{
  test("has sub path from src", () => {
    expect(parsePaths("src/login")).toEqual(["login"])
  })
  
  test("has no sub path from src", () => {
    expect(parsePaths("src")).toEqual([])
  })
  
  test("with heading '/' ", () => {
    expect(parsePaths("/src/aa")).toEqual(["aa"])
  })
  
})

describe("no 'src' in path",()=>{
  test("empty", () => {
    expect(parsePaths("")).toEqual([])
  })
  
  test("undefined", () => {
    expect(parsePaths()).toEqual([])
  })
  
  test("single", () => {
    expect(parsePaths("login")).toEqual(["login"])
  })
  
  test("nested", () => {
    expect(parsePaths("login/status")).toEqual(["login","status"])
  })
})

describe("path from __dirname in node",()=>{
  test("file name", () => {
    expect(parsePaths("/user/a/projects/dongbao-state/src/a")).toEqual(["a"])
  })
})

// describe("use cache",()=>{
//   test("should same for 2 same path", () => {
//
//     expect(parsePaths("unique")).toBe(parsePaths("unique"))
//   })
// })

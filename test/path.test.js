/**
 * Created by tony on 4/2/17.
 */
'use strict'
import parsePaths from '../src/path';


test("has sub path from src", () => {
  expect(parsePaths("src/login")).toEqual(["login"])
})

test("has no sub path from src", () => {
  expect(parsePaths("src")).toEqual([])
})

test("when no 'src' in dir, throw errors ", () => {
  expect(()=>{
    parsePaths("a/b/c")
  }).toThrow()
})

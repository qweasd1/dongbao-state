/**
 * Created by tony on 4/3/17.
 */
'use strict'

import {Actions, initState, States} from '../src/global';
import {State} from '../src/state';


let basicState = {
  dir: "src/user",
  initial: {
    name: "tony"
  },
  actions: {
    changeName(state, name){
      return {
        ...state,
        name
      }
    }
  },
  effects: {
    
    changeNameOnce(name){
      this.changeName(name)
    },
    
    changeNameTwice(name){
      this.changeName(name)
      this.changeName(name + "too")
    },
    async asyncChangeName(name){
      let newName = await Promise.resolve(name)
      this.changeName(newName)
    }
  }
}


describe("Actions", () => {
  
  let state
  beforeAll(() => {
    state = State({
      ...basicState
    })
  })
  
  test("should have actions on Actions", () => {
    expect(Actions.user.changeName).toBeInstanceOf(Function)
  })
  
  test("should have actions on Effects", () => {
    expect(Actions.user.changeNameOnce).toBeInstanceOf(Function)
  })
  
})


describe("initState", () => {
  
  State({
    dir: "src",
    initial: {
      root: "root"
    }
  })
  
  State({
    dir: "src/user",
    initial: {
      name: "tony"
    }
  })
  
  test("test initState", () => {
    expect(initState).toEqual(
      {
        root: "root",
        user: {
          name: "tony"
        }
      }
    )
  })
  
  
})

describe("States", () => {
  
  State({
    dir: "src",
    initial: {
      root: "root"
    }
  })
  
  State({
    dir: "src/user",
    initial: {
      name: "tony"
    }
  })
  
  test("test states exists", () => {
    expect(States.length).toBeGreaterThanOrEqual(2)
  })
  
  
})


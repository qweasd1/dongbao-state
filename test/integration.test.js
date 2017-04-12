/**
 * Created by tony on 4/2/18.
 */
'use strict'

import {State} from '../src/state';
import {Config, getState} from '../src/config';
import {createStore} from 'redux';
import {RootReducer} from '../src/global'


let basicState = {
  path: "src/user",
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
    },
    accessGetState(payload, getState){
      return getState
    }
  }
}

let state, store


describe("effect getState", () => {
  beforeAll(() => {
    state = State({
      ...basicState
    })
    store = createStore(RootReducer)
    Config(store)
  })
  
  test("getState", async() => {
    let getState = await state.accessGetState()
    expect(getState()).toEqual({name: "tony"})
  })
  
  test("getState.get", async() => {
    let getState = await state.accessGetState()
    expect(getState.get("..")).toEqual({user: {name: "tony"}})
  })
  
})


describe("methods",()=>{
  let state
  beforeAll(()=>{
    
    state = State({
      ...basicState,
      methods:{
        isNameTony(state){
          return state.name === "tony"
        },
        isNameTonySelect:["..", ".", function (userState, state) {
          return userState.user.name === "tony" && state.name == "tony"
        }]
      }
    })
  
    store = createStore(RootReducer)
    Config(store)
  })
  
  test("default state", () => {
    expect(state.isNameTony()).toEqual(true)
  })
  
  test("choose state", () => {
    expect(state.isNameTonySelect()).toEqual(true)
  })
})


describe("single reducer", () => {
  beforeAll(() => {
    state = State({
      ...basicState
    })
    store = createStore(RootReducer)
    Config(store)
  })
  
  
  test("init value", () => {
    expect(store.getState()).toEqual({"user": {"name": "tony"}})
  })
  
  test("call action", () => {
    state.changeName("newname")
    expect(store.getState()).toEqual({"user": {"name": "newname"}})
  })
  
})


describe("dynamically load state", () => {
  beforeEach(() => {
    
    state = State({
      ...basicState
    })
    store = createStore(RootReducer)
    Config(store)
    
    
  })
  
  test("add 1 state", () => {
    
    State({
      path: "new",
      initial: "new"
    })
    
    expect(getState()).toEqual({
      new: "new",
      user: {name: "tony"}
    })
  })
  
  test("add >1 states right order", () => {
    
    State([
      {
        path: "new",
        initial: {value: "new"}
      },
      {
        path: "new/inner",
        initial: "newinner"
      }
    ])
    
    expect(getState()).toEqual(
      {
        "new": {
          "inner": "newinner",
          "value": "new"
        },
        "user":
          {
            "name": "tony"
          }
      }
    )
  })
  
  test("add >1 states inverse state order", () => {
    
    State([
      {
        path: "new/inner",
        initial: "newinner"
      },
      {
        path: "new",
        initial: {value: "new"}
      }
    ])
    
    expect(getState()).toEqual(
      {
        "new": {
          "inner": "newinner",
          "value": "new"
        },
        "user":
          {
            "name": "tony"
          }
      }
    )
  })
  
})


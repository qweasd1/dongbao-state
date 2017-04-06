/**
 * Created by tony on 4/2/18.
 */
'use strict'

import {State} from '../src/state';
import {Config} from '../src/config';
import {createStore} from 'redux';
import {initState,RootReducer} from '../src/global'




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
    accessGetState(payload,getState){
      return getState
    }
  }
}

let state,store

beforeAll(() => {
  state = State({
    ...basicState
  })
  store = createStore(RootReducer)
  Config(store)
})

describe("effect getState",()=>{
  
  test("getState", async() => {
    let getState = await state.accessGetState()
    expect(getState()).toEqual({name:"tony"})
  })
  
  test("getState.get", async() => {
    let getState = await state.accessGetState()
    expect(getState.get("..")).toEqual({user:{name:"tony"}})
  })
  
})

describe("single reducer", () => {
  

  
  test("init value", () => {
    expect(store.getState()).toEqual( {"user": {"name": "tony"}})
  })
  
  test("call action", () => {
    state.changeName("newname")
    expect(store.getState()).toEqual({"user": {"name": "newname"}})
  })
  
})


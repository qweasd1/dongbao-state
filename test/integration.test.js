/**
 * Created by tony on 4/2/18.
 */
'use strict'

import {State} from '../src/state';
import {Config} from '../src/config';
import {createStore} from 'redux';



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


describe("single reducer", () => {
  
  let state,store
  
  beforeAll(() => {
    state = State({
      ...basicState
    })
    store = createStore(state)
    Config(store)
  })
  
  test("init value", () => {
    expect(store.getState()).toEqual({name: "tony"})
  })
  
  test("call action", () => {
    state.changeName("newname")
    expect(store.getState()).toEqual({name:"newname"})
  })
  
})
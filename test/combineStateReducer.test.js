/**
 * Created by tony on 4/3/17.
 */
'use strict'
import {State} from '../src/state';
import {combineStateReduer} from '../src/combineStateReducer'


let nestedState = {
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
    }
  }
}

let rootState = {
  path: "src",
  initial: {
    root: "root"
  },
  actions: {
    changeRoot(state, root){
      return {
        ...state,
        root
      }
    }
  }
}


describe("create", () => {
  
  let prefixStateMapper, reducer
  beforeAll(() => {
    reducer = combineStateReduer([State(nestedState),State(rootState)])
  })
  
  
  test("no action match", () => {
    let newState = reducer({
      root:"root",
      user:{
        name:"tony"
      }
    },{
      type:"unknown action",
      payload:"newRoot"
    })
  
    expect(newState).toEqual({
      root: "root",
      user: {
        name: "tony"
      }
    })
  })
  
  test("call root action", () => {
    let newState = reducer({
      root:"root",
      user:{
        name:"tony"
      }
    },{
      type:"changeRoot",
      payload:"newRoot"
    })
    
    expect(newState).toEqual({
      root: "newRoot",
      user: {
        name: "tony"
      }
    })
  })
  
  test("call nested action", () => {
    let newState = reducer({
      root:"root",
      user:{
        name:"tony"
      }
    },{
      type:"user/changeName",
      payload:"newName"
    })
    
    expect(newState).toEqual({
      root: "root",
      user: {
        name: "newName"
      }
    })
  })
  
  
})

/**
 * Created by tony on 4/2/17.
 */
'use strict'

import State from '../src/state';

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


describe("create", () => {
  
  let state
  beforeAll(() => {
    state = State({
      ...basicState
    })
  })
  
  
  test("should have initial", () => {
    expect(state.$initialState).toEqual({
      name: "tony"
    })
  })
  
  test("should have initial", () => {
    expect(state.$initialState).toEqual({
      name: "tony"
    })
  })
  
  test("should have actions on final reducer", () => {
    expect(state.changeName).toBeInstanceOf(Function)
  })
  
  test("should have effects on final reducer", () => {
    expect(state.changeNameTwice).toBeInstanceOf(Function)
  })
  
})


describe("actions", () => {
  let state, mockDispatch
  beforeEach(() => {
    mockDispatch = jest.fn()
    state = State({
      ...basicState,
      __dispatch__: mockDispatch
    })
  })
  
  
  test("action can be called with only payload", () => {
    state.changeName("tony")
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "user/changeName",
      payload: "tony",
      error: undefined,
      meta: undefined
    })
  })
  
  test("action can be called with payload, error", () => {
    state.changeName("error message", true)
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "user/changeName",
      payload: "error message",
      error: true,
      meta: undefined
    })
  })
  
  test("action can be called with only payload, error, meta", () => {
    state.changeName("error message", true, {key: 1})
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "user/changeName",
      payload: "error message",
      error: true,
      meta: {key: 1}
    })
    
    
  })
})

describe("effects", () => {
  
  let state, mockDispatch
  beforeEach(() => {
    mockDispatch = jest.fn()
    state = State({
      ...basicState,
      __dispatch__: mockDispatch
    })
  })
  
  test("call 1 actions", () => {
    state.changeNameOnce("jimmy")
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "user/changeName",
      payload: "jimmy",
      error: undefined,
      meta: undefined
    })
  })
  
  test("call several actions", () => {
    state.changeNameTwice("jimmy")
    expect(mockDispatch.mock.calls[0]).toEqual([{
      type: "user/changeName",
      payload: "jimmy",
      error: undefined,
      meta: undefined
    }])
    
    expect(mockDispatch.mock.calls[1]).toEqual([{
      type: "user/changeName",
      payload: "jimmytoo",
      error: undefined,
      meta: undefined
    }])
  })
  
  test("call async actions",async () => {
    await state.asyncChangeName("async")
    
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "user/changeName",
      payload: "async",
      error: undefined,
      meta: undefined
    })
  })
  
})

describe("plugins", () => {
  
  let state
  
  
  test("update state config", () => {
  
    state = State({
      ...basicState,
      plugins:[
        function update(stateConfig){
          stateConfig.actions["startFetch"] = ()=>{}
          stateConfig.actions["endFetch"] = ()=>{}
        }
      ]
    })
    
    expect(state.startFetch).toBeInstanceOf(Function)
    expect(state.endFetch).toBeInstanceOf(Function)
  })
  
  test("replace state config", () => {
  
    state = State({
      ...basicState,
      plugins:[
        function update(stateConfig){
          stateConfig.actions["startFetch"] = ()=>{}
          stateConfig.actions["endFetch"] = ()=>{}
        },
        function replace(stateConfig){
          return {
            ...stateConfig,
            actions:{}
          }
        }
      ]
    })
  
    
    
    expect(state.startFetch).toBeUndefined()
    
  })
})

describe("reducer",()=>{
  let state
  beforeAll(()=>{
    state = State({
      ...basicState
    })
  })
  
  test("call reducer", () => {
    let newState = state({name:"old"},{
      type:"user/changeName",
      payload:"newName"
    })
  
    expect(newState).toEqual({name: "newName"})
  })
})


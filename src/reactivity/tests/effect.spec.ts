import { effect, stop } from "../effect"
import { reactive } from "../reactivity"

describe('effect', ()=>{
  it('effect test', ()=>{
    const original = reactive({ foo: 1 })
    let dummy
    const runner = effect(()=> dummy = original.foo)
    const r = runner()
    expect(r).toBe(1)
    expect(dummy).toBe(1)
    original.foo = 2
    expect(dummy).toBe(2)
  })
  it('effect scheduler', ()=>{
    const scheduler = jest.fn()
    const original = reactive({ foo: 1 })
    let dummy
    effect(()=> dummy = original.foo, {
      scheduler
    })
    expect(dummy).toBe(1)
    original.foo = 2
    expect(dummy).toBe(1)
    expect(scheduler).toHaveBeenCalled()
    expect(scheduler).toHaveBeenCalledTimes(1)
  })
  it('effect stop', ()=>{
    const original = reactive({ foo: 1, bar: { baz: 2 } })
    const onStop = jest.fn()
    let dummy
    const runner = effect(()=> dummy = original.foo, {
      onStop
    })
    expect(dummy).toBe(1)
    original.foo = 2
    expect(dummy).toBe(2)
    stop(runner)
    stop(runner)
    original.foo = 3
    expect(dummy).toBe(2)
    original.foo ++
    expect(dummy).toBe(2)
    runner()
    expect(dummy).toBe(4)
    original.foo++
    expect(dummy).toBe(4)
    expect(onStop).toHaveBeenCalled()
    expect(onStop).toHaveBeenCalledTimes(1)
    const runner01 = effect(()=> dummy = original.bar.baz, {
      onStop
    })
    expect(dummy).toBe(2)
    original.bar.baz++
    expect(dummy).toBe(3)
  })
})
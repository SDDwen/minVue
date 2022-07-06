import { isReactive } from "../baseHandle"
import { reactive } from "../reactivity"

describe('reactive', ()=>{
  it('reactive test', ()=>{
    const original = { foo: 1, bar: { baz: 2 } }
    const dummy = reactive(original)
    expect(dummy.foo).toBe(1)
    original.foo = 2
    expect(dummy.foo).toBe(2)
    expect(original.foo).toBe(2)
    expect(dummy.foo).not.toBe(original)
  })
  it('reactive isReactive', ()=>{
    const original = { foo: 1, bar: { baz: 2 } }
    const dummy = reactive(original)
    isReactive(dummy)
    isReactive(dummy.bar)
  })
})
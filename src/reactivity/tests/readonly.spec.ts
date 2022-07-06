import { isReadonly } from "../baseHandle"
import { readonly } from "../reactivity"

describe('readonly', ()=>{
  it('readonly test', () => {
    console.warn = jest.fn()
    const original = { foo: 1, bar: { baz: 2 } }
    const dummy = readonly(original)
    expect(dummy.foo).toBe(1)
    dummy.foo++
    expect(dummy.foo).toBe(1)
    expect(console.warn).toBeCalled()
  })
  it('readonly isReadonly', ()=>{
    const original = { foo: 1, bar: { baz: 2 } }
    const dummy = readonly(original)
    expect(isReadonly(dummy)).toBe(true)
    expect(isReadonly(dummy.bar)).toBe(true)
  })
})
import { effect } from "../effect"
import { isRef, ref, unRef } from "../ref"

describe('ref', ()=>{
  it('ref happy path', ()=>{
    const dummy = ref(1)
    expect(dummy.value).toBe(1)
  })
  it('ref is reactive', ()=> {
    let calls = 0
    const refDummy = ref(1)
    let dummy
    effect(()=>{
      calls++
      dummy = refDummy.value
    })
    expect(dummy).toBe(1)
    expect(calls).toBe(1)
    refDummy.value = 2
    expect(dummy).toBe(2)
    expect(calls).toBe(2)
    refDummy.value = 2
    expect(dummy).toBe(2)
    expect(calls).toBe(2)
  })
  it('vlue is Object', ()=>{
    let calls = 0
    const refDummy = ref({count: 1})
    let dummy
    effect(()=>{
      calls++
      dummy = refDummy.value.count
    })
    expect(dummy).toBe(1)
    expect(calls).toBe(1)
    refDummy.value.count = 2

    expect(dummy).toBe(2)
    expect(calls).toBe(2)
    refDummy.value.count = 2
    expect(dummy).toBe(2)
    // why
    expect(calls).toBe(3)
  })
  it('value is ref', ()=>{
    const a = 1
    const dummy = ref(1)
    expect(isRef(dummy)).toBe(true)
    expect(isRef(1)).toBe(false)
    expect(isRef(a)).toBe(false)
  })
  it('unRef test', ()=>{
    const a = 1
    const dummy = ref(1)
    const dummyBoolen = ref(false)
    expect(unRef(dummy)).toBe(1)
    expect(unRef(a)).toBe(1)
    expect(unRef('a')).toBe('a')
    expect(unRef(dummyBoolen)).toBe(false)
  })
})
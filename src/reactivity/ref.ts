import { DepSet, trackEffct, triggerEffect, isTracking } from './effect'
import { hasChange, isObject } from "../shared"
import { reactive } from './reactivity'

class RefImpl{
  private _value
  private _rowValue
  public _is_val_ref:boolean = true
  public dep: DepSet = new Set()
  constructor(value){
    this._rowValue = value
    this._value = convert(value)
  }
  get value(){
    if(isTracking()){
      trackEffct(this.dep)
    }
    return this._value
  }
  set value(newValue){
    if(hasChange(this._rowValue, newValue)) return
    this._rowValue = newValue
    this._value = convert(newValue)
    triggerEffect(this.dep)

  }
}

function convert(value){
  return isObject(value) ? reactive(value) : value
}


export function isRef(ref){
  return !!ref._is_val_ref
}

export function unRef(ref){
  return isRef(ref)? ref.value : ref
}

export function ref(value){
  return new RefImpl(value)
}
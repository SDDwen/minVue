import { DepSet, trackEffct, triggerEffect, isTracking } from './effect'
import { hasChange, isObject } from "../shared"
import { reactive } from './reactivity'

class RefImpl{
  private _value
  private _rowValue
  public _is_val_ref = true
  public dep: DepSet = new Set()
  constructor(value){
    this._rowValue = value
    this._value = convert(value)
  }
  get value(){
    trackRefValue(this.dep)
    return this._value
  }
  set value(newValue){
    if(hasChange(this._rowValue, newValue)) return
    this._rowValue = newValue
    this._value = convert(newValue)
    triggerRefValue(this.dep)

  }
}

function convert(value){
  return isObject(value) ? reactive(value) : value
}

/**
 * @desc ref依赖收集
 */
function trackRefValue(dep:DepSet){
  if(isTracking()){
    trackEffct(dep)
  }
}

/**
 * @desc ref依赖响应
 */
function triggerRefValue(dep:DepSet){
  triggerEffect(dep)
}

export function isRef(ref){
  return !!ref._is_val_ref
}

export function unRef(ref){
  return isRef(ref)? ref.value : ref
}

const shallowUnWrapHandler:ProxyHandler<any> = {   
  get(target, key){
    return unRef(Reflect.get(target, key))
  },
  set(target, key, value){
    if(isRef(target[key]) && !isRef(value)){
      target[key].value  = value
      return true
    }
    return Reflect.set(target, key, value)
  }
}

export function proxyRefs<T extends object>(row: T){
  return new Proxy(row, shallowUnWrapHandler)
}

export function ref(value){
  return new RefImpl(value)
}
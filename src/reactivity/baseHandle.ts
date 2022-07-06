
import { isObject } from '../shared'
import { track, trigger } from './effect'
import { reactive, readonly } from './reactivity'

const enum ReactiveFlg {
  IS_REACTIVE = '_val_is_reactive',
  IS_READONLY = '_val_is_readonly'
}
const get = createGet()
const set = createsSet()
const readonlyGet = createGet(true)
const readonlySet = createsSet(true)
function  createGet(isReadonly = false){
  return function get(target, key){
    const res = Reflect.get(target, key)
    // TO do track
    if(key === ReactiveFlg.IS_REACTIVE){
      return !isReadonly
    }else if(key === ReactiveFlg.IS_READONLY){
      return isReadonly
    }
    
    if(isObject(res)){
      return isReadonly ?  readonly(res) : reactive(res)
    }

    if(!isReadonly){
      track(target, key)
    }
    return res
  }
}
function createsSet(isReadonly = false){
  return function set(target, key, value){
    if(isReadonly){
      console.warn('target is readonly, it\'s fail to set')
      return true
    }
    const res = Reflect.set(target, key, value)
    // TO do trigger
    trigger(target, key)
    return res
  }
}
 
export function isReactive(val){
  return !!val[ReactiveFlg.IS_REACTIVE]
}
export function isReadonly(val){
  return !!val[ReactiveFlg.IS_READONLY]
}

export function isProxy(val){
  return isReactive(val) || isReadonly(val)
}


export const reactiveHandler = {
  get,
  set
}
export const readonlyHandler = {
  get: readonlyGet,
  set: readonlySet
}


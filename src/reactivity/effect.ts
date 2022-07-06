import { extend } from '../shared'
type Option = {
  onStop?: ()=>any
  scheduler?: ()=> any
}
export type DepSet = Set<ReactiveEffect>
let activityEffect: ReactiveEffect

export class ReactiveEffect{
  private fn: () => any
  public onStop: () => any
  public scheduler: () => any
  public deps: DepSet[] = []
  public activity: boolean = true
  constructor(fn){
    this.fn = fn
  }
  run(){
    if(!this.activity){
      return this.fn()
    }
    activityEffect = this
    const result = this.fn()
    activityEffect = undefined
    return result
  }
  stop(){
    clearEffectFn.apply(this)
  }
}

function clearEffectFn(){
  const seflt: ReactiveEffect = this
  if(!seflt.activity) return
  for(let i = 0; i < seflt.deps.length; i++){
    const dep = seflt.deps[i]
    dep.delete(seflt)
  }
  seflt.activity = false
  seflt.deps.length = 0
  this.onStop && this.onStop()
}
export function effect(cb: ()=> any, option?: Option){
  const _effect = new ReactiveEffect(cb)
  _effect.run()
  extend(_effect, option)
  const runner = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}

// 依赖收集
const targeMap = new Map()
export function track(target, key){
  if(!isTracking()){
    return 
  }
  let depMap = targeMap.get(target)
  if(!depMap){
    depMap = new Map()
    targeMap.set(target, depMap)
  }
  let dep = depMap.get(key)
  if(!dep){
    dep = new Set()
    depMap.set(key, dep)
  }
  
  trackEffct(dep)
}

export function isTracking(){
  return !!activityEffect
}


export function trackEffct(dep: DepSet){
  if(!dep.has(activityEffect)){
    dep.add(activityEffect)
    activityEffect.deps.push(dep)
  }
}

// 依赖相应
export function trigger(target, key){
  const depMap = targeMap.get(target)
  if(!depMap) return 
  const dep: DepSet = depMap.get(key)
  if(!dep) return 
  
  triggerEffect(dep)
}

export function triggerEffect(dep:DepSet){
  for(let effect of dep){
    if(effect.scheduler){
      effect.scheduler()
    }else{
      effect.run()
    }
  }
}

export function stop(runner){
  runner.effect.stop()
}
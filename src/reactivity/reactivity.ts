import { reactiveHandler, readonlyHandler } from './baseHandle'
export function reactive(row){
  return createReactiv(row)
}
export function readonly(row){
  return createReadonly(row)
}
function createReactiv(row){
  return createProxyObj(row, reactiveHandler)
}
function createReadonly(row){
  return createProxyObj(row, readonlyHandler)
}
function createProxyObj(row, handler){
  return new Proxy(row, handler)
}
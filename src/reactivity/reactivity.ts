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

/**
 * 
 * @param {object} row 
 * @param handler
 * @returns new Proxy 
 * @desc 创建响应式实例
 */
function createProxyObj<T extends object>(row:T, handler:ProxyHandler<any>){
  return new Proxy(row, handler)
}
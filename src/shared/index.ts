/**
 * @desc 拓展对象属性
 */
export const extend = Object.assign

export function isObject(val){
  return val !== null && typeof val === 'object'
}
export function hasChange(val, newVal){
  return Object.is(val, newVal)
}
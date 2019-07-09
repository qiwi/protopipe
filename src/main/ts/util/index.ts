/**
 * @hidden
 * @ignore
 * @internal
 */

import {IAny} from '../types'
import {cxt} from '../cxt'

/**
 * TODO use nanoid?
 */
export const genId = (prefix?: string) => `${prefix || ''}${Math.random()}`

export const promisify = (result: any): Promise<any> => cxt.Promise.resolve(result)

export type IDecomposedPromise = {
  promise: Promise<IAny>,
  resolve: Function,
  reject: Function
}

export const getDecomposedPromise = (): IDecomposedPromise => {
  let _resolve: Function
  let _reject: Function
  let done: boolean = false

  const promise = new cxt.Promise((resolve: Function, reject: Function) => {
    _resolve = resolve
    _reject = reject
  })

  const finalize = (handler: Function) => (data?: any) => {
    if (!done) {
      done = true
      return handler(data)
    }
  }

  const resolve = finalize((data?: any) => _resolve(data))
  const reject = finalize((err?: any) => _reject(err))

  return {
    promise,
    resolve,
    reject,
  }
}

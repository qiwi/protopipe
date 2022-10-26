/**
 * @hidden
 * @ignore
 * @internal
 */

import {cxt} from '../cxt'
import {IPromise} from '../types'
export {factory as getInsideOutPromise, TInsideOutPromise} from 'inside-out-promise'

/**
 * TODO use nanoid?
 */
export const genId = (prefix?: string) => `${prefix || ''}${Math.random()}`

export const promisify = (result: any): IPromise<any> => cxt.Promise.resolve(result)

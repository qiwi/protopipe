/** @module protopipe */

import {IStack} from './interface'

/**
 * @ignore
 */
export default class Stack implements IStack{

  private _storage: Array<any>
  constructor(...args: Array<any>) {
    // super(...args)
    this._storage = [...args]
  }

  get(index: number): any {
    return this._storage[index]
  }

  push(...items: Array<any>): any {
    this._storage.push(...items)

    return this.get(this.size() - 1)
  }

  pop(): any {
    return this._storage.pop()
  }

  shift(): any {
    return this._storage.shift()
  }

  size(): number {
    return this._storage.length
  }

  filter(cb: (item: any) => boolean): Array<any> {
    return this._storage.filter(cb)
  }

}

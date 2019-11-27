/** @module protopipe */

import {IStack} from './types'

/**
 * @ignore
 */
export class Stack implements IStack<any> {

  private _storage: Array<any>
  constructor(...args: Array<any>) {
    // super(...args)
    this._storage = [...args]
  }

  get(index: number | string): any {
    return this._storage[+index]
  }

  push(...items: Array<any>): any {
    this._storage.push(...items)

    return this.get(this.size - 1)
  }

  pop(): any {
    return this._storage.pop()
  }

  shift(): any {
    return this._storage.shift()
  }

  unshift(...items: Array<any>): any {
    this._storage.unshift(...items)

    return items[0]
  }

  get size(): number {
    return this._storage.length
  }

  remove(index: number | string): any {
    const idx = +index
    const found = this._storage[+idx]

    this._storage.splice(idx, 1)

    return found
  }

  filter(cb: (...args: Array<any>) => boolean): Array<any> {
    return this._storage.filter(cb)
  }

  last(): any {
    return this._storage[this.size - 1]
  }

  first(): any {
    return this._storage[0]
  }

  toArray(): Array<any> {
    return [...this._storage]
  }

  clear(): void {
    this._storage.length = 0
  }

  indexOf(item: any): number {
    return this._storage.indexOf(item)
  }

  add(index: number | string, item: any): any {
    this._storage[+index] = item

    return item
  }

  isEmpty(): boolean {
    return this.size !== 0
  }

}

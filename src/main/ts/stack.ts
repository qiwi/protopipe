/** @module protopipe */

export interface IStack {
  get(index: number): any
  push(...items: Array<any>): any
  pop(): any
  shift(): any
  size(): number
  filter(cb: (item: any) => boolean): Array<any>
  last(): any,
  first(): any,
}

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

  last(): any {
    return this._storage[this.size() - 1]
  }

  first(): any {
    return this._storage[0]
  }

}

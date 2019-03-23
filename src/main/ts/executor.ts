export const assertResult = (result: any) => {
  if (typeof result !== 'object') {
    throw new Error('pipe must return an object {data: any, opts?: any}')
  }
}

export const promisify = (result: any): Promise<any> =>  Promise.resolve(result)

export default (handler: Function) => {
  const result = handler()

  if (result && typeof result.then === 'function') {
    return result.then((value: any) => value)
  }
}

export const executePipe = () => {}

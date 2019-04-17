/** @module protopipe */

import {
  IMode,
  IInput,
  IOutput,
  ITraverserOutput,
  INil,
  IExecutor,
  IExecutorContext,
} from './interface'

export const ASYNC: IMode = 'async'

function promisify<T>(result: T): Promise<T> {
  return Promise.resolve(result)
}

export const processSync = (context: IExecutorContext): IOutput | INil => {
  const {meta, data, opts, graph, handler, traverser} = context

  let hasNext = true
  let next: ITraverserOutput | INil
  let res: IOutput | INil = null
  let input: IInput = {opts, data, meta}

  while (hasNext) {
    next = traverser({graph, ...input, ...(res || {})})

    if (next === null) {
      hasNext = false
      return res
    }

    res = {...input, ...next, ...handler({...input, ...(res || {}), ...next})}
  }
}

export const processAsync = async(context: IExecutorContext): Promise<IOutput | INil> => {
  const {meta, data, opts, graph, handler, traverser} = context

  let hasNext = true
  let next: ITraverserOutput | INil
  let res: IOutput | INil = null
  let input: IInput = {opts, data, meta}

  while (hasNext) {
    next = await promisify(traverser({graph, ...input, ...(res || {})}))
    if (next === null) {
      hasNext = false
      return res
    }
    const _res: IOutput = await promisify(handler({...input, ...(res || {}), ...next}))

    res = {...input, ...next, ..._res}
  }
}

export const process: IExecutor = (context) => {
  if (context.meta.mode === ASYNC) {
    return processAsync(context)
  }

  return processSync(context)
}

export default process

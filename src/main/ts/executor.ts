/** @module protopipe */

import {
  IMode,
  IOutput,
  ITraverserOutput,
  INil,
  IExecutor,
  IExecutorContext, IInput,
} from './interface'

export const ASYNC: IMode = 'async'

function promisify<T>(result: T): Promise<T> {
  return Promise.resolve(result)
}

export const processSync = (context: IExecutorContext): IOutput | INil => {
  const {input, graph, handler, traverser} = context

  let mixin: ITraverserOutput | INil
  let next: IInput = input

  while (true) {
    mixin = traverser({graph, input: next})

    if (mixin === null) {
      return next
    }

    next = {...next, ...mixin}
    next = {...next, ...handler(next)}

  }
}

export const processAsync = async(context: IExecutorContext): Promise<IOutput | INil> => {
  const {input, graph, handler, traverser} = context

  let mixin: ITraverserOutput | INil
  let next: IInput = input

  while (true) {
    mixin = await promisify(traverser({graph, input: next}))

    if (mixin === null) {
      return next
    }

    next = {...next, ...mixin}
    next = {...next, ...await promisify(handler(next))}
  }
}

export const process: IExecutor = (context) => {
  if (context.input.meta.mode === ASYNC) {
    return processAsync(context)
  }

  return processSync(context)
}

export default process

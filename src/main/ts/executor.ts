/** @module protopipe */

import {
  IMode,
  IOutput,
  INil,
  IExecutor,
  IExecutorContext,
  ISequence,
  IInput,
  IStack,
} from './interface'

import Stack from './stack'

export const ASYNC: IMode = 'async'

export const promisify = (result: any): Promise<any> => Promise.resolve(result)
export const findResult = (results: Array<IOutput | INil>): any => results.find((result) => result !== null)
export const getStack = (context: IExecutorContext): IStack => context.stack || new Stack()

export const process: IExecutor = (context) => {
  const {input, graph, handler, traverser} = context
  const isAsyncMode = context.input.meta.mode === ASYNC
  const stack = getStack(context)
  const paths = traverser({graph, sequence: input.meta.sequence})

  let next: IInput

  if (isAsyncMode) {
    if (paths === null) {
      return promisify(input)
    }

    return Promise.all(paths.map((sequence: ISequence<any, any>) => {

      next = {...input, meta: {...input.meta, sequence}}

      return promisify(handler(next))
        .then(stack.push.bind(stack))
        .then(res => process({...context, stack, input: {...next, ...res}}))
    }))
      .then(findResult)
  }

  if (paths === null) {
    return input
  }

  return findResult(paths.map((sequence: ISequence<any, any>) => {
    next = {...input, meta: {...input.meta, sequence}}
    next = {...next, ...handler(next)}

    return stack.push(process({...context, stack, input: next}))
  }))
}

export default process

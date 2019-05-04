/** @module protopipe */

import {
  IMode,
  IExecutor,
  ISequence,
  IInput,
  IStack,
  IExecutorContext,
  IExecutorOutput,
} from './interface'

import Stack from './stack'
import {promisify} from './util'

type IExecutorContextExtended = IExecutorContext & {stack: IStack}

export const ASYNC: IMode = 'async'

export const findResult = (results: Array<IExecutorOutput>): IExecutorOutput => results.find((result) => result !== null)
export const updateSequence = (input: IInput, sequence: ISequence<any, any>): IInput => ({...input, meta: {...input.meta, sequence}})

const _process = (context: IExecutorContextExtended): IExecutorOutput => {
  const {input, graph, handler, traverser, stack} = context
  const isAsyncMode = context.input.meta.mode === ASYNC
  const paths = traverser({graph, sequence: input.meta.sequence})

  let next: IInput

  stack.push(input)

  if (isAsyncMode) {
    if (paths === null) {
      return promisify(null)
    }

    return Promise.all(paths.map((sequence: ISequence<any, any>) => {

      next = updateSequence(input, sequence)

      return promisify(handler(next))
        .then(res => _process({...context, stack, input: {...next, ...res}}))
    }))
      .then(findResult)
  }

  if (paths === null) {
    return null
  }

  return findResult(paths.map((sequence: ISequence<any, any>) => {
    next = updateSequence(input, sequence)
    next = {...next, ...handler(next)}

    return _process({...context, stack, input: next})
  }))
}

export const process: IExecutor = (context) => {
  const stack: IStack = new Stack()
  const _context: IExecutorContextExtended = {...context, stack}

  if (context.input.meta.mode === ASYNC) {
    return promisify(_process(_context)).then(extractResultFromStack.bind(null, stack))
  }

  _process(_context)

  return extractResultFromStack(stack)
}

export const extractResultFromStack = (stack: IStack) => ({...stack.pop(), stack})

export default process

/** @module protopipe */

import {
  IMode,
  IOutput,
  INil,
  IExecutor,
  IExecutorContext,
  ISequence, IInput,
} from './interface'

export const ASYNC: IMode = 'async'

export const promisify = (result: any): Promise<any> => Promise.resolve(result)

export const processSync = (context: IExecutorContext): IOutput | INil => {
  const {input, graph, handler, traverser} = context
  const paths = traverser({graph, sequence: input.meta.sequence})

  if (paths === null) {
    return input
  }

  return paths.map((sequence: ISequence<any, any>) => {
    let next
    next = {...input, meta: {...input.meta, sequence}}
    next = {...next, ...handler(next)}

    return processSync({...context, input: next})
  }).find((result) => result !== null)

}

export const processAsync = (context: IExecutorContext): Promise<IOutput | INil> => {

  const {input, graph, handler, traverser} = context
  const paths = traverser({graph, sequence: input.meta.sequence})

  if (paths === null) {
    return promisify(input)
  }

  return Promise.all(paths.map((sequence: ISequence<any, any>) => {

    const next: IInput = {...input, meta: {...input.meta, sequence}}

    return promisify(handler(next))
      .then(res => processAsync({...context, input: {...next, ...res}}))
  }))
    .then((results) => results.find((result) => result !== null))
}

export const process: IExecutor = (context) => {
  if (context.input.meta.mode === ASYNC) {
    return processAsync(context)
  }

  return processSync(context)
}

export default process

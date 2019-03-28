import {
  IInput,
  IOutput,
  ITraverserOutput,
  INil,
  IExecutor,
  IExecutorContext,
} from './interface'

export const ASYNC = 'async'

function promisify<T>(result: T): Promise<T> {
  return Promise.resolve(result)
}

export const processSync = ({meta, data, opts, graph, handler, traverser}: IExecutorContext): IOutput | INil => {
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

export const processAsync = async({meta, data, opts, graph, handler, traverser}: IExecutorContext): Promise<IOutput | INil> => {
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

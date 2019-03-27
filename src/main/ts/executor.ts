import {
  IProtopipeOpts,
  IInput,
  IOutput,
  ITraverserOutput,
  INil
} from './interface'

type IExecutorContext = IProtopipeOpts & IInput

export const ASYNC = 'async'

function promisify<T> (result: T): Promise<T> { return  Promise.resolve(result) }

export default class Executor {
  static process(context: IExecutorContext): IOutput | INil | Promise<IOutput | INil>{
    if (context.meta.mode === ASYNC) {
      return this.processAsync(context)
    }

    return this.processSync(context)
  }

  static processSync({meta, data, opts, graph, handler, traverser}: IExecutorContext): IOutput | INil {
    let hasNext = true
    let next: ITraverserOutput | INil
    let res: IOutput | INil = null
    let input: IInput = { opts, data, meta }

    while (hasNext) {
      next = traverser({graph, ...input, ...(res || {})})

      if (next === null) {
        hasNext = false
        return res
      }

      res = {...input, ...next, ...handler({...input, ...(res || {}), ...next})}
    }
  }

  static async processAsync({meta, data, opts, graph, handler, traverser}: IExecutorContext): Promise<IOutput | INil> {
    let hasNext = true
    let next: ITraverserOutput | INil
    let res: IOutput | INil = null
    let input: IInput = { opts, data, meta }

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
}

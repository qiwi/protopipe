import {
  IProtopipeOpts,
  IInput,
  IOutput,
  ITraverserOutput
} from './interface'

type IExecutorContext = IProtopipeOpts & IInput

export default class Executor {
  static process({meta, data, opts, graph, handler, traverser}: IExecutorContext): IOutput | null {
    let hasNext = true
    let next: ITraverserOutput | null
    let res: IOutput | null = null
    let input: IInput = { opts, data, meta }

    while(hasNext) {
      next = traverser({graph, ...input, ...(res || {})})

      if (next === null) {
        hasNext = false
        return res
      }

      res = {...input, ...next, ...handler({...input, ...next, ...(res || {})})}
    }

    return res
  }

  static promisify = (result: any): Promise<any> =>  Promise.resolve(result)
}

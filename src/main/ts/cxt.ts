import {ILibCxt} from './types'

export const DEFAULT_CONTEXT: ILibCxt = {
  Promise,
  logger: console,
}

export const cxt: ILibCxt = {...DEFAULT_CONTEXT}

export default cxt

import {
  IGraph,
  IVertex,
  IEdge,
} from '../graph/'

import {
  IAny,
  ITypedValue,
} from '../types'

export type IData = ITypedValue<'DATA', IAny>

export type IOpt = ITypedValue<'OPT', IAny>

export type IMeta = ITypedValue<'META', IAny>

export type IEvent = ITypedValue<'EVENT', {
  id?: string,
  name?: string,
  timestamp: number,
  ref?: IReference
}>

export type IAnyValue = ITypedValue<IAny, IAny>

export type IPointer = ITypedValue<'POINTER', {
  graph: IGraph,
  vertex?: IVertex,
  edge?: IEdge
}>

export type IReference = ITypedValue<IAny, {
  [key: string]: IAny,
  pointer: IPointer
}>

export type IRefReducer = (...refs: Array<IReference>) => IAny

export type IHandler = ITypedValue<'HANDLER', IRefReducer>

export type IHandlerRef = ITypedValue<'HANDLER_REF', {
  pointer: IPointer,
  handler: IHandler
}>

export type IMetaRef = ITypedValue<'META_REF', {
  pointer: IPointer,
  meta: IMeta
}>

export type IOptRef = ITypedValue<'OPT_REF', {
  pointer: IPointer,
  opt: IOpt
}>

export type IDataRef = ITypedValue<'DATA_REF', {
  pointer: IPointer,
  data: IData
}>

export type ISpace = ITypedValue<'SPACE', Array<IAnyValue>>

export type IWalker = (pointer: IPointer) => Array<IPointer>

export type IReducer = (space: ISpace, ...payload: IAny[]) => ISpace

export type ISpaceOperator = {
  space: ISpace
}

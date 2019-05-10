import {IGraph, IVertex, IEdge} from './interface'

export type IAny = any

export type IAnyMap = {
  [key: string]: IAny
}

export type ITypedValue<T, V> = {
  type: T,
  value: V
}

export type IData = ITypedValue<'DATA', IAny>

export type IOpt = ITypedValue<'OPT', IAny>

export type IMeta = ITypedValue<'META', IAny>

export type IEvent = ITypedValue<'EVENT', {
  id?: string,
  name?: string,
  timestamp: number,
  ref?: IReference
}>

export type IAnyValue = ITypedValue<string, IAny>

export type IPointer = ITypedValue<'POINTER', {
  graph: IGraph,
  vertex?: IVertex,
  edge?: IEdge
}>

export type IReference = ITypedValue<'REF', {
  pointer: IPointer,
  value: IAnyValue
}>

export type IHandler = ITypedValue<'HANDLER', (refs: Array<IReference>) => IDataRef>

export type IHandlerRef = ITypedValue<'HANDLER_REF', {
  pointer: IPointer,
  value: IHandler
}>

export type IMetaRef = ITypedValue<'META_REF', {
  pointer: IPointer,
  value: IMeta
}>

export type IOptRef = ITypedValue<'OPT_REF', {
  pointer: IPointer,
  value: IOpt
}>

export type IDataRef = ITypedValue<'DATA_REF', {
  pointer: IPointer,
  value: IData
}>

export type IState = ITypedValue<'STATE', Array<IAnyValue>>

export type IWalker = (pointer: IPointer) => Array<IPointer>

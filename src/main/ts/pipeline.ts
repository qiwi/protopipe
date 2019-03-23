import {
  IData,
  IPipe,
  IPipeline,
  IPipelineParams
} from './interface'

export default class Pipeline implements IPipeline {
  params: any
  constructor(params: IPipelineParams) {
    this.params = params
  }
  push(pipe: IPipe) {
    console.log(pipe)
    return this
  }
  exec(): IData {
  }
}

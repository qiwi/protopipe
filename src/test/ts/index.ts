import {Graph, Protopipe} from '../../main/ts'

describe('index', () => {
  it('exposes lib inners', () => {
    expect(Graph).toEqual(expect.any(Function))
    expect(Protopipe).toEqual(expect.any(Function))
  })
})

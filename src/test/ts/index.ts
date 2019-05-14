import {
  Graph,
  Extractor
} from '../../main/ts'

describe('index', () => {
  it('exposes lib inners', () => {
    expect(Graph).toEqual(expect.any(Function))
    expect(Extractor).toEqual(expect.any(Function))
  })
})

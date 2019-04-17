const {Graph, Protopipe} = require('../../../lib/es5')

describe('index', () => {
  it('exposes lib inners', () => {
    expect(Graph).toEqual(expect.any(Function))
    expect(Protopipe).toEqual(expect.any(Function))
  })
})

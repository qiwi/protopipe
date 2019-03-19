import lib from '../../main/ts'

describe('index', () => {
  it('exposes lib inners', () => {
    expect(lib).toBe('foo')
  })
})

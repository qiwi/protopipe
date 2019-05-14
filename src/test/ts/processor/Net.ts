import {NetProcessor} from '../../../main/ts'

describe('NetProcessor', () => {
  describe('constructor', () => {
    it('returns proper instance', () => {
      const netProcessor = new NetProcessor({})

      expect(netProcessor.space).toEqual({
        type: 'SPACE',
        value: []
      })
    })
  })

  // describe('proto', () => {})
  // describe('static', () => {})
})


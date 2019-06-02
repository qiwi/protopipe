import {genId} from '../../../main/ts/util'

describe('util', () => {
  describe('genId', () => {
    it('returns a new one id string', () => {
      expect(genId()).toMatch(/^\d\.\d*$/)
    })

    it('returns id with prefix', () => {
      expect(genId('foo')).toMatch(/^foo\d\.\d*$/)
    })
  })
})

import {
  Injector,
  ISpace
} from '../../../../main/ts/'

describe('Injector', () => {
  const space: ISpace = {
    type: 'SPACE',
    value: []
  }

  describe('constructor', () => {
    it('returns proper instance', () => {
      const extractor = new Injector(space)

      expect(extractor).toBeInstanceOf(Injector)
    })
  })

  // describe('proto', () => {})
  describe('static', () => {
    describe('#upsert', () => {
      it('injects an item if not found', () => {
        const item = {type: 'FOO', value: 'foo'}

        expect(Injector.upsert(({type}) => type === 'FOO', space, item)).toBe(item)
        expect(space.value[0]).toBe(item)
        expect(space.value.length).toBe(1)
      })

      it('updates found item otherwise', () => {
        const item = {type: 'FOO', value: 'bar'}

        expect(Injector.upsert(({type}) => type === 'FOO', space, item)).toEqual(item)
        expect(space.value[0]).toEqual(item)
        expect(space.value.length).toBe(1)

      })
    })
  })
})

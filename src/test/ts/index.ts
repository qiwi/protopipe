import {
  facade,
  Graph,
  RefOperator,
  NetProcessor,
} from '../../main/ts'

import {cxt, DEFAULT_CONTEXT} from '../../main/ts/cxt'

describe('index', () => {
  afterAll(() => facade.setConfig(DEFAULT_CONTEXT))

  describe('lib inners', () => {
    const constructors = [Graph, RefOperator, NetProcessor]

    constructors.forEach((Constructor) => {
      it(`${Constructor.name} is exposed`, () => {
        expect(Constructor).toEqual(expect.any(Function))
      })
    })
  })

  describe('is configurable:', () => {
    it('lets override Promise and logger implementations', () => {
      const Promise = {}
      const logger = {}
      const cfg = {Promise, logger}

      facade.setConfig(cfg)

      expect(cxt.Promise).toBe(Promise)
      expect(cxt.logger).toBe(logger)
      expect(facade.getConfig()).toEqual(cfg)
    })
  })
})

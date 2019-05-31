import {
  Graph,
  RefOperator,
  NetProcessor
} from '../../main/ts'

describe('index', () => {
  describe('lib inners', () => {
    const constructors = [Graph, RefOperator, NetProcessor]

    constructors.forEach((Constructor) => {
      it(`${Constructor.name} is exposed`, () => {
        expect(Constructor).toEqual(expect.any(Function))
      })
    })
  })
})

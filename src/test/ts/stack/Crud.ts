import {
  Stack,
  CrudStackOperator as Crud,
} from '../../../main/ts'

describe('CrudStackOperator', () => {
  const stack = new Stack()
  const crud = new Crud(stack)

  describe('constructor', () => {
    it('returns proper instance', () => {
      expect(crud).toBeInstanceOf(Crud)
    })
  })

  describe('static', () => {
    describe('create', () => {
      it('adds a new item to stack', () => {
        const item = {foo: 'bar'}

        expect(Crud.create(stack, item)).toBe(item)
      })
    })
  })

/*  describe('proto', () => {})

  describe('static', () => {})*/
})

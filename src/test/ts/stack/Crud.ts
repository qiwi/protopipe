/* eslint-disable sonarjs/no-duplicate-string */
import {
  CrudStackOperator as Crud,
  Stack,
} from '../../../main/ts'

describe('CrudStackOperator', () => {
  describe('constructor', () => {
    const stack = new Stack()
    it('returns proper instance', () => {
      expect(new Crud(stack)).toBeInstanceOf(Crud)
    })
  })

  describe('static', () => {
    const stack = new Stack()
    const item = { foo: 'bar' }

    describe('create', () => {
      it('adds a new item to stack', () => {
        expect(Crud.create(stack, item)).toBe(item)
      })
    })

    describe('read', () => {
      it('returns values filteres predicate', () => {
        Crud.create(stack, item)
        expect(Crud.read(stack, item => item.foo === 'bar')).toEqual([{ foo: 'bar' }, { foo: 'bar' }])
      })

      it('reads with limit', () => {
        expect(Crud.read(stack, () => true, 1)).toEqual([{ foo: 'bar' }])
      })

      it('returns empty collection if no match found', () => {
        expect(Crud.read(stack, () => false)).toEqual([])
        expect(Crud.read(stack, () => false, 1)).toEqual([])
      })
    })

    describe('update', () => {
      const modified = { foo: 'qux' }

      it('modifies matched entry by predicate', () => {
        expect(Crud.update(stack, () => true, modified)).toBe(modified)
      })

      it('returns undefined if no match found', () => {
        expect(Crud.update(stack, () => false, modified)).toBeUndefined()
      })

      it('supports upsert flow', () => {
        expect(Crud.update(stack, () => false, modified, true)).toBe(modified)
      })
    })

    describe('del', () => {
      it('removes all matched items', () => {
        expect(Crud.del(stack, item => item.foo === 'qux')).toEqual([{ foo: 'qux' }, { foo: 'qux' }])
      })

      it('returns empty collection if no match found', () => {
        expect(Crud.del(stack, () => false)).toEqual([])
      })
    })
  })

  describe('proto', () => {
    const stack = new Stack()
    const crud = new Crud(stack)
    const item = { foo: 'bar' }

    describe('create', () => {
      it('adds a new item to stack', () => {
        expect(crud.create(item)).toBe(item)
      })
    })

    describe('read', () => {
      it('returns values filteres predicate', () => {
        crud.create(item)
        expect(crud.read(item => item.foo === 'bar')).toEqual([{ foo: 'bar' }, { foo: 'bar' }])
      })

      it('reads with limit', () => {
        expect(crud.read(() => true, 1)).toEqual([{ foo: 'bar' }])
      })

      it('returns empty collection if no match found', () => {
        expect(crud.read(() => false)).toEqual([])
        expect(crud.read(() => false, 1)).toEqual([])
      })
    })

    describe('update', () => {
      const modified = { foo: 'qux' }

      it('modifies matched entry by predicate', () => {
        expect(crud.update(() => true, modified)).toBe(modified)
      })

      it('returns undefined if no match found', () => {
        expect(crud.update(() => false, modified)).toBeUndefined()
      })

      it('supports upsert flow', () => {
        expect(crud.update(() => false, modified, true)).toBe(modified)
      })
    })

    describe('del', () => {
      it('removes all matched items', () => {
        expect(crud.del(item => item.foo === 'qux')).toEqual([{ foo: 'qux' }, { foo: 'qux' }])
      })

      it('returns empty collection if no match found', () => {
        expect(crud.del(() => false)).toEqual([])
      })
    })
  })

})

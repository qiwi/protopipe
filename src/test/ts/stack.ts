import Stack from '../../main/ts/stack'

describe('stack', () => {
  describe('constructor', () => {
    it('returns proper instance', () => {
      const stack = new Stack()

      expect(stack).toBeInstanceOf(Stack)
    })
  })

  describe('proto', () => {
    const stack = new Stack()

    describe('#push', () => {
      it('push adds new item to stack', () => {
        const foo = 'bar'

        expect(stack.push(foo)).toBe('bar')
      })

      it('appends sevaral items and returns the lasr', () => {
        expect(stack.push('baz', 'qux')).toBe('qux')
      })
    })

    describe('#get', () => {
      it('gets item by index', () => {
        expect(stack.get(0)).toBe('bar')
      })

      it('gets undefined if not found', () => {
        expect(stack.get(1000)).toBeUndefined()
      })
    })

    describe('#filter', () => {
      it('returns items corresponding the predicate', () => {
        expect(stack.filter(() => true)).toEqual(['bar', 'baz', 'qux'])
      })

      it('returns empty array if no element found', () => {
        expect(stack.filter(() => false)).toEqual([])
      })
    })

    describe('#shift', () => {
      it('returns the first stack item', () => {
        expect(stack.shift()).toBe('bar')
        expect(stack.get(0)).toBe('baz')
      })
    })

    describe('#pop', () => {
      it('returns the last stack item', () => {
        expect(stack.pop()).toBe('qux')
      })
    })

    describe('#size', () => {
      it('returns current stack size', () => {
        expect(stack.size()).toBe(1)
      })
    })
  })
})

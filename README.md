# protopipe
Lambda-based data pipeliner

## Install
```bash
  yarn add protopipe
```

## Usage
```javascript
import Pipeline from 'protopipe'

const handler = ({data, meta, opts}) => ({data: data[opts.method]()})

const pipeline = new Pipeline({
  pipeline: [handler],
  meta: {},
  opts: {
    method: 'toUpperCase'
  }
})

const result = pipeline({data: 'foo'}) // 'FOO'
```

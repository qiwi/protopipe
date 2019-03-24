# protopipe
Graph-based data processor.

## Idea
We often come across the problem of atomic data processing ([logwrap](https://github.com/qiwi/logwrap), [uniconfig](https://github.com/qiwi/uniconfig), [cyclone](https://github.com/qiwi/cyclone), etc), it seems to be useful to make the _one pipeline to rule them all_.
Not universal, not high-performance. But dumb and clear.  

##### Features
* Sync / async execution modes
* Sequence parser customization (a strange thing that produces graphs)
* Configurable `Promise`
* Typings for both worlds — TS and flow

##### Limitations
* The lib does not solve the declaration problem (you know, _adjacency matrix_, _adjacency list_, DSL).
* No consistency checks out of box: _graph_ is being executed as is. But you're able to add custom assertion through `verify` opt (for example, BFS-based check)

## Contract
* `handler` — lambda-function, which implements [`IHandler`](./src/main/ts/interface.ts) iface: gets only argument and
* `pipe` is an executable segment of pipeline, edge joining two vertices.

## Install
```bash
  yarn add protopipe
```

## Usage
```javascript
import { Pipeline } from 'protopipe'

const handler = ({data, meta, opts}) => ({data: data[opts.method]()})

const pipeline = new Pipeline({
  pipeline: [handler],
  meta: {},
  opts: {
    method: 'toUpperCase'
  }
})

const result = pipeline.exec({data: 'foo'}) // 'FOO'
```

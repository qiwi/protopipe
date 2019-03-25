# protopipe
Graph-based data processor.

## Idea
We often come across the problem of atomic data processing ([logwrap](https://github.com/qiwi/logwrap), [uniconfig](https://github.com/qiwi/uniconfig), [cyclone](https://github.com/qiwi/cyclone), etc), it seems to be useful to make the _one pipeline to rule them all_.
Not universal, not high-performance. But dumb and clear.  

##### Features
* Sync / async execution modes.
* Sequence parser customization (a strange thing that produces graphs).
* Configurable `Promise`.
* Typings for both worlds — TS and flow.

##### Limitations
* Protopipe supports digraphs only.
* Graph has only one `source` and one `target` vertexes.
* The lib does not solve the declaration problem (you know, _adjacency/incidence matrix_, _adjacency list_, DSL).
* No consistency checks out of box: _graph_ is being executed as is. But you're able to add custom assertion through `verify` opt (for example, BFS-based check).

## Definitions and contracts
* Vertex is a graph atom.
* Edge — bond connecting two vertices.
* Arrow — directed edge.
* Sequence — any possible transition.
    * Walk: vertices may repeat, edges may repeat (closed / open)
    * Trail: vertices may repeat, edges cannot repeat (open)
    * Circuit: vertices may repeat, edges cannot repeat (closed)
    * Path: vertices cannot repeat, edges cannot repeat (open)
    * Cycle : vertices cannot repeat, edges cannot repeat (closed)
* Pipe is an executable segment of pipeline, any directed sequence with attached handler(s)
* Handler — lambda-function, which implements [`IHandler`](./src/main/ts/interface.ts) iface.
* Graph — a class that implements [`IGraph`](./src/main/ts/interface.ts) — stores vertexes and arrows collections.

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

# protopipe
Graph-based data processor.

## Idea
We often come across the problem of atomic data processing ([logwrap](https://github.com/qiwi/logwrap), [uniconfig](https://github.com/qiwi/uniconfig), [cyclone](https://github.com/qiwi/cyclone), etc), and it seems to be useful to make the _one pipeline to rule them all_.
Not universal, not high-performance. But dumb and clear.

## TL;DR
#### Install
```bash
  yarn add protopipe
```

#### Usage
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

##### Features
* Sync / async execution modes.
* Deep customization.
* Typings for both worlds — TS and flow.

##### Limitations (of default executor, traverser, etc)
* Protopipe supports digraphs only.
* Graphs are immutable.
* Graph has only one `source` and one `target` vertexes.
* The lib does not solve the declaration problem (you know, _adjacency/incidence matrix_, _adjacency list_, DSL).
* No consistency checks out of box: _graph_ is being traversed as is. But you're able to add custom assertions (for example, BFS-based check).

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

### Protopipe
The fundamental goal of Protopipe is data processing.
```javascript
export interface IProtopipe {
  graph: IGraph
  handler: IHandler
  traverser: ITraverser
  executor: IExecutor
  process: (input: IInput) => IOutput
}
```

`graph` defines the all variety of available states.  
`traverseur` interprets graph rules to build possible path, step by step.  
`handler` is invoked each time when vertex transition occurs (`meta.sequence` change).  
`executor` binds it all together.  
`process` — the data processing starting point.

The `executor` gets an `input`, then triggers `traverser` to resolve next over the `graph` processing step, after invokes the `handler(input)` and passes its result to further iteration. Once `traverser` returns null the process stops.

Everything _should_ be stateless and immutable, but it is up to you.

### Single argument contract


##### Meta
Contains any reasonable execution directives such as `mode`, `sequence`
```javascript
{
  sequence: ISequence
  mode?: IMode,
  [key: string]: IAny
}
```

### Sync / async
Both. If handler returns a Promise then executor awaits until it will be resolved.

### Customization
You're able to override everything.

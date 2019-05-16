# protopipe

[![buildStatus](https://img.shields.io/travis/com/qiwi/protopipe.svg?maxAge=3600&branch=master)](https://travis-ci.com/qiwi/protopipe)
[![npm (tag)](https://img.shields.io/npm/v/protopipe/latest.svg)](https://www.npmjs.com/package/protopipe)
[![dependencyStatus](https://img.shields.io/david/qiwi/protopipe.svg?maxAge=3600)](https://david-dm.org/qiwi/protopipe)
[![devDependencyStatus](https://img.shields.io/david/dev/qiwi/protopipe.svg?maxAge=3600)](https://david-dm.org/qiwi/protopipe)
[![Maintainability](https://api.codeclimate.com/v1/badges/c92ca2ab30d16e8cdec7/maintainability)](https://codeclimate.com/github/qiwi/protopipe/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/c92ca2ab30d16e8cdec7/test_coverage)](https://codeclimate.com/github/qiwi/protopipe/test_coverage)

Graph-driven data processor. [qiwi.github.io/protopipe](https://qiwi.github.io/protopipe/)

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
import { NetProcessor, Extractor, IDataRef, ISpace } from 'protopipe'

const graph = new Graph({
  edges: ['AB', 'BC'],
  vertexes: ['A', 'B', 'C'],
  incidentor: {
    type: 'EDGE_LIST_INCDR',
    value: {
      'AB': ['A', 'B'],
      'BC': ['B', 'C']
    },
  },
})
const handler = (prev: IDataRef): IAny => prev.value.value * 2
const protopipe = new NetProcessor({
  graph,
  handler,
})
const space: ISpace = protopipe.impact(true, 'A', 1)
const dVertexDataRef: IDataRef = space.value[space.value.length - 1]

const val = dVertexDataRef.value.value // 4
```

##### Features
* Sync / async execution modes.
* Stateful an stateless contracts.
* Deep customization.
* Typings for both worlds — TS and flow.

##### Limitations (of default executor, traverser, etc)
* Protopipe supports digraphs only.
* The lib does not solve the declaration problem (you know, _adjacency/incidence matrix_, _adjacency list_, DSL).
* No consistency checks out of box: graph is being processed as is. But you're able to add custom assertions (for example, BFS-based check).

## Definitions and contracts
* Space is a set with some added structure.
* Vertex is a graph atom.
* Edge — bond.
* Incidentor — the _rule_ of connecting vertexes and edges.
* Graph — a class that implements [`IGraph`](./src/main/ts/types.ts) — stores vertexes and edges collections, features and incidentor.
* Sequence — any possible transition.
    * Walk: vertices may repeat, edges may repeat (closed / open)
    * Trail: vertices may repeat, edges cannot repeat (open)
    * Circuit: vertices may repeat, edges cannot repeat (closed)
    * Path: vertices cannot repeat, edges cannot repeat (open)
    * Cycle : vertices cannot repeat, edges cannot repeat (closed)
* Pipe is an executable segment of pipeline, any directed sequence with attached handler(s)
* Handler — lambda-function, which implements [`IHandler`](./src/main/ts/interface.ts) iface.

### IGraph
```javascript
export type IGraph = {
  vertexes: Array<IVertex>,
  edges: Array<IEdge>,
  incidentor: IGraphIncidentor
}

export type IGraphRepresentation = any

export type IGraphIncidentor = {
  type: IGraphIncidentorType,
  value: IGraphRepresentation
}
```

### Sync / async
Both. Pass `mode` flag as a part of `input.meta`. If handler returns a Promise then executor awaits until it will be resolved.
```javascript
const input = {
  data: 'foo',
  meta: {
    sequence: {type: 'chain', data: []},
    mode: 'ASYNC'
  },
  opts: {}
}
```

### Customization
You're able to override everything.

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
import {Graph, IAny, ISpace, NetProcessor} from 'protopipe'

const graph = new Graph({
  edges: ['AB', 'BC'],
  vertexes: ['A', 'B', 'C'],
  incidentor: {
    type: 'EDGE_LIST_INCDR',
    value: {
      'AB': ['A', 'B'],
      'BC': ['B', 'C'],
    },
  },
})
const handler = {
  // Default handler
  graph: (space: ISpace): IAny => (NetProcessor.getData(space) || {value: 0}).value * 2,
  // Vertex specific handlers
  vertexes: {
    'B': (space: ISpace): IAny => (NetProcessor.getData(space, 'A') || {value: 10}).value * 3,
  },
}
const protopipe = new NetProcessor({
  graph,
  handler,
})
const space = protopipe.impact(true, ['A', 1]) as ISpace

console.log(NetProcessor.getData(space, 'C').value) // 6
```

##### Features
* Sync / async execution modes.
* Stateful and stateless contracts.
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
Pass `mode` flag as the first `.impact()` argument to get result or promise.

```javascript
const graph = new Graph({
  edges: ['AB', 'AC', 'BC', 'BD', 'CD', 'AD'],
  vertexes: ['A', 'B', 'C', 'D'],
  incidentor: {
    type: 'EDGE_LIST_INCDR',
    value: {
      'AB': ['A', 'B'],
      'AC': ['A', 'C'],
      'BC': ['B', 'C'],
      'BD': ['B', 'D'],
      'CD': ['C', 'D'],
      'AD': ['A', 'D'],
    },
  },
})
const handler = (space: ISpace) => NetProcessor.requireElt('ANCHOR', space).value.vertex
const netProcessor = new NetProcessor({graph, handler})

// SYNC
const res1 = netProcessor.impact(true,'A') as ISpace 
NetProcessor.getData(res1, 'D') // 'D'

// ASYNC
netProcessor.impact(false,'A').then((res) => {
  NetProcessor.getData(res, 'D') // 'D'
})
```

### Customization
You're able to override everything.

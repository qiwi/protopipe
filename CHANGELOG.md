## [2.2.6](https://github.com/qiwi/protopipe/compare/v2.2.5...v2.2.6) (2019-11-01)


### Performance Improvements

* **package:** up deps & tech release ([6bbff11](https://github.com/qiwi/protopipe/commit/6bbff11))

## [2.2.5](https://github.com/qiwi/protopipe/compare/v2.2.4...v2.2.5) (2019-10-15)


### Performance Improvements

* **package:** up deps and repack ([2ab183c](https://github.com/qiwi/protopipe/commit/2ab183c))

## [2.2.4](https://github.com/qiwi/protopipe/compare/v2.2.3...v2.2.4) (2019-07-15)


### Bug Fixes

* **package:** fix nested vulnerabilities ([7d4f460](https://github.com/qiwi/protopipe/commit/7d4f460))

## [2.2.3](https://github.com/qiwi/protopipe/compare/v2.2.2...v2.2.3) (2019-07-11)


### Bug Fixes

* **package:** fix missed dep ([2733933](https://github.com/qiwi/protopipe/commit/2733933))

## [2.2.2](https://github.com/qiwi/protopipe/compare/v2.2.1...v2.2.2) (2019-07-11)


### Performance Improvements

* pack as bundle ([3c4e29a](https://github.com/qiwi/protopipe/commit/3c4e29a))

## [2.2.1](https://github.com/qiwi/protopipe/compare/v2.2.0...v2.2.1) (2019-07-10)


### Performance Improvements

* uglify published files ([594df30](https://github.com/qiwi/protopipe/commit/594df30))

# [2.2.0](https://github.com/qiwi/protopipe/compare/v2.1.2...v2.2.0) (2019-07-09)


### Features

* provide Promise and logger customization ([cf36457](https://github.com/qiwi/protopipe/commit/cf36457)), closes [#1](https://github.com/qiwi/protopipe/issues/1) [#2](https://github.com/qiwi/protopipe/issues/2)

## [2.1.2](https://github.com/qiwi/protopipe/compare/v2.1.1...v2.1.2) (2019-06-11)


### Bug Fixes

* **package:** up deps, fix some vulnerabilities ([bb0549e](https://github.com/qiwi/protopipe/commit/bb0549e))

## [2.1.1](https://github.com/qiwi/protopipe/compare/v2.1.0...v2.1.1) (2019-05-31)


### Bug Fixes

* **CrudOperator:** repair default #update reducer ([b2de48a](https://github.com/qiwi/protopipe/commit/b2de48a))

# [2.1.0](https://github.com/qiwi/protopipe/compare/v2.0.1...v2.1.0) (2019-05-17)


### Features

* **Net:** add vertex specific handlers support ([1821cac](https://github.com/qiwi/protopipe/commit/1821cac))

## [2.0.1](https://github.com/qiwi/protopipe/compare/v2.0.0...v2.0.1) (2019-05-16)


### Bug Fixes

* **Net:** do not override edge data after the inject ([86bc1e6](https://github.com/qiwi/protopipe/commit/86bc1e6))

# [2.0.0](https://github.com/qiwi/protopipe/compare/v1.2.0...v2.0.0) (2019-05-15)


### Bug Fixes

* **Injector:** correct upsert flow ([0ddf235](https://github.com/qiwi/protopipe/commit/0ddf235))
* linting ([08c4f88](https://github.com/qiwi/protopipe/commit/08c4f88))


### Features

* **NetProcessor:** support async flow ([a4ea1d0](https://github.com/qiwi/protopipe/commit/a4ea1d0))
* add Net processor ([eca08c3](https://github.com/qiwi/protopipe/commit/eca08c3)), closes [#25](https://github.com/qiwi/protopipe/issues/25) [#24](https://github.com/qiwi/protopipe/issues/24) [#22](https://github.com/qiwi/protopipe/issues/22) [#21](https://github.com/qiwi/protopipe/issues/21) [#11](https://github.com/qiwi/protopipe/issues/11)


### BREAKING CHANGES

* introduce completely new API

# [1.2.0](https://github.com/qiwi/protopipe/compare/v1.1.0...v1.2.0) (2019-04-30)


### Features

* **executor:** mixin stack data to result ([301d861](https://github.com/qiwi/protopipe/commit/301d861)), closes [#19](https://github.com/qiwi/protopipe/issues/19)


### Performance Improvements

* **executor:** optimize stack injection ([ad308ac](https://github.com/qiwi/protopipe/commit/ad308ac))

# [1.1.0](https://github.com/qiwi/protopipe/compare/v1.0.1...v1.1.0) (2019-04-18)


### Features

* allow executor to split and merge data streams ([4dfc9f0](https://github.com/qiwi/protopipe/commit/4dfc9f0)), closes [#4](https://github.com/qiwi/protopipe/issues/4) [#5](https://github.com/qiwi/protopipe/issues/5)

## [1.0.1](https://github.com/qiwi/protopipe/compare/v1.0.0...v1.0.1) (2019-04-17)


### Performance Improvements

* **package:** exclude src from published package ([4ad1977](https://github.com/qiwi/protopipe/commit/4ad1977))

# 1.0.0 (2019-04-17)


### Bug Fixes

* **package:** add missed tslib ([a810770](https://github.com/qiwi/protopipe/commit/a810770))


### Features

* **executor:** support both sync / async execution modes ([36a4912](https://github.com/qiwi/protopipe/commit/36a4912)), closes [#10](https://github.com/qiwi/protopipe/issues/10)
* **protopipe:** add default traverser, handler & parser impls ([43c977a](https://github.com/qiwi/protopipe/commit/43c977a))
* add configurable parser ([77217a6](https://github.com/qiwi/protopipe/commit/77217a6)), closes [#15](https://github.com/qiwi/protopipe/issues/15)
* add default executor ([dbd8a92](https://github.com/qiwi/protopipe/commit/dbd8a92))
* add Graph class ([068220f](https://github.com/qiwi/protopipe/commit/068220f)), closes [#9](https://github.com/qiwi/protopipe/issues/9)
* add Protopipe class 🎉 ([e2b02a5](https://github.com/qiwi/protopipe/commit/e2b02a5))
* expose graph features ([18a5620](https://github.com/qiwi/protopipe/commit/18a5620)), closes [#17](https://github.com/qiwi/protopipe/issues/17)
* introduce IGraphOperator iface ([f872196](https://github.com/qiwi/protopipe/commit/f872196))

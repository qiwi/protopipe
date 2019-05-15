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

/** @module protopipe */

import {IConfigurable} from './types'
import cxt from './cxt'

export * from './types'
export * from './graph'
export * from './space'
export * from './processor'
export * from './stack'

export const facade: IConfigurable = {
  getConfig() {
    return cxt
  },

  setConfig(config: Object) {
    Object.assign(cxt, config)
  },
}

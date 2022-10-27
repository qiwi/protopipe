/** @module protopipe */

import cxt from './cxt'
import {IConfigurable} from './types'

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

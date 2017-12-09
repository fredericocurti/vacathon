import auth from './auth'
import _ from 'lodash'
import moment from 'moment'
import {EventEmitter} from 'events'

// This file handles data manipulation

let locale = require('moment/locale/pt-br')
const baseUrl = 'http://localhost:8080/'
const emitter = new EventEmitter()
emitter.setMaxListeners(20)

var store = {
  notes: {}
}

export default window.store = {
  subscribe: (storeName, callback) => {
    emitter.addListener(`${storeName}_update`, callback)
  },

  unsubscribe: (storeName, callback) => {
    emitter.removeListener(`${storeName}_update`, callback)
  },

  getStore: () => {
    return store
  }

}

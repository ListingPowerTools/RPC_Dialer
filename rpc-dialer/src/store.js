import {
  createStore,
  applyMiddleware
} from 'redux'

import thunk from 'redux-thunk'
import rootReducer from './store/reducers'

const store = applyMiddleware(thunk)(createStore)(rootReducer)

export default store
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

const initialWorkerState = {
  activity: 'Offline',
  available_activities: [
    'Offline',
    'Available',
    'Unavailable',
    'Break'
  ]
}

const store = applyMiddleware(thunk)(createStore)(combineReducers({
  worker: modelReducer('worker', initialWorkerState)
}))
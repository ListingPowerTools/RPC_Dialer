import { combineReducers } from 'redux'
import DialpadReducer from './DialpadReducer'

export default combineReducers({
  dialpad: DialpadReducer
})
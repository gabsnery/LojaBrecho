import { combineReducers } from "redux";

import thriftStore from './thriftStore'
import authentication from './authentication'
import snackBar from './snackBar'

export default combineReducers({thriftStore,authentication,snackBar})
import { combineReducers } from "redux";

import thriftStore from './thriftStore'
import authentication from './authentication'

export default combineReducers({thriftStore,authentication})
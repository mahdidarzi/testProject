import { createStore, combineReducers,applyMiddleware } from "redux";
import usersReducer from "../users/usersReducer";
//i use of logger to log redux change and analyze easy
import logger from 'redux-logger'

const reducers = combineReducers({
  usersReducer: usersReducer,
});

const store = createStore(reducers, applyMiddleware(logger));

export default store;
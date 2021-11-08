import { createStore, combineReducers,applyMiddleware } from "redux";
import usersReducer from "../users/usersReducer";
import logger from 'redux-logger'

/* reducers list */

const reducers = combineReducers({
  usersReducer: usersReducer,
});

const store = createStore(reducers, applyMiddleware(logger));

export default store;

// import { combineReducers, createStore, applyMiddleware } from "redux";
// import { persistStore } from 'redux-persist';
// import MainReducer from '../reducers/main';
// import logger from 'redux-logger'
// const isClient = typeof window !== 'undefined';
// const { persistReducer } = require('redux-persist');
// // import storage from './storage'
// import storage from 'redux-persist/lib/storage';
// import examReducer from "../exam/examReducer";
// import organizationalReducer from "../organizational/organizationalReducer";
// import globalReducer from '../globalReducer';
// // if (isClient) {
//   // const storage = require('redux-persist/lib/storage').default;
// // }

// const reducers = combineReducers({
//     main: MainReducer,
//     examReducer: examReducer,
//     globalReducer:globalReducer,
//     organizationalReducer:organizationalReducer
// })
// const persistConfig = {
//   key: 'root',
//   storage,
//   whitelist: ["MainReducer"]
// };
// // const store = createStore(reducers);
// const store = createStore(
//   persistReducer(persistConfig, reducers),
//     applyMiddleware(logger),
// )
// export const persistor = persistStore(store);
// export default store;

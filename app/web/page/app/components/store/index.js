import { createStore, applyMiddleware, combineReducers } from 'redux';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga'
import reducers from './reducers';
import rootSaga from './sagas';

export const create = initalState => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(reducers, initalState, applyMiddleware(sagaMiddleware))
  sagaMiddleware.run(rootSaga);
  return store;
};

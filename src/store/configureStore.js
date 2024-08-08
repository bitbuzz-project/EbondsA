import { createStore, compose, applyMiddleware } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import createReduxWaitForMiddleware from 'redux-wait-for-action';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import rootReducer from '../reducers';
import sagas from '../sagas';

import scrollMiddleware from './middlewares/scrollMiddleware';
import patchReduxWaitForMiddleware from './middlewares/patchReduxWaitForMiddleware';
import logger from './middlewares/logger';

export const history = require('history').createBrowserHistory();

const persistConfig = {
    key: 'rt',
    storage,
    whitelist: [],
};
const persistedReducer = persistReducer(persistConfig, rootReducer(history));

const composeEnhancers =
    process.env.NODE_ENV === 'production'
        ? compose
        : window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = initialState => {
    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [
        sagaMiddleware,
        patchReduxWaitForMiddleware,
        createReduxWaitForMiddleware(),
        scrollMiddleware,
        routerMiddleware(history),
        logger,
    ];

    const store = createStore(
        connectRouter(history)(persistedReducer),
        initialState,
        composeEnhancers(applyMiddleware(...middlewares))
    );

    const persistor = persistStore(store);

    sagaMiddleware.run(sagas);

    return { store, persistor };
};

export default configureStore;

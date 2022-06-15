var redux = require('redux');
var thunk = require('redux-thunk').default;
//var createLogger = require('redux-logger').createLogger;
var createSagaMiddleware = require('redux-saga').default;

var createStore = redux.createStore;
var applyMiddleware = redux.applyMiddleware;
var bindActionCreators = redux.bindActionCreators;

//var loggerMiddleware = createLogger();
var sagaMiddleware = createSagaMiddleware();
var middlewares = [thunk];

//middlewares.push(loggerMiddleware);

middlewares.push(sagaMiddleware);

var createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

module.exports = {
    createStoreWithMiddleware: createStoreWithMiddleware,
    sagaMiddleware: sagaMiddleware,
    createAction: function(action, dispatch){
        return bindActionCreators(action, dispatch);
    }
};
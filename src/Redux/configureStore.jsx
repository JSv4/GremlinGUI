import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducers'

//import { createLogger } from 'redux-logger'
//const loggerMiddleware = createLogger()
// add this as arg to "applyMiddleware" to turn logging back on: , loggerMiddleware
// you can make this smarter so it only logs in development by using this example code: https://reactnativeforyou.com/how-to-remove-logs-of-redux-logger-in-production/

export default function configureStore(preloadedState) {
  
  return createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(thunkMiddleware)
  )
}


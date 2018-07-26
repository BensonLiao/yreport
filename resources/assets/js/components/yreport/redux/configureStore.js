import {createStore} from 'redux'
import rootReducer, {initialState} from './reducers'

const configureStore = () => {
  const store = createStore(
    rootReducer,
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )

  return store
}

export default configureStore

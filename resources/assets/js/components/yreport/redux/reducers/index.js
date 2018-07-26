import {combineReducers} from 'redux-immutable'
import {fromJS} from 'immutable'
import text from './text'
import colors from './colors'
import hover from './hover'
import tick from './tick'
import renderCount from './renderCount'
import theme from './theme'

const testText = 'asjoiinpnasdasv aao';
export const initialState = fromJS({
  text: {},
  colors: {
    user1: 'blue',
    user2: 'orange'
  },
  hover: null,
  tick: 10,
  renderCount: {},
  theme: 'dark'
})

const rootReducer = combineReducers(
  {text, colors, hover, tick, renderCount, theme},
  initialState
)

export default rootReducer

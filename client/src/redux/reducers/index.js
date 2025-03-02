import { combineReducers } from 'redux';
import gameReducer from './gameReducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
    game: gameReducer,
    user: userReducer,
});

export default rootReducer;
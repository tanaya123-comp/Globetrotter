import { SET_USER_NAME, SET_CURRENT_SCORE, UPDATE_SCORE } from '../actions/gameActions';

const initialState = {
    userName: null,
    currentScore: 0,
};

const gameReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_NAME:
            return { ...state, userName: action.payload };
        case SET_CURRENT_SCORE:
            return { ...state, currentScore: action.payload };
        case UPDATE_SCORE:
            return { ...state, currentScore: state.currentScore + action.payload };
        default:
            return state;
    }
};

export default gameReducer;
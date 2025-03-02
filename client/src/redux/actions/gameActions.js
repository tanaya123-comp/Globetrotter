// Action Types
export const SET_USER_NAME = 'SET_USER_NAME';
export const SET_CURRENT_SCORE = 'SET_CURRENT_SCORE';
export const UPDATE_SCORE = 'UPDATE_SCORE';

// Action Creators
export const setUserName = (userName) => ({
    type: SET_USER_NAME,
    payload: userName,
});

export const setCurrentScore = (score) => ({
    type: SET_CURRENT_SCORE,
    payload: score,
});

export const updateScore = (isCorrect) => ({
    type: UPDATE_SCORE,
    payload: isCorrect ? 4 : -1, // +4 for correct, -1 for incorrect
});

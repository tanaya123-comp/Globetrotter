// Action Types
export const SET_USER_NAME = 'SET_USER_NAME';

// Action Creators
export const setUserName = (username) => ({
    type: SET_USER_NAME,
    payload: username,
});

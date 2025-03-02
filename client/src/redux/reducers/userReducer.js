import { SET_USER_NAME } from '../actions/userActions';

const initialState = {
    username: '',  // Only store username
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_NAME:
            return { ...state, username: action.payload };
        default:
            return state;
    }
};

export default userReducer;
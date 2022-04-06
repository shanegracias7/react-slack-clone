import * as actionTypes from './types';

export const setUsers = user => {
    return {
        type: actionTypes.SET_USER,
        payload : {
            currentUser: user
        }
    }
} 
import * as actionTypes from './types';

export const setUsers = user => {
    return {
        type: actionTypes.SET_USER,
        payload : {
            currentUser: user
        }
    }
} 

export const clearUser = () =>{
    return{
        type:actionTypes.CLEAR_USER
    }
}
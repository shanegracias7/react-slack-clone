import * as actionTypes from './types';

//USER ACTION
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


//CHANNEL ACTION
export const setCurrentChannel = channel =>{
    return{
        type:actionTypes.SET_CURRENT_CHANNEL,
        payload:{
            currentChannel: channel
        }
    }
}
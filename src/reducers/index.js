import * as actionTypes from '../actions/types';
import { combineReducers } from 'redux';


const initialState = {
    currentUser : null,
    isLoading : true,
    userPost:null
}

const  user_reducer = (state = initialState ,action) => {
    switch(action.type){
        case actionTypes.SET_USER : 
            return{
                currentUser : action.payload.currentUser,
                isLoading : false
            }

        case actionTypes.CLEAR_USER :
            return{
                ...state,
                isLoading : false
            }
        
        
        default: return state;
    }

}

//channel reducer

const initialChannelState = {
    currentChannel:null,
    isPrivateChannel : false
}

const channel_reducer=(state= initialChannelState, action)=>{
    switch(action.type){
        case actionTypes.SET_CURRENT_CHANNEL:
            return{
                ...state,
                currentChannel:action.payload.currentChannel
            }
        case actionTypes.SET_PRIVATE_CHANNEL:
            return{
                ...state,
                isPrivateChannel:action.payload.isPrivateChannel
            }

        case actionTypes.SET_USER_POST:
            return{
                ...state,
                userPosts:action.payload.userPosts
            }
        default:
            return state;
    }
    
}

const rootReducer = combineReducers({
    user: user_reducer,
    channel:channel_reducer
});

export default rootReducer;
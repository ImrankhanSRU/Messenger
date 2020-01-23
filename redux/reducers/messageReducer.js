import {
    FETCH_MESSAGES_PENDING, FETCH_MESSAGES_SUCCESS, FETCH_MESSAGES_ERROR,
    FETCH_GROUP_MESSAGES_ERROR, FETCH_GROUP_MESSAGES_SUCCESS,
    FETCH_MESSAGES_COUNT_PENDING, FETCH_MESSAGES_COUNT_ERROR, FETCH_MESSAGES_COUNT_SUCCESS,
    ADD_PRIVATE_MESSAGE_SUCCESS, ADD_GROUP_MESSAGE_SUCCESS
} from '../constants/constants';

const initialState = {
    pending: false,
    messages: [],
    groupMessages: [],
}

export function messageReducer(state = initialState, action) {
    switch (action.type) {

        case FETCH_MESSAGES_SUCCESS:
            return {
                ...state,
                pending: false,
                messages: action.messages
            }
        case FETCH_MESSAGES_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }

        case FETCH_GROUP_MESSAGES_SUCCESS:
            return {
                ...state,
                pending: false,
                groupMessages: action.messages
            }
        case FETCH_GROUP_MESSAGES_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }


        case FETCH_MESSAGES_COUNT_SUCCESS:
            return {
                ...state,
                pending: false,
                counts: action.counts
            }
        case FETCH_MESSAGES_COUNT_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }

        case ADD_PRIVATE_MESSAGE_SUCCESS:
            let messages = { ...state.messages }
            if (Object.keys(messages[0][action.message.sender]).includes("Today")) {
                messages[0][action.message.sender]["Today"].push(action.message)
            }
            else {
                // messages[0] = {
                //     "1": {"Today": [], "1263721": []},
                //     "2": {"yes": [], "2323": []}
                // }

                let newObj = { "Today": [action.message], ...messages[0][action.message.sender] }
                messages[0][action.message.sender] = newObj
                // console.log(messages)
            }

            return {
                ...state,
                pending: false,
                messages
            }

        case ADD_GROUP_MESSAGE_SUCCESS:
            let groupMessages = { ...state.groupMessages }
            if (Object.keys(groupMessages[0][action.message.reciever]).includes("Today")) {
                groupMessages[0][action.message.reciever]["Today"].push(action.message)
            }
            else {
   
                let newObj = { "Today": [action.message], ...groupMessages[0][action.message.sender] }
                groupMessages[0][action.message.sender] = newObj

            }

            return {
                ...state,
                pending: false,
                groupMessages,
            }

        default:
            return state;
    }
}

    // export const getContacts = state => state.contacts;
    // export const getContactsPending = state => state.pending;
    // export const getContactsError = state => state.error;
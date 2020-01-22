import {
    FETCH_MESSAGES_PENDING, FETCH_MESSAGES_SUCCESS, FETCH_MESSAGES_ERROR,
    FETCH_GROUP_MESSAGES_ERROR, FETCH_GROUP_MESSAGES_SUCCESS,
    FETCH_MESSAGES_COUNT_PENDING, FETCH_MESSAGES_COUNT_ERROR, FETCH_MESSAGES_COUNT_SUCCESS
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

        default:
            return state;
    }
}

    // export const getContacts = state => state.contacts;
    // export const getContactsPending = state => state.pending;
    // export const getContactsError = state => state.error;
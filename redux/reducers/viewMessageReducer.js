import {
    FETCH_MESSAGES_COUNT_PENDING, FETCH_MESSAGES_COUNT_ERROR, FETCH_MESSAGES_COUNT_SUCCESS,
    SET_READ_MESSAGE_SUCCESS, SET_READ_MESSAGE_ERROR, SET_READ_MESSAGE_PENDING,
    ADD_MESSAGE_SUCCESS
} from '../constants/constants';

const initialState = {
    pending: false,
    counts: {}
}

export function viewMessageReducer(state = initialState, action) {
    switch (action.type) {
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


        case SET_READ_MESSAGE_SUCCESS:
            return {
                ...state,
                pending: false,
                counts
            }

        case SET_READ_MESSAGE_ERROR:
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
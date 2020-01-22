import { FETCH_MESSAGES_PENDING, FETCH_MESSAGES_SUCCESS, FETCH_MESSAGES_ERROR, 
    FETCH_GROUP_MESSAGES_PENDING, FETCH_GROUP_MESSAGES_SUCCESS, FETCH_GROUP_MESSAGES_ERROR,
FETCH_MESSAGES_COUNT_PENDING, FETCH_MESSAGES_COUNT_SUCCESS, FETCH_MESSAGES_COUNT_ERROR } from '../constants/constants';


export function fetchMessagesPending() {
    return {
        type: FETCH_MESSAGES_PENDING
    }
}

export function fetchMessagesSuccess(messages) {
    return {
        type: FETCH_MESSAGES_SUCCESS,
        messages: messages.data
    }
}

export function fetchMessagesError(error) {
    return {
        type: FETCH_MESSAGES_ERROR,
        error: error
    }
}


export function fetchGroupMessagesPending() {
    return {
        type: FETCH_GROUP_MESSAGES_PENDING
    }
}

export function fetchGroupMessagesSuccess(messages) {
    return {
        type: FETCH_GROUP_MESSAGES_SUCCESS,
        messages: messages.data
    }
}

export function fetchGroupMessagesError(error) {
    return {
        type: FETCH_GROUP_MESSAGES_ERROR,
        error: error
    }
}


import {
    FETCH_MESSAGES_COUNT_PENDING, FETCH_MESSAGES_COUNT_SUCCESS, FETCH_MESSAGES_COUNT_ERROR,
    SET_READ_MESSAGE_PENDING, SET_READ_MESSAGE_SUCCESS, SET_READ_MESSAGE_ERROR
} from '../constants/constants';


//Messages Count

export function fetchMessagesCountPending() {
    return {
        type: FETCH_MESSAGES_COUNT_PENDING
    }
}

export function fetchMessagesCountSuccess(counts) {
    return {
        type: FETCH_MESSAGES_COUNT_SUCCESS,
        counts: counts.data
    }
}

export function fetchMessagesCountError(error) {
    return {
        type: FETCH_MESSAGES_COUNT_ERROR,
        error: error
    }
}

//Set Read

export function setReadPending() {
    return {
        type: SET_READ_MESSAGE_PENDING
    }
}


export function setReadError(error) {
    return {
        type: SET_READ_MESSAGE_ERROR,
        error: error
    }
}

export function setReadSuccess(topic) {
    console.log("setReadSuccess", topic)
    return {
        type: SET_READ_MESSAGE_SUCCESS,
        topic
    }
}
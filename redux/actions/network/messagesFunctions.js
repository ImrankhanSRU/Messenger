import {
    fetchMessagesCountPending, fetchMessagesCountSuccess, fetchMessagesCountError,
    setReadPending, setReadError, setReadSuccess, addNewPrivateMessage, addNewGroupMessage
} from '../viewMessageAction';

import axios from 'axios'

import obj from '../../../components/config'


export function fetchMessagesCount() {
    return dispatch => {
        dispatch(fetchMessagesCountPending());
        axios.post(`${obj.BASE_URL}api/controlCenter/messenger/getUnreadMessageCountByUser`, {
            mobile: obj.mobile
        })
            .then(res => {
                if (res.error) {
                    throw (res.error);
                }
                dispatch(fetchMessagesCountSuccess(res.data));
                return res.data;
            })
            .catch(error => {
                console.log(error)
                dispatch(fetchMessagesCountError(error));
            })
    }
}


export function setRead(topic) {
    return dispatch => {
        dispatch(setReadPending());
        axios.post(`${obj.BASE_URL}api/controlCenter/messenger/makeMessageAsReadByUser`, {
            mobile: obj.mobile,
            topic
        })
            .then(res => {
                if (res.error) {
                    throw (res.error);
                }
                dispatch(fetchMessagesCount())
                // dispatch(setReadSuccess(topic, res));
                // return res;
            })
            .catch(error => {
                console.log(error)
                dispatch(setReadError(error));
            })
    }
}

export function addMessage(message) {
    return dispatch => {
        if (message.reciever.includes('/')) {
            dispatch(addNewGroupMessage(message))
        }
        else {
            dispatch(addNewPrivateMessage(message));
        }
    }
}
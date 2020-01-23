import {
    fetchMessagesCountPending, fetchMessagesCountSuccess, fetchMessagesCountError,
    setReadPending, setReadError, setReadSuccess, addNewPrivateMessage, addNewGroupMessage
} from '../viewMessageAction';

// import { fet }

import obj from '../../../components/config'


export function fetchMessagesCount() {
    return dispatch => {
        dispatch(fetchMessagesCountPending());
        fetch(`${obj.BASE_URL}api/controlCenter/messenger/getUnreadMessageCountByUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ mobile: obj.mobile })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    throw (res.error);
                }
                dispatch(fetchMessagesCountSuccess(res));
                return res;
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
        fetch(`${obj.BASE_URL}api/controlCenter/messenger/makeMessageAsReadByUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ mobile: obj.mobile, topic })
        })
            .then(res => res.json())
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
import {
    fetchMessagesPending, fetchMessagesSuccess, fetchMessagesError,
    fetchGroupMessagesPending, fetchGroupMessagesSuccess, fetchGroupMessagesError,
} from '../messagesActions';

import obj from '../../../components/config'

export function fetchMessages() {
    return dispatch => {
        dispatch(fetchMessagesPending());
        fetch(`${obj.BASE_URL}api/controlCenter/messenger/getLimitedMqttMessageHistoryByTopic`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({mobile: obj.mobile})
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    throw (res.error);
                }
                dispatch(fetchMessagesSuccess(res));
                return res;
            })
            .catch(error => {
                console.log(error)
                dispatch(fetchMessagesError(error));
            })
    }
}

export function fetchGroupMessages(plants) {
    return dispatch => {
        dispatch(fetchGroupMessagesPending());
        fetch(`${obj.BASE_URL}api/controlCenter/messenger/getGroupMessages/${obj.userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({plants})
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    throw (res.error);
                }
                dispatch(fetchGroupMessagesSuccess(res));
                return res;
            })
            .catch(error => {
                console.log(error)
                dispatch(fetchGroupMessagesError(error));
            })
    }
}



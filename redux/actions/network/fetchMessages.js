import {
    fetchMessagesPending, fetchMessagesSuccess, fetchMessagesError,
    fetchGroupMessagesPending, fetchGroupMessagesSuccess, fetchGroupMessagesError,
} from '../messagesActions';
import axios from 'axios'

import obj from '../../../components/config'

export function fetchMessages() {
    return dispatch => {
        dispatch(fetchMessagesPending());
        axios.post(`${obj.BASE_URL}api/controlCenter/messenger/getLimitedMqttMessageHistoryByTopic`, {
            mobile: obj.mobile
        })
            .then(res => {
                if (res.error) {
                    throw (res.error);
                }
                dispatch(fetchMessagesSuccess(res.data));
                return res.data;
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
        axios.post(`${obj.BASE_URL}api/controlCenter/messenger/getGroupMessages/${obj.userId}`, {
            plants
        })
            .then(res => {
                if (res.error) {
                    throw (res.error);
                }
                dispatch(fetchGroupMessagesSuccess(res.data));
                return res.data;
            })
            .catch(error => {
                console.log(error)
                dispatch(fetchGroupMessagesError(error));
            })
    }
}



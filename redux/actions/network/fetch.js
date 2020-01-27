import {
    fetchContactsPending, fetchContactsSuccess, fetchContactsError,
    fetchGroupsSuccess, fetchGroupsError,
    fetchPlantsSuccess, fetchPlantsError
} from '../contactsActions';
import axios from 'axios'


import obj from '../../../components/config'

export function fetchContacts() {
    return dispatch => {
        dispatch(fetchContactsPending());
        axios.get(`${obj.BASE_URL}api/userManagement/getUserDetails`)
            .then(res => {
                if (res.error) {
                    throw (res.error);
                }
                dispatch(fetchContactsSuccess(res.data));
                return res.data;
            })
            .catch(error => {
                console.log(error)
                dispatch(fetchContactsError(error));
            })
    }
}

export function fetchGroups() {
    return dispatch => {
        dispatch(fetchContactsPending());
        axios.get(`${obj.BASE_URL}api/controlCenter/messenger/getAllGroupsByUser/${obj.userId}`)
            .then(res => {
                if (res.error) {
                    throw (res.error);
                }
                dispatch(fetchGroupsSuccess(res.data));
                return res.data;
            })
            .catch(error => {
                console.log(error)
                dispatch(fetchGroupsError(error));
            })
    }
}


export function fetchPlants() {
    let data = {
        country_id_fk: [{ id: 6, itemName: "India" }],
        stream_id_fk: "1"
    }
    data = JSON.stringify(data)
    return dispatch => {
        dispatch(fetchContactsPending());
        axios.post(`${obj.BASE_URL}api/controlCenter/getMultiplePlants`, {
            "country_id_fk": [{ id: 6, itemName: "India" }],
            "stream_id_fk": "1"
        }
        )
            .then(res => {
                if (res.error) {
                    throw (res.error);
                }
                dispatch(fetchPlantsSuccess(res.data));
                return res.data;
            })
            .catch(error => {
                console.log(error)
                dispatch(fetchPlantsError(error));
            })
    }
}
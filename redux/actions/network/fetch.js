import {
    fetchContactsPending, fetchContactsSuccess, fetchContactsError,
    fetchGroupsSuccess, fetchGroupsError, 
    fetchPlantsSuccess, fetchPlantsError
} from '../contactsActions';


import obj from '../../../components/config'

export function fetchContacts() {
    return dispatch => {
        dispatch(fetchContactsPending());
        fetch(`${obj.BASE_URL}api/userManagement/getUserDetails`)
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    throw (res.error);
                }
                dispatch(fetchContactsSuccess(res));
                return res;
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
        fetch(`${obj.BASE_URL}api/controlCenter/messenger/getAllGroupsByUser/${obj.userId}`)
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    throw (res.error);
                }
                dispatch(fetchGroupsSuccess(res));
                return res;
            })
            .catch(error => {
                console.log(error)
                dispatch(fetchGroupsError(error));
            })
    }
}


export function fetchPlants() {
    const data = {
        country_id_fk: [{id: 6, itemName: "India"}],
        stream_id_fk: "1"
    }
    return dispatch => {
        dispatch(fetchContactsPending());
        fetch(`${obj.BASE_URL}api/controlCenter/getMultiplePlants`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(data)
        }
        )
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    throw (res.error);
                }
                dispatch(fetchPlantsSuccess(res));
                return res;
            })
            .catch(error => {
                console.log(error)
                dispatch(fetchPlantsError(error));
            })
    }
}
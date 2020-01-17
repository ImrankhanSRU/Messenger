import {
    fetchContactsPending, fetchContactsSuccess, fetchContactsError,
    fetchGroupsSuccess, fetchGroupsError, 
    fetchPlantsSuccess, fetchPlantsError
} from './actions';

export function fetchContacts() {
    return dispatch => {
        dispatch(fetchContactsPending());
        fetch('http://52.66.213.147:3000/api/userManagement/getUserDetails')
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
        fetch('http://52.66.213.147:3000/api/controlCenter/messenger/getAllGroupsByUser/109')
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
        fetch('http://52.66.213.147:3000/api/controlCenter/getMultiplePlants', {
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
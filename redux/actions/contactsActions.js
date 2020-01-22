import {
    FETCH_CONTACTS_PENDING, FETCH_CONTACTS_SUCCESS, FETCH_CONTACTS_ERROR, FETCH_GROUPS_PENDING,
    FETCH_PLANTS_PENDING,
    FETCH_GROUPS_SUCCESS, FETCH_GROUPS_ERROR, FETCH_PLANTS_SUCCESS, FETCH_PLANTS_ERROR
} from '../constants/constants';



export function fetchContactsPending() {
    return {
        type: FETCH_CONTACTS_PENDING
    }
}

export function fetchContactsSuccess(contacts) {
    contacts.data.map(item => {
        if (item.mobile) {
            item.topic = item.mobile
        }
    })
    return {
        type: FETCH_CONTACTS_SUCCESS,
        contacts: contacts.data
    }
}

export function fetchContactsError(error) {
    return {
        type: FETCH_CONTACTS_ERROR,
        error: error
    }
}

export function fetchGroupsPending() {
    return {
        type: FETCH_GROUPS_PENDING
    }
}


export function fetchGroupsSuccess(groups) {
    groups.data.map(item => {
        if (item.gname) {
            item.topic = `${item.gname}/${item.id}`
        }
    })
    return {
        type: FETCH_GROUPS_SUCCESS,
        groups: groups.data
    }
}

export function fetchGroupsError(error) {
    return {
        type: FETCH_GROUPS_ERROR,
        error: error
    }
}

export function fetchPlantsPending() {
    return {
        type: FETCH_PLANTS_PENDING
    }
}

export function fetchPlantsSuccess(plants) {
    plants.data.map(item => {
        if (item.itemName) {
            item.topic = `plants/${item.itemName}`
        }
    })
    return {
        type: FETCH_PLANTS_SUCCESS,
        plants: plants.data
    }
}

export function fetchPlantsError(error) {
    return {
        type: FETCH_PLANTS_ERROR,
        error: error
    }
}
import {FETCH_CONTACTS_PENDING, FETCH_CONTACTS_SUCCESS, FETCH_CONTACTS_ERROR, 
FETCH_GROUPS_SUCCESS, FETCH_GROUPS_ERROR, FETCH_PLANTS_SUCCESS, FETCH_PLANTS_ERROR } from '../constants/constants';

const initialState = {
    pending: true,
    contacts: [],
    groups: [],
    plants: [],
    error: null
}

export function contactsReducer(state = initialState, action) {
    switch(action.type) {
       
        case FETCH_CONTACTS_SUCCESS:
            return {
                ...state,
                contacts: action.contacts
            }
        case FETCH_CONTACTS_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }

            case FETCH_GROUPS_SUCCESS:
            return {
                ...state,
                groups: action.groups
            }
        case FETCH_GROUPS_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }

            case FETCH_PLANTS_SUCCESS:
            return {
                ...state,
                plants: action.plants
            }
        case FETCH_PLANTS_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }
        default: 
            return state;
    }
}

// export const getContacts = state => state.contacts;
// export const getContactsPending = state => state.pending;
// export const getContactsError = state => state.error;
import { createStore, combineReducers, applyMiddleware } from 'redux';
import {contactsReducer} from './reducers/reducers';
import thunk from 'redux-thunk';

const rootReducer = combineReducers(
{ data: contactsReducer }
);
const configureStore = () => {
return createStore(rootReducer, applyMiddleware(thunk));
}
export default configureStore;
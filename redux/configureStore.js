import { createStore, combineReducers, applyMiddleware } from 'redux';
import { contactsReducer } from './reducers/contactReducer';
import { messageReducer } from './reducers/messageReducer'
import { viewMessageReducer } from './reducers/viewMessageReducer'
import thunk from 'redux-thunk';

const rootReducer = combineReducers({ 
    data: contactsReducer,
    messages: messageReducer,
    view: viewMessageReducer
});
const configureStore = () => {
return createStore(rootReducer, applyMiddleware(thunk));
}
export default configureStore;
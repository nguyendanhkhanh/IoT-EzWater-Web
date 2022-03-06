import { createStore, combineReducers } from 'redux';
import ReducerStore from './reducers';

const appReducers = combineReducers(ReducerStore);

const rootReducer = (state: any, action: any) => {
	//LOGOUT
	return appReducers(state, action);
};

const initialState = {};

const store = createStore(rootReducer, initialState);

export default store;

import { SessionStorageKey } from './../constants/SessionStorageConstants';

function setItem(key: SessionStorageKey, value: any) {
	sessionStorage.setItem(key, value);
}

function getItem(key: SessionStorageKey) {
	return sessionStorage.getItem(key);
}

function removeItem(key: SessionStorageKey) {
	return sessionStorage.removeItem(key);
}

function clear() {
	return sessionStorage.clear();
}

export { setItem, getItem, removeItem, clear };

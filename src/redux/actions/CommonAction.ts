import { ReduxType } from './../../constants/ReduxTypeConstants';

const SessionStorageChange = () => ({
	type: ReduxType.SS_CHANGE,
	payload: null,
});

export { SessionStorageChange };

import { ReduxType } from './../../constants/ReduxTypeConstants';

const mqttReducer = (state = {}, action: any) => {
	switch (action.type) {
		case ReduxType.ADD_MQTT:
			return Object.assign({}, state, action.payload);

		case ReduxType.REMOVE_MQTT:
			return {};
	}
	return state;
};

export default mqttReducer;

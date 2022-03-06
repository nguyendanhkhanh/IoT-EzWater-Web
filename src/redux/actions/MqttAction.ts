import { ReduxType } from './../../constants/ReduxTypeConstants';
import { IMqttData } from './../../types/mqtt.interface';

const addMqttData = (mqttData: IMqttData) => {
	return { type: ReduxType.ADD_MQTT, payload: mqttData };
};

export { addMqttData };

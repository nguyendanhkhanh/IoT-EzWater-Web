import { string } from 'prop-types';
import { FBTopicSub } from '../constants/MqttConstants';

export type IMqttData = {
	[x: string]: number;
};

import { macAddress } from "./InitMacAddress";

export const PrefixTopic = {
	RL0: 'RL0' + macAddress,
	RL1: 'RL0' + macAddress,
	RL2: 'RL1' + macAddress,
	RL3: 'RL2' + macAddress,
	RL4: 'RL3' + macAddress,
}

export const FBTopicSub = {
	temperature: 'ESP/temperature/' + macAddress,
	humidity: 'ESP/humidity/' + macAddress,
	percentSoil: 'ESP/percent_soil/' + macAddress,
	rl1: 'ESPg/RL0/' + macAddress,
	rl2: 'ESPg/RL1/' + macAddress,
	rl3: 'ESPg/RL2/' + macAddress,
	rl4: 'ESPg/RL3/' + macAddress,
	HourUpHRl1: 'ESPgH1/RL1',
	MinuteUpHRl1: 'ESPgM1/RL1',
	HourDownHRl1: 'ESPgH2/RL1',
	MinuteDownHRl1: 'ESPgM2/RL1',
}

export const FBTopicPublish = {
	ActionOnOff: 'ESPn/',
	HourUp: 'APPgH1/RL1',
	MinuteUp: 'APPgM1/RL1',
	HourDown: 'APPgH2/RL1',
	MinuteDown: 'APPgM2/RL1',
}

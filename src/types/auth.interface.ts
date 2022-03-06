export interface ILoginData {
	email: string;
	password: string;
}

export interface ISignupData extends ILoginData {
	mqttCode: string;
}

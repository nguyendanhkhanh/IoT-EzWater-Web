import React, { useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import NavbarComponent from '../components/navbar/Navbar';
import Sidebar from '../components/sidebar/Sidebar';
import { SessionStorageKey } from '../constants/SessionStorageConstants';
import { getItem } from '../service/SessionStorage.service';
import routes from './../routes';
import * as mqtt from 'mqtt';
import getInstanceFirebase from '../firebase/firebase';
import { FBTopicSub } from '../constants/MqttConstants';
import { addMqttData } from '../redux/actions/MqttAction';
import { useDispatch } from 'react-redux';

const firebase = getInstanceFirebase();

const mqttHandle = async (mqttCode: string, callback: (topic: string, payload: number) => void) => {
	const mqttData = await firebase.getMqttByCode(mqttCode);
	try {
		const client = mqtt.connect(`${mqttData.protocal}://${mqttData.host}:${mqttData.port}`, {
			username: mqttData.username,
			password: mqttData.password,
		});
		for (const topic of Object.values(FBTopicSub)) {
			client.subscribe(topic);
		}
		client.on('message', (topic, payload) => {
			callback(topic, +payload.toString());
		});
		return client;
	} catch (error) {
		console.log(error);
	}
};

function Admin(props: any) {
	const [mqttClient, setMqttClient] = useState<mqtt.MqttClient | null>(null);
	const dispatch = useDispatch();
	React.useEffect(() => {
		const mqttCode: string | null = getItem(SessionStorageKey.MqttCode);
		console.log(mqttClient);
		if (!mqttCode) {
			return;
		}
		mqttHandle(mqttCode, (topic, payload) => {
			dispatch(addMqttData({ [topic]: payload }));
		})
			.then(_client => _client && setMqttClient(_client))
			.catch(error => console.log(error));
		return () => {
			mqttClient && mqttClient.removeAllListeners();
			for (const topic of Object.values(FBTopicSub)) {
				mqttClient && mqttClient.unsubscribe(topic);
			}
		};
	}, [dispatch]);
	return (
		<div className='wrapper'>
			<Sidebar {...props} routes={routes} bgColor={'black'} activeColor={'info'} />
			<div className='main-panel'>
				<NavbarComponent />
				<div className='content'>
					<Switch>
						{routes.map((prop, key) => {
							if (prop.name.toUpperCase() === 'HOME') {
								return (
									<Route
										exact
										path={prop.layout || '' + prop.path}
										render={props => <prop.component {...props} mqttClient={mqttClient} />}
										key={key}
									/>
								);
							}
							return <Route path={prop.layout || '' + prop.path} component={prop.component} key={key} />;
						})}
					</Switch>
					<Redirect from='*' to='/home'></Redirect>
				</div>
			</div>
		</div>
	);
}
export default Admin;

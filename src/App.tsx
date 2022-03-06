import React, { useEffect, useState } from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Guest from './layouts/Guest';
import Admin from './layouts/Admin';
import getInstanceFirebase from './firebase/firebase';
import { useSelector } from 'react-redux';
import { getItem } from './service/SessionStorage.service';
import { SessionStorageKey } from './constants/SessionStorageConstants';

const firebase = getInstanceFirebase();

function App() {
	const [isAuthorzi, setIsAuthorzi] = useState(!!firebase.getUserSessionStorage());
	const [isEmailVerified, setIsEmailVerified] = useState(!!firebase.isEmailVerified());
	const [isHasMqttCode, setIsHasMqttCode] = useState(!!getItem(SessionStorageKey.MqttCode));
	const isSSChange = useSelector((state: any) => state.commonReducer.isSSChange);
	useEffect(() => {
		const unSub = firebase.watchStageChange(() => {
			setIsAuthorzi(!!firebase.getUserSessionStorage());
			setIsEmailVerified(!!firebase.isEmailVerified());
		});
		return () => unSub();
	}, []);
	useEffect(() => {
		const mqttCode = getItem(SessionStorageKey.MqttCode);
		setIsHasMqttCode(!!mqttCode);
	}, [isSSChange]);
	return (
		<Router>
			<Switch>
				{!isAuthorzi || !isHasMqttCode || !isEmailVerified ? (
					<Route path='/' component={Guest} key='guest' />
				) : (
					<Route path='/' component={Admin} key='admin' />
				)}
			</Switch>
		</Router>
	);
}

export default App;

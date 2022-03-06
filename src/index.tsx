import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import Store from './redux/Store';

import 'react-notifications/dist/react-notifications.css';
import 'bootstrap/dist/css/bootstrap.css';
import './assets/css/paper-dashboard.css';

const ReactNotifi = require('react-notifications');

ReactDOM.render(
	<>
		<Provider store={Store}>
			<App />
			<ReactNotifi.NotificationContainer />
		</Provider>
	</>,
	document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

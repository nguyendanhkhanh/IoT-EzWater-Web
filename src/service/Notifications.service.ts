const ReactNotifi = require('react-notifications');

const CreateNotification = (type: 'info' | 'success' | 'warning' | 'error') => {
	return (message: string, title?: string, timeout: number = 3000) => {
		switch (type) {
			case 'info':
				ReactNotifi.NotificationManager.info(message, title, timeout);
				break;
			case 'success':
				ReactNotifi.NotificationManager.success(message, title, timeout);
				break;
			case 'warning':
				ReactNotifi.NotificationManager.warning(message, title, timeout);
				break;
			case 'error':
				ReactNotifi.NotificationManager.error(message, title, timeout);
				break;
		}
	};
};

export default CreateNotification;

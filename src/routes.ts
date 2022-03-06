import { IRouter } from './types/router.interface';
import ChangePassword from './views/change-password/ChangePassword';
import Home from './views/home/Home';

const routes: IRouter[] = [
	{
		path: '/home',
		name: 'Home',
		icon: 'nc-icon nc-bank',
		component: Home,
	},
	{
		path: '/change-password',
		name: 'Change password',
		icon: 'nc-icon nc-key-25',
		component: ChangePassword,
	},
];
export default routes;

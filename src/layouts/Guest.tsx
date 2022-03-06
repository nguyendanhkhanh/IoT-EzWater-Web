import { Redirect, Route, Switch } from 'react-router-dom';
import LoginComponent from './../views/login/login';
import SignupComponent from './../views/signup/signup';
import ForgotPasswordComponent from './../views/forgot-password/ForgotPassword';
import ChangePassword from '../views/forgot-password/ChangePassword';
import VerifyEmail from '../views/verify-email/VerifyEmail';

function Guest() {
	return (
		<Switch>
			<Route path='/login' exact component={LoginComponent} key='login' />
			<Route path='/sign-up' component={SignupComponent} key='signup' />
			<Route path='/forgot-password' component={ForgotPasswordComponent} key='forgot-password' />
			<Route path='/change-password' component={ChangePassword} key='change-password' />
			<Route path='/verify-email' component={VerifyEmail} key='verify-email' />
			<Redirect from='/' to='/login' />
		</Switch>
	);
}
export default Guest;

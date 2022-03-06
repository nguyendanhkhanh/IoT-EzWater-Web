import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Field, Formik, Form } from 'formik';
import { ILoginData } from '../../types/auth.interface';
import getInstanceFirebase from './../../firebase/firebase';
import FieldTextInput from '../../components/common/TextInput';
import CreateNotification from '../../service/Notifications.service';
import { clear, setItem } from '../../service/SessionStorage.service';
import { SessionStorageKey } from '../../constants/SessionStorageConstants';
import { useDispatch } from 'react-redux';
import { SessionStorageChange } from '../../redux/actions/CommonAction';
import * as Yup from 'yup';
import { saveDevices } from '../../redux/actions/DeviceAction';
import { MacAddressResponse } from '../../types/device.interface';

const useStyles = makeStyles(theme => ({
	root: {
		height: '100vh',
	},
	image: {
		backgroundImage: 'url(https://source.unsplash.com/random)',
		backgroundRepeat: 'no-repeat',
		backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
		backgroundSize: 'cover',
		backgroundPosition: 'center',
	},
	paper: {
		margin: theme.spacing(8, 4),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

const firebase = getInstanceFirebase();
const LoginValidateSchema = Yup.object().shape({
	email: Yup.string().email('Invalid email').required('Email is required'),
	password: Yup.string().min(6, 'Password too short').max(15, 'Password too long').required('Password is required'),
});

export default function Login(props: any) {
	const classes = useStyles();
	const dispatch = useDispatch();
	React.useEffect(() => {
		if (firebase.isAuthorization()) firebase.logout();
	}, []);
	const login = async (values: ILoginData) => {
		try {
			const result = await firebase.login(values.email, values.password);
			console.log('keytest', result);
			if (result.user) {
				const user = await firebase.getUserDataByUid(result.user.uid);
				const mqttCode = user.docs.pop()?.get('mqttCode');
				if (!mqttCode) throw new Error('Mqtt Code not found!');
				if (!result.user.emailVerified) {
					props['history'].replace('/verify-email');
					// firebase.logout();
					clear();
					return;
				}

				setItem(SessionStorageKey.MqttCode, mqttCode);
				dispatch(SessionStorageChange());
				getDevices(values.email)
			}
			CreateNotification('success')(`Hello ${result.user?.email}`);
		} catch (error: any) {
			if (error.code == 'auth/user-not-found') return CreateNotification('error')(`Wrong username or password`);
			CreateNotification('error')(error.message);
		}
	};

	const getDevices = async (userName: string) => {
		const param = { user_email: userName };

		const res: any = await fetch('http://localhost:8000/api/mac-address', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(param)
		});
		const content = await res.json();

		const listDevices = res.data.map((item: MacAddressResponse) => {
			return {
				macAddress: item.mac_address,
				nameDevice: item.mac_address_name ? item.mac_address_name : `Địa chỉ MAC: ${item.mac_address}`,
				id: item.id
			}
		})
		dispatch(saveDevices(listDevices))
	}

	return (
		<Grid container component='main' className={classes.root}>
			<CssBaseline />
			<Grid item xs={false} sm={4} md={7} className={classes.image} />
			<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component='h1' variant='h5'>
						Sign in
					</Typography>
					<Formik validationSchema={LoginValidateSchema} initialValues={{ email: '', password: '' }} onSubmit={login}>
						{({ errors, touched }) => (
							<Form className={classes.form}>
								<Field
									variant='outlined'
									margin='normal'
									required
									fullWidth
									id='email'
									label='Email Address'
									name='email'
									autoComplete='email'
									component={FieldTextInput}
								/>
								{errors.email && touched.email ? <div className='text-danger'>{errors.email}</div> : null}
								<Field
									variant='outlined'
									margin='normal'
									required
									fullWidth
									name='password'
									label='Password'
									type='password'
									id='password'
									autoComplete='current-password'
									component={FieldTextInput}
								/>
								{errors.password && touched.password ? <div className='text-danger'>{errors.password}</div> : null}
								<Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>
									Sign In
								</Button>
								<Grid container>
									<Grid item xs>
										<Link to='forgot-password'>Forgot password?</Link>
									</Grid>
									<Grid item>
										<Link to='sign-up'>Don't have an account? Sign Up</Link>
									</Grid>
								</Grid>
							</Form>
						)}
					</Formik>
				</div>
			</Grid>
		</Grid>
	);
}

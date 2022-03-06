import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Field, Formik, Form } from 'formik';
import { ISignupData } from '../../types/auth.interface';
import getInstanceFirebase from './../../firebase/firebase';
import FieldTextInput from '../../components/common/TextInput';
import { Link } from 'react-router-dom';
import CreateNotification from '../../service/Notifications.service';
import { SessionStorageKey } from '../../constants/SessionStorageConstants';
import { clear, setItem } from '../../service/SessionStorage.service';
import { useDispatch } from 'react-redux';
import { SessionStorageChange } from '../../redux/actions/CommonAction';
import * as Yup from 'yup';

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
const SignupValidateSchema = Yup.object().shape({
	email: Yup.string().email('Invalid email').required('Email is required'),
	password: Yup.string().min(6, 'Password too short').max(15, 'Password too long').required('Password is required'),
	mqttCode: Yup.string().required('mqttCode is required'),
});
export default function Signup(props: any) {
	const classes = useStyles();
	// const dispatch = useDispatch();
	const signup = async (values: ISignupData) => {
		try {
			const mqttData = await firebase.getMqttByCode(values.mqttCode);
			if (!mqttData) {
				CreateNotification('error')(`MQTT Code not available!`);
				return;
			}
			const result = await firebase.register(values.email, values.password);
			result.user &&
				(await firebase.addDocumentUsers({
					uid: result.user.uid,
					mqttCode: values.mqttCode,
				}));
			if (result.user) {
				if (!result.user.emailVerified) {
					CreateNotification('success')(`Register success, you must verify email for login!`);
					props['history'].replace('/verify-email');
					// firebase.logout();
					clear();
					return;
				}
			}
			// setItem(SessionStorageKey.MqttCode, values.mqttCode);
			// dispatch(SessionStorageChange());
			// CreateNotification('success')(`Register success, Hello ${result.user?.email}`);
		} catch (error: any) {
			CreateNotification('error')(error.message);
		}
	};
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
						Sign up
					</Typography>
					<Formik
						validationSchema={SignupValidateSchema}
						initialValues={{ email: '', password: '', mqttCode: '' }}
						onSubmit={signup}
					>
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
								<Field
									variant='outlined'
									margin='normal'
									required
									fullWidth
									name='mqttCode'
									label='MAC address'
									type='text'
									id='mqtt-code'
									autoComplete='current-password'
									component={FieldTextInput}
								/>
								{errors.mqttCode && touched.mqttCode ? <div className='text-danger'>{errors.mqttCode}</div> : null}
								<Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>
									Create
								</Button>
								<Grid container>
									<Grid item xs>
										<Link to='/login'>Back to Login Screen</Link>
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

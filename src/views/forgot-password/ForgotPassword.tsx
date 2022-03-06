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
import { ILoginData } from '../../types/auth.interface';
import getInstanceFirebase from './../../firebase/firebase';
import FieldTextInput from '../../components/common/TextInput';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import CreateNotification from '../../service/Notifications.service';

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
});
export default function ForgotPassword(props: any) {
	const classes = useStyles();
	React.useEffect(() => {
		if (firebase.isAuthorization()) firebase.logout();
	}, []);
	const forgotPassword = async (values: ILoginData) => {
		try {
			firebase.sendPasswordResetEmail(values.email);
			CreateNotification('success')(`A letter requesting to change your password has been sent to ${values.email}`);
			props['history'].replace('/');
		} catch (error) {
			CreateNotification('error')('');
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
						Forgot password
					</Typography>
					<Formik
						validationSchema={SignupValidateSchema}
						initialValues={{ email: '', password: '' }}
						onSubmit={forgotPassword}
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
								<Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>
									Send
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

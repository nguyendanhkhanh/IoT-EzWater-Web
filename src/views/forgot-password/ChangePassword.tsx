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
import * as queryString from 'querystring';
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
const ChangePasswordValidateSchema = Yup.object().shape({
	password: Yup.string().min(6, 'Password too short').max(15, 'Password too long').required('Password is required'),
	confirmPassword: Yup.string()
		.min(6, 'Password confirm too short')
		.max(15, 'Password confirm too long')
		.required('Password confirm is required')
		.oneOf([Yup.ref('password'), null], 'Password must match'),
});

export default function ChangePassword(props: any) {
	const { search } = props['location'];
	const searchObject = queryString.parse(search);
	const [canReset, setCanReset] = React.useState(true);
	React.useEffect(() => {
		if (search) {
			if (!searchObject['oobCode']) return;
			firebase
				.verifyPasswordResetCode(searchObject['oobCode'].toString())
				.then(() => null)
				.catch(() => setCanReset(false));
		}
	}, [search]);
	const classes = useStyles();
	const submit = React.useCallback(async (value: { password: string; confirmPassword: string }, { resetForm }) => {
		try {
			await firebase.confirmPasswordReset(searchObject['oobCode'].toString(), value.password);
			CreateNotification('success')('Change password successfully!');
			resetForm();
			props['history'].replace('/');
		} catch (error) {
			CreateNotification('error')('');
		}
	}, []);
	return (
		<>
			{!searchObject['oobCode'] || !canReset ? (
				<h1>Page not found</h1>
			) : (
				<Grid container component='main' className={classes.root}>
					<CssBaseline />
					<Grid item xs={false} sm={4} md={7} className={classes.image} />
					<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
						<div className={classes.paper}>
							<Avatar className={classes.avatar}>
								<LockOutlinedIcon />
							</Avatar>
							<Typography component='h1' variant='h5'>
								ChangePassword
							</Typography>
							<Formik
								validationSchema={ChangePasswordValidateSchema}
								initialValues={{ password: '', confirmPassword: '' }}
								onSubmit={submit}
							>
								{({ errors, touched }) => (
									<Form className={classes.form}>
										<Field
											variant='outlined'
											margin='normal'
											required
											fullWidth
											id='password'
											label='Password'
											name='password'
											type='password'
											component={FieldTextInput}
										/>
										{errors.password && touched.password ? <div className='text-danger'>{errors.password}</div> : null}
										<Field
											variant='outlined'
											margin='normal'
											required
											fullWidth
											id='confirmPassword'
											label='Confirm password'
											name='confirmPassword'
											type='password'
											component={FieldTextInput}
										/>
										{errors.confirmPassword && touched.confirmPassword ? (
											<div className='text-danger'>{errors.confirmPassword}</div>
										) : null}
										<Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>
											Submit
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
			)}
		</>
	);
}

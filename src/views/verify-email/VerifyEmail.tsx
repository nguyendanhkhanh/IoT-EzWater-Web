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
import * as queryString from 'querystring';
import { Spinner } from 'reactstrap';

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
export default function VerifyEmail(props: any) {
	const classes = useStyles();
	const { search } = props['location'];
	const searchObject = queryString.parse(search);
	React.useEffect(() => {
		if (search) {
			if (!searchObject['oobCode']) return;
			firebase
				.applyAction(searchObject['oobCode'].toString())
				.then(() => {
					CreateNotification('success')('Verify successfully!');
					props['history'].replace('/login');
				})
				.catch(error => CreateNotification('error')(error.message));
		}
	}, []);
	const curentUser = firebase.getCurrentUser();
	const SendVerify = async () => {
		try {
			const user = firebase.getCurrentUser();
			if (user) {
				user.sendEmailVerification();
				CreateNotification('success')('Email sent!');
			}
		} catch (error: any) {
			CreateNotification('error')(error.message);
		}
	};
	return (
		<>
			{searchObject['oobCode'] ? (
				<>
					<h1>
						Verifing <Spinner />
					</h1>
				</>
			) : !curentUser ? (
				<>
					<h1>Page not found</h1>
					<Link to='/login'>Back to login screen</Link>
				</>
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
								Verify Email
							</Typography>
							<Grid item>
								<Link to='login' onClick={SendVerify}>
									Send verify to email of this account
								</Link>
							</Grid>
						</div>
					</Grid>
				</Grid>
			)}
		</>
	);
}

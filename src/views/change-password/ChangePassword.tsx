import { Field, Form, Formik } from 'formik';
import React from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import CreateNotification from '../../service/Notifications.service';
import FieldTextInput from './../../components/common/TextInput';
import * as Yup from 'yup';
import getInstanceFirebase from '../../firebase/firebase';

const ChangePasswordValidateSchema = Yup.object().shape({
	password: Yup.string().min(6, 'Password too short').max(15, 'Password too long').required('Password is required'),
	confirmPassword: Yup.string()
		.min(6, 'Password confirm too short')
		.max(15, 'Password confirm too long')
		.required('Password confirm is required')
		.oneOf([Yup.ref('password'), null], 'Password must match'),
});
const firebase = getInstanceFirebase();

function ChangePassword() {
	const submit = React.useCallback(async (value: { password: string; confirmPassword: string }, { resetForm }) => {
		try {
			const user = firebase.getCurrentUser();
			if (user) {
				await user.updatePassword(value.password);
				CreateNotification('success')('Change password successfully!');
				resetForm();
			}
		} catch (error:any) {
			console.log(error);
			CreateNotification('error')('');
		}
	}, []);
	return (
		<Card className='card-stats'>
			<CardBody>
				<Formik
					validationSchema={ChangePasswordValidateSchema}
					initialValues={{ password: '', confirmPassword: '' }}
					onSubmit={submit}
				>
					{({ errors, touched }) => (
						<Form>
							<Row>
								<Col md='6' style={{ marginBottom: 10 }}>
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
								</Col>
								<Col md='6' style={{ marginBottom: 10 }}>
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
								</Col>
							</Row>
							<Row>
								<Col className='text-center'>
									<Button className='btn-round' color='primary' type='submit'>
										Submit
									</Button>
								</Col>
							</Row>
						</Form>
					)}
				</Formik>
			</CardBody>
		</Card>
	);
}
export default ChangePassword;

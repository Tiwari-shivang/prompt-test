import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { Container, Row, Col, Button } from 'react-bootstrap'
import { useForm } from 'react-hook-form';
import { Input } from '../widgets/formComponents/Input'
import { useUserLogin } from '../../query/auth/login/loginQuery'
import { BiPhone, BiLock } from "react-icons/bi"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { requiredField, emailPattern, passwordPattern } from '../../utilits/validation'
import logo from '../../assets/brand/logoWhite.svg'
import './authCommon.scss'

const Login = () => {

	const navigate = useNavigate()

	const { register, handleSubmit, errors } = useForm({
		mode: "onTouched"
	});

	const [visiblePassword, setVisiblePassword] = useState(false)
	const { error, isError, isLoading, mutateAsync } = useUserLogin()

	const handleOnSubmit = (data) => {
		// mutateAsync(data)
	}
	return (
		<div className="authBg min-vh-100 d-flex flex-row">
			<Container>
				<Row className='min-vh-100'>
					<Col md={6}>
						<div className='authLeftside pt-5'>
							<div className='logo'>
								<img src={logo} alt="" />
							</div>
							<div className='authContent'>
								<h1>Transform your Employee Lifecycle Management</h1>
								<p>Get all-around productivity and engaged employees—the crucial ingredients for growth.</p>
							</div>
						</div>
					</Col>
					<Col md={6}>
						<div className='authRightside'>
							<div className='authInputform'>
								<div className='loginHeading'>
									<h5>Change Phone Number</h5>
									<p>Enter your new phone number.</p>
								</div>
								<form onSubmit={handleSubmit(handleOnSubmit)}>
									<div className="input-group">
										<div className="input-group-prepend">
											<BiPhone className='icon' />
										</div>
										<Input
											type="text"
											name="phoneNumber"
											className="form-control"
											placeholder={'phone number'}
											reference={register({
												required: requiredField(),
											})}
										/>
									</div>
									<span>
										{
											errors.phoneNumber && (
												<small className="form-text text-danger">{errors.phoneNumber.message}</small>
											)
										}
									</span>
									<Button variant="primary" type='submit'>
										Update
									</Button>
								</form>
							</div>
						</div>
					</Col>
				</Row>
			</Container>
		</div>
	)
}

export default Login

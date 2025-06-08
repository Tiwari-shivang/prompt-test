import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { Container, Row, Col, Button } from 'react-bootstrap'
import { useForm } from 'react-hook-form';
import { Input } from '../widgets/formComponents/Input'
import { BiKey, BiLock } from "react-icons/bi"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { requiredField, emailPattern, passwordPattern } from '../../utilits/validation'
import { useVerifyRecoveryKey, useVerifyValidateKey } from '../../query/twoFactorAuth/addTwoFactorAuth/addTwoFactorAuthQuery';
import logo from '../../assets/brand/logoWhite.svg'
import './authCommon.scss'

const Login = () => {

	const navigate = useNavigate()
	const authDetail = JSON.parse(localStorage.getItem('response'));
	const { register, handleSubmit, errors } = useForm({
		mode: "onTouched"
	});

	const [verifyTroughRecoveryCode, setVerifyTroughRecoveryCode] = useState(false)
	const { mutateAsync : verifyValidateKeyMutateAsync } = useVerifyValidateKey()
	const { mutateAsync: verifyRecoveryKeyMutateAsync } = useVerifyRecoveryKey()

	const handleOnSubmit = (data) => {
		const qrCodeData = {
			code:parseInt(data && data.code),
			user_name: authDetail && authDetail.email,
			uuid: authDetail && authDetail.uuid,
		}
		{
			verifyTroughRecoveryCode ? verifyRecoveryKeyMutateAsync(qrCodeData) : verifyValidateKeyMutateAsync(qrCodeData)
		}
		
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
									<h5>{ verifyTroughRecoveryCode ? "Verify Through Recovery Code" : "OTP verification"}</h5>
									<p>Please check authenticator app for verifications.</p>
								</div>
								<form onSubmit={handleSubmit(handleOnSubmit)}>
									<div className="input-group">
										<div className="input-group-prepend">
											<BiKey className='icon' />
										</div>
										<Input
											type="text"
											name="code"
											placeholder="Enter your OTP here."
											className="form-control"
											reference={register({
												required: requiredField(),
											})}
										/>
									</div>
									<span>
										{
											errors.code && (
												<small className="form-text text-danger">{errors.code.message}</small>
											)
										}
									</span>
	
									<div className="noOtpText mt-4">
										<p>You can request for another OTP after 60 seconds.</p>
									</div>
									
									<Button variant="primary" type='submit'>
										Submit
									</Button>
								</form>
								
								<div className="recoveryCode mt-4">
									{
										verifyTroughRecoveryCode ? <p onClick={()=>{setVerifyTroughRecoveryCode(false)}}>Back to OTP Verify</p>
										:
										<p onClick={()=>{setVerifyTroughRecoveryCode(true)}}>Verify through recovery code</p>
									}									
								</div>

							</div>
						</div>
					</Col>
				</Row>
			</Container>
		</div>
	)
}

export default Login

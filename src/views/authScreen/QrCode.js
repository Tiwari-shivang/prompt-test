import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { Container, Row, Col, Button } from 'react-bootstrap'
import { useForm } from 'react-hook-form';
import { useUserLogin } from '../../query/auth/login/loginQuery'
import logo from '../../assets/brand/logoWhite.svg'
import './authCommon.scss'
import avatar1 from '../../assets/images/avatars/2.jpg'
import { useGetAuthQrCode } from '../../query/twoFactorAuth/getTwoFactorAuth/getTwoFactorAuthQuery';
import { useRecoilValue } from 'recoil';
import { authState } from '../../recoil/authRecoil';
import { QRCodeCanvas } from "qrcode.react";

const Login = () => {

	const navigate = useNavigate()
	const authDetail = JSON.parse(localStorage.getItem('response'));
	const { data , isLoadingFaqs } = useGetAuthQrCode(authDetail && authDetail.uuid);
	const { register, handleSubmit, errors } = useForm({
		mode: "onTouched"
	});

	const handleQRCode = (data) => {
		navigate('/login/otpVerify')
	}

	const qrcode = (
		<QRCodeCanvas
		  id="qrCode"
		  value={data && data.qrCodeUrl}
		  size={200}
		/>
	  );

	return (
		<div className="authBg min-vh-100 d-flex flex-row">
			<Container>
				<Row className='min-vh-100'>
					<Col md={6}>
						<div className='authLeftside pt-5'>
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
										<h5>QR Code</h5>
										<p>Scan this QR code to complete your two-factor authorization.</p>
									</div>
									<div className='logo'>
										{qrcode}
									</div>
									<Button variant="primary" onClick={handleQRCode}>
									  Go Ahead
									</Button>
							</div>
						</div>
					</Col>
				</Row>
			</Container>
		</div>
	)
}

export default Login

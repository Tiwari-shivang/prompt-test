import React, { useEffect, useState } from 'react'
import { Link, useLocation } from "react-router-dom"
import { Container, Row, Col, Button } from 'react-bootstrap'
import { useForm } from 'react-hook-form';
import { Input } from '../widgets/formComponents/Input'
import { BiLock } from "react-icons/bi"
import { requiredField, passwordPattern, otpPattern } from '../../utilits/validation'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useUserForgotPassword, useUserResetPassword } from '../../query/auth/forgotPassword/forgotPasswordQuery'
import logo from '../../assets/brand/logoWhite.svg'
import './authCommon.scss'

const ConfirmPassword = () => {

  const location = useLocation()

  const {register, handleSubmit, watch, errors, reset} = useForm({
    mode:"onTouched"
  });

  const { mutateAsync: resetPasswordMutateAsync } = useUserResetPassword()
  const { mutateAsync: forgotPasswordMutateAsync} = useUserForgotPassword()

  const [visiblePassword, setVisiblePassword] = useState(false)
  const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false)
  const [counter, setCounter] = useState(29)

  useEffect(()=>{
    const timer = counter > 0 && setInterval(() => setCounter(counter-1), 1000);
    return () => clearInterval(timer);
  },[counter])

  const handleToggleEye = (e, inputType, val) => {
    if(inputType === "password"){
      setVisiblePassword(val)
    } else{
      setVisibleConfirmPassword(val)
    }
  }

  const resendOtp = () => {
    forgotPasswordMutateAsync(location.state)
    setCounter(29)
  }


  const handleConfirmPassword = (data) => {
    const newData = {
      ...data,
      "username":location && location.state && location.state.username
    }
    resetPasswordMutateAsync(newData)
    reset("")
  }

  const password = watch("password");

  return (
    <div className="authBg min-vh-100 d-flex flex-row">
        <Container>
            <Row className='min-vh-100'>
                <Col md={6}>
                    <div className='authLeftside pt-5'>
                        <div className='logo'>
                            <img src={logo} alt=""/>
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
                                <h5>Forgot Password</h5>
                                <p>Get all-around productivity and engagement</p>
                            </div>
                            <form onSubmit={handleSubmit(handleConfirmPassword)}>
                            <div className="input-group mt-3">
                                    <div className="input-group-prepend">
                                        <BiLock className='icon'/>
                                    </div>
                                    <Input 
                                       type={visiblePassword ? "text" : "password"}
                                       name="password"
                                       placeholder="Password"
                                       className="form-control"
                                       reference={register({ 
                                        required : requiredField(),
                                        pattern: passwordPattern()
                                       })}
                                      />
                                    <div className="input-group-append">
                                    {
                                        visiblePassword ?
                                        <AiOutlineEyeInvisible className='icon eyetoggleclass' onClick={(e) => handleToggleEye(e, "password", false)}/>
                                        :
                                        <AiOutlineEye className='icon eyetoggleclass' onClick={(e) => handleToggleEye(e, "password", true)}/>
                                      }
                                    </div>
                                </div>
                                {
                                  errors.password && (
                                    <small className="form-text text-danger">{errors.password.message}</small>
                                  )
                                }
                                <div className="input-group mt-3">
                                    <div className="input-group-prepend">
                                        <BiLock className='icon'/>
                                    </div>
                                    <Input 
                                       type={visibleConfirmPassword ? "text" : "password"}
                                       name="confirm_password"
                                       className="form-control"
                                       placeholder="Confirm Password"
                                       reference={register({ 
                                        required : requiredField(),
                                        validate:(value)=>
                                        value === password || "The passwords do not match"
                                       })}
                                      />
                                    <div className="input-group-append">
                                    {
                                        visibleConfirmPassword ?
                                        <AiOutlineEyeInvisible className='icon eyetoggleclass' onClick={(e) => handleToggleEye(e, "confirmPass", false)}/>
                                        :
                                        <AiOutlineEye className='icon eyetoggleclass' onClick={(e) => handleToggleEye(e, "confirmPass", true)}/>
                                      }
                                    </div>
                                </div>
                                {
                                  errors.confirmPassword && (
                                    <small className="form-text text-danger">{errors.confirmPassword.message}</small>
                                  )
                                }
                                <div className="input-group mt-3">
                                    <div className="input-group-prepend">
                                        <BiLock className='icon'/>
                                    </div>
                                    <Input 
                                      type="number"
                                      name="otp"    
                                      placeholder="OTP"                           
                                      reference={register({
                                        required : requiredField(),
                                        pattern: otpPattern()
                                       })}
                                      className="form-control"
                                    />
                                </div>
                                {
                                  errors.otp && (
                                    <small className="form-text text-danger">{errors.otp.message}</small>
                                  )
                                }
                                <div className='mt-2'>
                                <p className='mb-0'>OTP has been sent on {location && location.state && location.state.username}</p>
                                </div>
                                <div className='timer mt-2'>
                                  {
                                    counter && counter > 0 ?
                                    <p className='text-danger'>Resend OTP in 00:{(counter<10?'0':'')+counter}</p>
                                    :
                                    <p className='text-success' onClick={resendOtp}>Resend OTP</p>
                                  }
                                </div>
                                <Button variant="primary" type='submit' className='mt-3'>
                                   Submit Password
                                </Button>
                                <div className="forgotPassword mt-4">
                                    <Link to="/login">Back to Login</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    </div>
  )
}

export default ConfirmPassword

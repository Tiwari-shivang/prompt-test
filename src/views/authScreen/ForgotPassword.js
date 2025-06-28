import React, {useEffect, useState} from 'react'
import { Link, useNavigate } from "react-router-dom"
import { Container, Row, Col, Button } from 'react-bootstrap'
import { Input } from '../widgets/formComponents/Input'
import { useForm } from 'react-hook-form';
import { BiUserCircle, BiLock } from "react-icons/bi"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { requiredField, emailPattern } from '../../utilits/validation'
import { useUserForgotPassword } from '../../query/auth/forgotPassword/forgotPasswordQuery'
import logo from '../../assets/brand/logoWhite.svg'
import './authCommon.scss'

const ForgotPassword = () => {
  let navigate = useNavigate();
  const [username, setUsername] = useState("");
  const {register, handleSubmit, errors} = useForm({
    mode:"onTouched"
  });

  const {status: getApiStatus , error, isError, isLoading, mutateAsync} = useUserForgotPassword()

  useEffect(() => {
    if (getApiStatus == "success") {
      navigate("/confirmPassword", { state: { username: username } })
    }
  }, [getApiStatus == "success"]);

  const handleResetPassword = (data) => {
    mutateAsync(data);
    setUsername(data.username)
  }
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
                            <form onSubmit={handleSubmit(handleResetPassword)}>
                                <div className="input-group mt-4">
                                    <div className="input-group-prepend">
                                        <BiUserCircle className='icon'/>
                                    </div>
                                    <Input 
                                      type="text"
                                      name="username"    
                                      placeholder="Email Id"                            
                                      reference={register({
                                        required : requiredField(),
                                        pattern: emailPattern()
                                       })}
                                      className="form-control"
                                    />
                                </div>
                                <span>
                                {
                                  errors.username && (
                                    <small className="form-text text-danger">{errors.username.message}</small>
                                  )
                                }
                                </span>
                                <Button variant="primary" type='submit' className='mt-4'>
                                   Reset Password
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

export default ForgotPassword

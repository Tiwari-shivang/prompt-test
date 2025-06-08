import React, {useEffect, useState} from 'react'
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom"
import { Container, Row, Col, Button } from 'react-bootstrap'
import { useForm } from 'react-hook-form';
import { Input } from '../widgets/formComponents/Input'
import { useGetLoginSSO, useUserLogin, useVerifyEmailOtp } from '../../query/auth/login/loginQuery'
import { BiUserCircle, BiLock } from "react-icons/bi"
import { useCookies } from 'react-cookie';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { requiredField, emailPattern, passwordPattern } from '../../utilits/validation'
import logo from '../../assets/brand/logoWhite.svg'
import './authCommon.scss'
import { toaster } from '../../utilits/toast';
import { useRecoilValue } from 'recoil';
import { verifyEmail } from '../../recoil/authRecoil';

const Login = () => {

  const navigate = useNavigate()
  const location = useLocation()
  const [cookies, setCookie] = useCookies({});
  const {register, handleSubmit, errors, watch, reset} = useForm({
    mode:"onTouched"
  });
  const universalSearchValue = useRecoilValue(verifyEmail);
  const data = JSON.parse(localStorage.getItem('response'));
	const access_token = data && data.token
  const [visiblePassword, setVisiblePassword] = useState(false)
  const [reload, setRelaod] = useState(false)
  const { error, isError, isLoading, mutateAsync} = useUserLogin()
  const { mutateAsync:otpVerificaion} = useVerifyEmailOtp()

    const handleToggleEye = (e, val) => {
        setVisiblePassword(val);
    };
    const [searchParams] = useSearchParams();

    useEffect(() => {
        if (access_token) {
            navigate(`/dashboard`);
        } else {
            reset(cookies);
        }
    }, [cookies, access_token]);

    useEffect(() => {
		// console.log("first render ");
        // console.log(
        //     "params:",
        //     searchParams && searchParams.get("payload") && JSON.parse(searchParams.get("payload"))
        // );
        if (
            searchParams &&
            searchParams.get("payload") &&
            JSON.parse(searchParams.get("payload")) && 
			JSON.parse(searchParams.get("payload")).token
        ) {
            localStorage.setItem("response", searchParams.get("payload"));
            navigate(`/dashboard`);
        }
    }, []);

    const handleOnSubmit = (data) => {
        if (data && data.rememberMe === true) {
            setCookie("username", data.username);
            setCookie("password", data.password);
            mutateAsync(data);
        } else {
            mutateAsync(data);
        }
    };

    const verifyOtpHandler = () => {
      const email = watch("username");
      const otp = watch("otp");
      const data = {
        username: email,
       // Otp : otp,
      }
      otpVerificaion(data)
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
                                <h5>User Login</h5>
                                <p>Get all-around productivity and engagement</p>
                            </div>
                            <form onSubmit={handleSubmit(handleOnSubmit)}>
                                <div className="input-group"  disabled={universalSearchValue}>
                                    <div className="input-group-prepend">
                                        <BiUserCircle className='icon'/>
                                    </div>
                                    <Input 
                                      type="text"
                                      name="username"
                                      placeholder="Email Id"
                                      className="form-control"
                                      reference={register({
                                        required : requiredField(),
                                        pattern: emailPattern()
                                       })}
                                    />
                                </div>
                                <span>
                                {
                                  errors.username && (
                                    <small className="form-text text-danger">{errors.username.message}</small>
                                  )
                                }
                                </span>
                                <div className="input-group" hidden={!universalSearchValue}>
                                    <div className="input-group-prepend">
                                        <BiUserCircle className='icon'/>
                                    </div>
                                    <Input 
                                      type="text"
                                      name="otp"
                                      placeholder="OTP"
                                      className="form-control otpWidth"
                                      reference={register({
                                       // required : requiredField(),
                                        
                                       })}
                                    />
                                     <div className="input-group-append verifyOtpButton" onClick={verifyOtpHandler}>
                                       Send OTP
                                    </div>
                                </div>
                                {
                                  errors.otp && (
                                    <small className="form-text text-danger">{errors.otp.message}</small>
                                  )
                                }
                                <div className="input-group mt-2">
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
                                       })}
                                      />
                                    <div className="input-group-append">
                                      {
                                        visiblePassword ?
                                        <AiOutlineEyeInvisible className='icon eyetoggleclass' onClick={(e) => handleToggleEye(e, false)}/>
                                        :
                                        <AiOutlineEye className='icon eyetoggleclass' onClick={(e) => handleToggleEye(e, true)}/>
                                      }
                                    </div>
                                </div>
                                  <span>
                                  {
                                    errors.password && (
                                      <small className="form-text text-danger">{errors.password.message}</small>
                                    )
                                  }
                                  </span>
                                <div className="rememberMe my-2">
                                <Input 
                                    type="checkbox" 
                                    name="rememberMe"
                                    reference={register()}
                                    />
                                    Remember me
                                </div>
                                <Button variant="primary" type='submit'>
                                   Sign In
                                </Button>
								{/* <a href = "https://api.dev.korporate.hexaview.in/users/login/sso">
                                	<Button variant="primary">
                                	   Sign In with SSO
                                	</Button>
								</a> */}
                                <div className="forgotPassword mt-2">
                                    <Link to="/forgotPassword">Forgot Password?</Link>
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

export default Login;

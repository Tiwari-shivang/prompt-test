import { useMutation, useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from "recoil";
import { authState, verifyEmail } from "../../../recoil/authRecoil";
import { toaster } from '../../../utilits/toast';
import { userLogin, userLoginBySSO , verifyEmailOtp } from './loginApi';


export const useUserLogin = () => {
	const navigate = useNavigate()
	const setAuthDetailState = useSetRecoilState(authState)
	const setverifyEmailState = useSetRecoilState(verifyEmail)
	return useMutation('userLogin', userLogin, {
		onSuccess: (res, variables, context) => {
			setAuthDetailState(res)
			setverifyEmailState(false)
			localStorage.setItem('response', JSON.stringify(res));
			if(res.mfa_enabled){
				navigate(`/login/otpVerify`)
			} else{
				navigate(`/dashboard`)
			}
			
		},
		onError: (error) => {
			if(error.message==="Please verify your email before logging in."){
				setverifyEmailState(true)
			}
			toaster("error", error.message);
		}
	})
}

export const useVerifyEmailOtp = () => {
	return useMutation('verifyEmailOtp', verifyEmailOtp, {
		onSuccess: (res, variables, context) => {
			toaster("success", res);
		},
		onError: (error) => {
			toaster("error", error.message);
		}
	})
}

export const useGetLoginSSO = () =>{
    return useQuery("userLoginBySSO", userLoginBySSO, {
        onError: (error) =>{
          toaster("error", error.message);
        }
      });
  }
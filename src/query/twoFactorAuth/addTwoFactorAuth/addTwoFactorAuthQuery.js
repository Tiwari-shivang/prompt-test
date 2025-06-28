import { toaster } from '../../../utilits/toast'
import { useNavigate } from "react-router-dom"
import { useMutation } from 'react-query'
import { verifyValidateKey , verifyRecoveryKey, deactivateMfa} from './addTwoFactorAuthApi'
import { useSetRecoilState } from 'recoil'
import { authState } from '../../../recoil/authRecoil'

  export const useVerifyValidateKey = () => {

    const navigate = useNavigate()
    const userDetail = JSON.parse(localStorage.getItem('response'));
    const setAuthDetailState = useSetRecoilState(authState)

    return useMutation('verifyValidateKey', verifyValidateKey, {
      onSuccess: (res, variables, context) =>{
          if(res.valid){
             setAuthDetailState({...userDetail, "token":res.token, "mfa_enabled":true})
             localStorage.setItem('response', JSON.stringify({...userDetail, "token":res.token, "mfa_enabled":true}));
             toaster("success", "Successfully Otp verified"); 
            navigate(`/dashboard`)
          } else{
            toaster("error", "Please enter valid OTP");
          }
      },
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }

  export const useDeactivateMfa = () => {
    const userDetail = JSON.parse(localStorage.getItem('response'));
    const setAuthDetailState = useSetRecoilState(authState)
    return useMutation('deactivateMfa', deactivateMfa, {
      onSuccess: (res, variables, context) =>{
        setAuthDetailState({...userDetail, "mfa_enabled":false})
        localStorage.setItem('response', JSON.stringify({...userDetail, "mfa_enabled":false}));
          toaster("success", "Successfully Deactivate"); 
      },
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }


  export const useVerifyRecoveryKey = () => {
    return useMutation('verifyRecoveryKey', verifyRecoveryKey, {
      onSuccess: (res, variables, context) =>{
          toaster("success", "Successfully Added"); 
      },
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }


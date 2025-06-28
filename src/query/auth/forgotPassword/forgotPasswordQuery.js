import { toaster } from '../../../utilits/toast'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from 'react-query'
import { userForgotPassword, userResetPassword } from './forgotPasswordApi'
import { authState } from "../../../recoil/authRecoil"
import { useSetRecoilState } from "recoil"


export const useUserForgotPassword = () => {
	return useMutation('userForgotPassword', userForgotPassword, {
		onSuccess: (res, variables, context) => {
		},
		onError: (error) => {
			toaster("error", error.message);
		}
	})
}

export const useUserResetPassword = () => {
	const navigate = useNavigate()
	return useMutation('userResetPassword', userResetPassword, {
		onSuccess: (res, variables, context) => {
			toaster("success", "Password Updated Successfully");
			navigate(`/login`)
		},
		onError: (error) => {
			toaster("error", error.message);
		}
	})
}
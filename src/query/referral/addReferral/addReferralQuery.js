import { toaster } from '../../../utilits/toast'
import { useNavigate } from "react-router-dom"
import { addReferral , updateReferral } from './addReferralApi'
import { useMutation, useQueryClient } from 'react-query'

export const useAddReferral = () => {
    const cache = useQueryClient()
    return useMutation('addReferral', addReferral , {
        onSuccess: (res, variables, context) =>{
            toaster("success", "Successfully Created");
            cache.invalidateQueries("getAllReferralByEmpId")
        },
        onError: (error)=>{
            toaster("error", error.message);
        }
    })
  }

  export const useUpdateReferral = () => {
	return useMutation('updateReferral', updateReferral, {
		onSuccess: (res, variables, context) => {
			toaster("success", "Successfully Updated");
		},
		onError: (error) => {
			toaster("error", error.message);
		}
	})
}
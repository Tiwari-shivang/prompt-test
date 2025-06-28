import { toaster } from '../../../utilits/toast'
import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from 'react-query'
import { updateClient } from './updateClientApi'


export const useUpdateClient = () => {
    const navigate = useNavigate()
  return useMutation('updateClient', updateClient, {
    onSuccess: (res, variables, context) =>{
        toaster("success", "Successfully Updated");  
        navigate(-1)
    },
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}
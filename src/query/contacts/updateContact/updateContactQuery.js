import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { toaster } from '../../../utilits/toast'
import { updateContact } from './updateContactApi'


export const useUpdateContact = () => {
    const navigate = useNavigate()
  return useMutation('updateContact', updateContact, {
    onSuccess: (res, variables, context) =>{
        toaster("success", "Successfully Updated");  
        navigate(-1)
    },
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}
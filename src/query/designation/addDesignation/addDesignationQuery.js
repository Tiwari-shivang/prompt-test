import { useMutation } from 'react-query'
import { toaster } from '../../../utilits/toast'
import { addDesignation } from './addDesignationApi'


export const useAddDesignation = () => {
  return useMutation('addDesignation', addDesignation, {
    onSuccess: (res, variables, context) =>{
        toaster("success", "Successfully Added"); 
    },
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}
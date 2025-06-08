import { useMutation, useQueryClient } from 'react-query'
import { toaster } from '../../../utilits/toast'
import { addIdentityDetails } from './addIdentityApi'

export const useAddIdentityDetails = () => {
    const cache = useQueryClient()
    return useMutation('addIdentityDetails', addIdentityDetails , {
        onSuccess: (res, variables, context) =>{
            toaster("success", "Successfully Created");
            cache.invalidateQueries("getIdentityById")
        },
        onError: (error)=>{
            toaster("error", error.message);
        }
    })
  }
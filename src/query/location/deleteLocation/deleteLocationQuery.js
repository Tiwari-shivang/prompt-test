import { useMutation } from 'react-query'
import { toaster } from '../../../utilits/toast'
import { deleteLocation } from './deleteLocationApi'


export const useDeleteLocation = () => {
  return useMutation('deleteLocation', deleteLocation, {
    onSuccess: (res, variables, context) =>{
        toaster("success", "Successfully Deleted"); 
    },
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}
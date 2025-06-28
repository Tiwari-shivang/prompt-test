import { toaster } from '../../../utilits/toast'
import { useMutation, useQueryClient } from 'react-query'
import { addLocation } from './addLocationApi'


export const useAddLocations = () => {
  return useMutation('addLocation', addLocation, {
    onSuccess: (res, variables, context) =>{
        toaster("success", "Successfully Added"); 
    },
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}
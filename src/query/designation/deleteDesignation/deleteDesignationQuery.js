import { toaster } from '../../../utilits/toast'
import { useMutation, useQueryClient } from 'react-query'
import { deleteDesignation } from './deleteDesignationApi'


export const useDeleteDesignation = () => {
  return useMutation('deleteDesignation', deleteDesignation, {
    onSuccess: (res, variables, context) =>{
        toaster("success", "Successfully Deleted"); 
    },
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}
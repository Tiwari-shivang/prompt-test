import { toaster } from '../../../utilits/toast'
import { useMutation, useQueryClient } from 'react-query'
import { deleteContact } from './deleteContactApi'


export const useDeleteContact = () => {
    const cache = useQueryClient()
  return useMutation('deleteContact', deleteContact, {
    onSuccess: (res, variables, context) =>{
        toaster("success", "Successfully Deleted"); 
        cache.invalidateQueries("getClientContactsById")
    },
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}
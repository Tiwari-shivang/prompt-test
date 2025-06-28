import { toaster } from '../../../utilits/toast'
import { useMutation, useQueryClient } from 'react-query'
import { deleteClient } from './deleteClientApi'


export const useDeleteClient = () => {
    const cache = useQueryClient()
  return useMutation('deleteClient', deleteClient, {
    onSuccess: (res, variables, context) =>{
        toaster("success", "Successfully Deleted"); 
        cache.invalidateQueries("getAllClients");
    },
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}
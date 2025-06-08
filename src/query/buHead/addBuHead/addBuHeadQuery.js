import { toaster } from '../../../utilits/toast'
import { useMutation, useQueryClient } from 'react-query'
import { addBuHeads } from './addBuHeadApi'


export const useAddBuHeads = () => {
    const cache = useQueryClient()
  return useMutation('addBuHeads', addBuHeads, {
    onSuccess: (res, variables, context) =>{
        toaster("success", "Successfully Added");
        cache.invalidateQueries("getAllBusinessUnitById")
    },
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}
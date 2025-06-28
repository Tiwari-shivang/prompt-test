import { toaster } from '../../../utilits/toast'
import { useMutation, useQueryClient } from 'react-query'
import { deleteBuHeads } from './deleteBuHeadApi'


export const useDeleteBuHeads = () => {
    const cache = useQueryClient()
  return useMutation('deleteBuHeads', deleteBuHeads, {
    onSuccess: (res, variables, context) =>{
        toaster("success", "Successfully Deleted"); 
        cache.invalidateQueries("getAllBusinessUnitById")
    },
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}
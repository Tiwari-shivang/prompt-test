import { toaster } from '../../../utilits/toast'
import { useMutation, useQueryClient } from 'react-query'
import { deleteFaqs } from './deleteFaqsApi'


export const useDeleteFaqs = () => {
    const cache = useQueryClient()
  return useMutation('deleteFaqs', deleteFaqs, {
    onSuccess: (res, variables, context) =>{
        toaster("success", "Successfully Deleted"); 
        cache.invalidateQueries("getAllFaqs")
    },
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}

import { toaster } from '../../../utilits/toast'
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { useMutation, useQueryClient } from 'react-query'
import { updateFaqs } from './updateFaqsApi'

export const useUpdateFaqs = () => {
    const cache = useQueryClient()
  return useMutation('updateFaqs', updateFaqs, {
    onSuccess: (res, variables, context) =>{
        toaster("success", "Successfully Updated");
        cache.invalidateQueries("getAllFaqs")
    },
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}
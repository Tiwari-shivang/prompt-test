import { toaster } from '../../../utilits/toast'
import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from 'react-query'
import { addfaqs , askQuestionFaqs} from './addFaqsApi'

  export const useAddFaqs = () => {
    const cache = useQueryClient()
    return useMutation('addfaqs', addfaqs, {
      onSuccess: (res, variables, context) =>{
          toaster("success", "Successfully Added"); 
          cache.invalidateQueries("getAllFaqs")
      },
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }

  export const useAskQuestionFaqs= () => {
    return useMutation('askQuestionFaqs', askQuestionFaqs, {
      onSuccess: (res, variables, context) =>{
          toaster("success", "Successfully Added"); 
      },
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }



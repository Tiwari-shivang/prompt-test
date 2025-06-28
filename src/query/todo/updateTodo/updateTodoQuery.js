import { toaster } from '../../../utilits/toast'
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { useMutation, useQueryClient  } from 'react-query'
import { updateTodo } from './updateTodoApi'


export const useUpdateTodo= () => {
    const cache = useQueryClient()
    return useMutation('updateTodo', updateTodo, {
      onSuccess: (res, variables, context) =>{
          toaster("success", "Successfully Updated"); 
          cache.invalidateQueries("getTodo")
      },
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }
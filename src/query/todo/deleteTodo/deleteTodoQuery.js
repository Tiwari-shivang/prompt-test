import { toaster } from '../../../utilits/toast'
import { useMutation, useQueryClient } from 'react-query'
import { deleteTodo } from './deleteTodoApi'

export const useDeleteTodo = () => {
    const cache = useQueryClient()
  return useMutation('deleteTodo', deleteTodo, {
    onSuccess: (res, variables, context) =>{
        toaster("success", "Successfully Deleted"); 
        cache.invalidateQueries("getTodo")
    },
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}
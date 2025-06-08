import { toaster } from '../../../utilits/toast'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getTodo } from './allTodoApi'

export const useGetTodo = (uuid) =>{
    return useQuery(["getTodo", uuid], () =>  getTodo(uuid), {
      onError: (error) =>{
          toaster("error", error.message);
        }
      });
  }
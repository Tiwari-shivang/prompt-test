import { toaster } from '../../../utilits/toast'
import { useMutation, useQueryClient } from 'react-query'
import { addDepartments } from './addDepartmentsApi'


export const useAddDepartments = () => {
    const cache = useQueryClient();
  return useMutation('addDepartments', addDepartments, {
    onSuccess: (res, variables, context) =>{
        toaster("success", "Successfully Added"); 
        cache.invalidateQueries("getAllDepartments");
    },
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}
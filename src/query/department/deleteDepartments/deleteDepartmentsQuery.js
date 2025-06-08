import { useMutation, useQueryClient } from 'react-query';
import { toaster } from '../../../utilits/toast';
import { deleteDepartments } from './deleteDepartmentsApi';


export const useDeleteDepartment = () => {
    const cache = useQueryClient();
  return useMutation('deleteDepartments', deleteDepartments, {
    onSuccess: (res, variables, context) =>{
        toaster("success", "Successfully Deleted"); 
        cache.invalidateQueries("getAllDepartments");
    },
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}
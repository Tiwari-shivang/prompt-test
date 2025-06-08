import { toaster } from '../../../utilits/toast'
import { useMutation, useQueryClient } from 'react-query'
import { deleteEmpSkillRating } from './deleteRatingsApi'


export const useDeleteEmpSkillRating = () => {
    const cache = useQueryClient()
  return useMutation('deleteEmpSkillRating', deleteEmpSkillRating, {
    onSuccess: (res, variables, context) =>{
        toaster("success", "Successfully Deleted"); 
        cache.invalidateQueries("getAllMembers")
    },
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}

import { toaster } from '../../utilits/toast'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getSkills, updateSkillByEmpUuid } from './skillsApi'


export const useGetSkills = () => {
  return useQuery('getSkills', getSkills, {
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}

export const useUpdateSkillByEmpUuid = () => {
  const cache = useQueryClient()
return useMutation('updateSkillByEmpUuid', updateSkillByEmpUuid, {
  onSuccess: (res, variables, context) =>{
      toaster("success", "Successfully Updated"); 
      cache.invalidateQueries("getMembersById")
  },
  onError: (error) =>{
      toaster("error", error.message);
  }
  })
}

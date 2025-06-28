import { useMutation } from 'react-query'
import { useNavigate } from "react-router-dom"
import { toaster } from '../../../utilits/toast'
import { updatePhase, updateProject, updateTeamMember } from './updateProjectsApi'


export const useUpdateTeamMember = () => {
    const navigate = useNavigate()
  return useMutation('updateTeamMember', updateTeamMember, {
    onSuccess: (res, variables, context) =>{
        toaster("success", "Successfully Updated"); 
        navigate(-1)
    },
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}

export const useUpdateProject = () => {
    const navigate = useNavigate()
    return useMutation('updateProject', updateProject, {
      onSuccess: (res, variables, context) =>{
          toaster("success", "Successfully Updated"); 
          navigate('/projects/allProject')
      },
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }

  export const useUpdatePhase = () => {
    const navigate = useNavigate()
    return useMutation('updatePhase', updatePhase, {
      onSuccess: (res, variables, context) =>{
          toaster("success", "Successfully Updated"); 
          navigate(-1)
      },
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }